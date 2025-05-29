import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from "./message.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ConversationModule
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
