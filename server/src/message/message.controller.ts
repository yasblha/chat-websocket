import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('messages')
@Controller('message')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau message' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                senderId: { type: 'number', example: 1 },
                receiverId: { type: 'number', example: 2 },
                content: { type: 'string', example: 'Bonjour, comment vas-tu ?' }
            },
            required: ['senderId', 'receiverId', 'content']
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Message créé avec succès', 
        type: Message,
        schema: {
            example: {
                id: 1,
                senderId: 1,
                receiverId: 2,
                content: 'Bonjour, comment vas-tu ?',
                timestamp: '2024-03-29T19:21:42.000Z',
                isRead: false
            }
        }
    })
    async createMessage(@Body() message: Message): Promise<Message> {
        return this.messageService.create(message);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Récupérer les messages d\'un utilisateur' })
    @ApiParam({ 
        name: 'userId', 
        description: 'ID de l\'utilisateur',
        example: 1
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Liste des messages', 
        type: [Message],
        schema: {
            example: [{
                id: 1,
                senderId: 1,
                receiverId: 2,
                content: 'Bonjour, comment vas-tu ?',
                timestamp: '2024-03-29T19:21:42.000Z',
                isRead: false
            }]
        }
    })
    async getMessagesByUser(@Param('userId') userId: number): Promise<Message[]> {
        return this.messageService.findMessageBySenderId(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un message' })
    @ApiParam({ 
        name: 'id', 
        description: 'ID du message',
        example: 1
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Message supprimé avec succès',
        schema: {
            example: {
                message: 'Message deleted successfully'
            }
        }
    })
    async deleteMessage(@Param('id') id: number): Promise<{ message: string }> {
        await this.messageService.delete(id);
        return { message: 'Message deleted successfully' };
    }
}