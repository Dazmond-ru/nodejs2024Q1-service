import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';

dotenv.config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const apiSpec = YAML.load('doc/api.yaml');
  const document = SwaggerModule.createDocument(app, apiSpec);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
}
bootstrap();
