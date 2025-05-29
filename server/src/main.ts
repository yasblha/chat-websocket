import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as process from "node:process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('chat app')
      .setDescription('The chat app API description')
      .setVersion('1.0')
      .addTag('chatapp')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT || 0

  await app.listen(process.env.PORT ?? port);
  console.log(`Application running on port ${await app.getUrl()}`);
}
bootstrap();
console.log(bootstrap());