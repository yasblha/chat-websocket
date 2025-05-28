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

    findMessageBySenderId(senderId: number) {
        return this.messageRepository.findBy({ senderId });
    }

    Create(message: Message) {
        return this.messageRepository.save(message);
    }

    Update(message: Message) {
        return this.messageRepository.save(message);
    }


}
