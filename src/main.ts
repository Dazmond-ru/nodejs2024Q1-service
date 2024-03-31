import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from './logger/logger.service';

dotenv.config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  const loggingService = app.get(CustomLogger);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service OpenAPI 3.0')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Tracks')
    .addTag('Albums')
    .addTag('Artists')
    .addTag('Favs')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', (error) => {
    loggingService.error(JSON.stringify({
      message: 'Uncaught Exception',
      trace: error.stack,
      statusCode: 500,
    }));
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(JSON.stringify({
      message: 'Unhandled Rejection',
      reason: reason instanceof Error ? reason.stack : reason,
      statusCode: 500,
    }));
  });

  await app.listen(port, () => {
    console.log(`Server listen http://localhost:${port}`);
  });
}
bootstrap();
