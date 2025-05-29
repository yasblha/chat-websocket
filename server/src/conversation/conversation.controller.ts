import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Message } from '../message/message.entity';

@ApiTags('conversations')
@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle conversation' })
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                user1Id: { type: 'number', example: 1 },
                user2Id: { type: 'number', example: 2 }
            },
            required: ['user1Id', 'user2Id']
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Conversation créée avec succès', 
        type: Conversation,
        schema: {
            example: {
                id: 1,
                user1Id: 1,
                user2Id: 2,
                createdAt: '2024-03-29T19:21:42.000Z',
                isActive: true,
                messages: []
            }
        }
    })
    async createConversation(
        @Body() data: { user1Id: number, user2Id: number }
    ): Promise<Conversation> {
        return this.conversationService.create(data.user1Id, data.user2Id);
    }

    @Get()
    @ApiOperation({ summary: 'Récupérer les conversations de l\'utilisateur connecté' })
    @ApiResponse({ 
        status: 200, 
        description: 'Liste des conversations', 
        type: [Conversation],
        schema: {
            example: [{
                id: 1,
                user1Id: 1,
                user2Id: 2,
                createdAt: '2024-03-29T19:21:42.000Z',
                isActive: true,
                messages: [{
                    id: 1,
                    content: 'Bonjour !',
                    timestamp: '2024-03-29T19:21:42.000Z',
                    isRead: false
                }]
            }]
        }
    })
    async getUserConversations(@Request() req): Promise<Conversation[]> {
        return this.conversationService.getUserConversations(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une conversation par son ID' })
    @ApiParam({ 
        name: 'id', 
        description: 'ID de la conversation',
        example: 1
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Conversation trouvée', 
        type: Conversation,
        schema: {
            example: {
                id: 1,
                user1Id: 1,
                user2Id: 2,
                createdAt: '2024-03-29T19:21:42.000Z',
                isActive: true,
                messages: [{
                    id: 1,
                    content: 'Bonjour !',
                    timestamp: '2024-03-29T19:21:42.000Z',
                    isRead: false
                }]
            }
        }
    })
    async getConversation(@Param('id') id: number): Promise<Conversation> {
        return this.conversationService.findById(id);
    }

    @Get(':id/messages')
    @ApiOperation({ summary: 'Récupérer les messages d\'une conversation' })
    @ApiParam({ 
        name: 'id', 
        description: 'ID de la conversation',
        example: 1
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Liste des messages', 
        type: [Message],
        schema: {
            example: [{
                id: 1,
                content: 'Bonjour !',
                timestamp: '2024-03-29T19:21:42.000Z',
                isRead: false
            }]
        }
    })
    async getConversationMessages(@Param('id') id: number): Promise<Message[]> {
        const conversation = await this.conversationService.findById(id);
        return conversation.messages;
    }
} 