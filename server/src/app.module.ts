import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from './database/database';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { Message } from "./message/message.entity";
import { User} from "./user/user.entity";
import { MessageGateway } from './message-gateway/message-gateway.gateway';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import { ConversationModule } from './conversation/conversation.module';
import { Conversation } from './conversation/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'main',
      entities: [User, Message, Conversation],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    MessageModule,
    AuthModule,
    ConversationModule,
  ],
  providers: [Database, MessageGateway, AuthService, AppService],
  controllers: [UserController, MessageController, AuthController, AppController],
})
export class AppModule {}
