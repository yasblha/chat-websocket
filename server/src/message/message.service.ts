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
            conversationId: conversation.id
        });
        return this.messageRepository.save(newMessage);
    }

    async getConversationMessages(conversationId: number): Promise<Message[]> {
        return this.messageRepository.find({
            where: { conversationId },
            relations: ['sender', 'receiver'],
            order: { timestamp: 'ASC' }
        });
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
}