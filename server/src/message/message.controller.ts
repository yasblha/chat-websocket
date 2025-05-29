import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau message' })
    @ApiBody({ type: Message })
    @ApiResponse({ status: 201, description: 'Message créé avec succès', type: Message })
    async createMessage(@Body() message: Message): Promise<Message> {
        return this.messageService.create(message);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Récupérer les messages d\'un utilisateur' })
    @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
    @ApiResponse({ status: 200, description: 'Liste des messages', type: [Message] })
    @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
    async getMessagesByUser(@Param('userId') userId: number): Promise<Message[]> {
        return this.messageService.findMessageBySenderId(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un message' })
    @ApiParam({ name: 'id', description: 'ID du message' })
    @ApiResponse({ status: 200, description: 'Message supprimé avec succès' })
    @ApiResponse({ status: 404, description: 'Message non trouvé' })
    async deleteMessage(@Param('id') id: number): Promise<{ message: string }> {
        await this.messageService.delete(id);
        return { message: 'Message deleted successfully' };
    }
}