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

  await app.listen(port, () => {
    console.log(`Server listen http://localhost:${port}`);
  });

  process.on('uncaughtException', (error) => {
    const errorData = {
      message: 'Uncaught Exception',
      trace: error.stack,
      statusCode: 500,
    };
    loggingService.error(JSON.stringify(errorData));
  });

  process.on('unhandledRejection', (reason) => {
    const errorData = {
      message: 'Unhandled Rejection',
      reason: reason instanceof Error ? reason.stack : reason,
      statusCode: 500,
    };

    loggingService.error(JSON.stringify(errorData));
  });
}
bootstrap();
