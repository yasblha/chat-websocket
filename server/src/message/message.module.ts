import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from "./message.entity";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
