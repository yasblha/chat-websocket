import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { Message } from '../message/message.entity';

@WebSocketGateway({ 
  cors: true,
  namespace: 'chat'
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, string> = new Map(); // socketId -> userId

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.server.emit('user:disconnected', { userId });
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('user:connect')
  async handleUserConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string }
  ) {
    this.connectedUsers.set(client.id, data.userId);
    client.join(`user:${data.userId}`);
    this.server.emit('user:connected', { userId: data.userId });
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @MessageBody() data: { 
      senderId: string, 
      receiverId: string, 
      content: string,
      timestamp?: Date 
    }
  ) {
    try {
      // Sauvegarder le message dans la base de données
      const message = await this.messageService.create({
        senderId: Number(data.senderId),
        receiverId: Number(data.receiverId),
        content: data.content,
        timestamp: data.timestamp || new Date()
      });

      // Envoyer le message au destinataire spécifique
      this.server.to(`user:${data.receiverId}`).emit('message:receive', message);
      
      // Envoyer une confirmation à l'expéditeur
      this.server.to(`user:${data.senderId}`).emit('message:sent', message);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  @SubscribeMessage('message:typing')
  handleTyping(
    @MessageBody() data: { senderId: string, receiverId: string, isTyping: boolean }
  ) {
    this.server.to(`user:${data.receiverId}`).emit('message:typing', {
      userId: data.senderId,
      isTyping: data.isTyping
    });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @MessageBody() data: { messageId: string, userId: string }
  ) {
    try {
      await this.messageService.markAsRead(Number(data.messageId));
      this.server.emit('message:read', {
        messageId: data.messageId,
        userId: data.userId
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
}
