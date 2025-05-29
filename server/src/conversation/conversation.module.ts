import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Conversation])],
    providers: [ConversationService],
    exports: [ConversationService],
    controllers: [ConversationController]
})
export class ConversationModule {} 