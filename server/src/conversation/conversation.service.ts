import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>
    ) {}

    async create(user1Id: number, user2Id: number): Promise<Conversation> {
        const conversation = this.conversationRepository.create({
            user1Id,
            user2Id
        });
        return this.conversationRepository.save(conversation);
    }

    async findById(id: number): Promise<Conversation> {
        return this.conversationRepository.findOne({
            where: { id },
            relations: ['user1', 'user2', 'messages']
        });
    }

    async findByUsers(user1Id: number, user2Id: number): Promise<Conversation> {
        return this.conversationRepository.findOne({
            where: [
                { user1Id, user2Id },
                { user1Id: user2Id, user2Id: user1Id }
            ],
            relations: ['user1', 'user2', 'messages']
        });
    }

    async getUserConversations(userId: number): Promise<Conversation[]> {
        return this.conversationRepository.find({
            where: [
                { user1Id: userId },
                { user2Id: userId }
            ],
            relations: ['user1', 'user2', 'messages']
        });
    }

    async deactivate(id: number): Promise<void> {
        await this.conversationRepository.update(id, { isActive: false });
    }
} 