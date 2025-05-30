import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { Message } from '../message/message.entity';
import { JwtService } from '@nestjs/jwt';

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
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        console.log('Connexion refusée: pas de token');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      console.log('Client connecté avec succès:', payload);
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.server.emit('user:disconnected', userId);
      this.broadcastConnectedUsers();
    }
    console.log(`Client déconnecté: ${client.id}`);
  }

  @SubscribeMessage('user:connect')
  async handleUserConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string }
  ) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      
      if (payload.sub !== data.userId) {
        console.log('ID utilisateur invalide');
        return;
      }

      this.connectedUsers.set(client.id, data.userId);
      client.join(`user:${data.userId}`);
      this.server.emit('user:connected', data.userId);
      await this.broadcastConnectedUsers();
      console.log('Utilisateur connecté avec succès:', data.userId);
    } catch (error) {
      console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    }
  }

  private async broadcastConnectedUsers() {
    const connectedUserIds = Array.from(this.connectedUsers.values());
    const users = await Promise.all(
      connectedUserIds.map(async (userId) => {
        const user = await this.userService.findById(Number(userId));
        if (user) {
          const { password, ...userWithoutPassword } = user;
          return { ...userWithoutPassword, isOnline: true, color: user.color };
        }
        return null;
      })
    );
    const validUsers = users.filter(user => user !== null);
    this.server.emit('users:list', validUsers);
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      senderId: string,
      receiverId: string,
      content: string,
      conversationId: number
    }
  ) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);

      // Convertir les IDs en nombres pour la comparaison
      const senderId = Number(data.senderId);
      const payloadId = Number(payload.sub);

      if (payloadId !== senderId) {
        console.log('ID expéditeur invalide:', { payloadId, senderId });
        // Notifier le client d'une erreur spécifique
        client.emit('message:error', { message: 'ID expéditeur invalide' });
        return;
      }

      // Sauvegarder le message dans la base de données
      const message = await this.messageService.create({
        senderId: senderId,
        receiverId: Number(data.receiverId),
        content: data.content,
        conversationId: data.conversationId
      });

      // Récupérer les utilisateurs de la conversation
      const sender = await this.userService.findById(senderId);
      const receiver = await this.userService.findById(Number(data.receiverId));

      // Préparer le message complet avec les informations des utilisateurs
      const fullMessage = {
        ...message,
        sender: { // Assurez-vous que sender et receiver ne sont pas null
          id: sender?.id,
          name: sender?.name,
          email: sender?.email
        },
        receiver: {
          id: receiver?.id,
          name: receiver?.name,
          email: receiver?.email
        }
      };

      // Envoyer le message à tous les clients dans la conversation
      this.server.to(`user:${data.senderId}`).emit('message:receive', fullMessage);
      this.server.to(`user:${data.receiverId}`).emit('message:receive', fullMessage);

      // Envoyer une confirmation à l'expéditeur
      client.emit('message:sent', fullMessage); // Utiliser client.emit pour l'expéditeur spécifique

      // Ne rien retourner ici pour éviter d'envoyer un ack au client sauf en cas de throw
      // return fullMessage; // Supprimé
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      // Notifier le client d\'une erreur générique si une exception se produit
      client.emit('message:error', { message: 'Erreur lors de l\'envoi du message.' });
      // Ne pas throw error ici pour éviter de déclencher le callback d\'erreur côté client de manière inattendue
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
