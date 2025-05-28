import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from './database/database';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { Message } from "./message/message.entity";
import { User} from "./user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres-nest',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'main',
      entities: [User, Message],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    MessageModule,
  ],
  providers: [Database],
  controllers: [UserController, MessageController],
})
export class AppModule {}
