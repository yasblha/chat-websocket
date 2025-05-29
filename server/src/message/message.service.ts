import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./message.entity";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async findMessageBySenderId(senderId: number): Promise<Message[]> {
        return this.messageRepository.find({
            where: { senderId },
            order: { timestamp: 'DESC' }
        });
    }

    async create(message: Partial<Message>): Promise<Message> {
        const newMessage = this.messageRepository.create(message);
        return this.messageRepository.save(newMessage);
    }

    update(message: Message) {
        return this.messageRepository.save(message);
    }

    async delete(id: number): Promise<void> {
        await this.messageRepository.delete(id);
    }

    async markAsRead(messageId: number): Promise<void> {
        await this.messageRepository.update(messageId, { isRead: true });
    }
}