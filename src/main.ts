/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidUnknownValues: true,
    transform: true,
    validateCustomDecorators: true,
    transformOptions: {
      enableImplicitConversion: true,
    }, 
  }))
  app.enableCors()
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(5002);
  console.log('run 5002')
}
bootstrap();
