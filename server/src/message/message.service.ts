import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./message.entity";
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly conversationService: ConversationService
    ) {}

    async findMessageBySenderId(senderId: number): Promise<Message[]> {
        return this.messageRepository.find({
            where: { senderId },
            relations: ['sender', 'receiver', 'conversation'],
            order: { timestamp: 'DESC' }
        });
    }

    async create(message: Partial<Message>): Promise<Message> {
        // Trouver ou créer une conversation
        let conversation = await this.conversationService.findByUsers(
            message.senderId!,
            message.receiverId!
        );

        if (!conversation) {
            conversation = await this.conversationService.create(
                message.senderId!,
                message.receiverId!
            );
        }

        const newMessage = this.messageRepository.create({
            ...message,
            conversationId: conversation.id,
            timestamp: new Date()
        });
        return this.messageRepository.save(newMessage);
    }

    async getConversationMessages(conversationId: number): Promise<Message[]> {
        console.log('Chargement des messages de la conversation:', conversationId);
        
        const messages = await this.messageRepository.find({
            where: { conversationId },
            relations: ['sender', 'receiver'],
            order: { timestamp: 'ASC' }
        });

        console.log('Messages chargés:', messages.length);
        return messages;
    }

    async update(message: Message) {
        return this.messageRepository.save(message);
    }

    async delete(id: number): Promise<void> {
        await this.messageRepository.delete(id);
    }

    async markAsRead(messageId: number): Promise<void> {
        await this.messageRepository.update(messageId, { isRead: true });
    }

    async findMessagesByConversationId(
        conversationId: number,
        page: number = 1,
        limit: number = 50 // Nombre de messages par page
    ): Promise<Message[]> {
        const skip = (page - 1) * limit;
        return this.messageRepository.find({
            where: { conversationId },
            order: { timestamp: 'ASC' }, // Trier par date pour la pagination
            skip: skip,
            take: limit,
        });
    }

    async searchMessages(conversationId: number, query: string): Promise<Message[]> {
        if (!query || !conversationId) {
            console.log('Paramètres de recherche invalides:', { conversationId, query });
            return [];
        }

        console.log('Recherche de messages:', { 
            conversationId: Number(conversationId), 
            query 
        });
        
        const messages = await this.messageRepository.createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where('message."conversationId" = :conversationId', { conversationId: Number(conversationId) })
            .andWhere('message."content" ILIKE :searchText', { searchText: `%${query}%` })
            .orderBy('message."timestamp"', 'ASC')
            .getMany();

        console.log('Résultats trouvés:', messages.length);
        return messages;
    }
}