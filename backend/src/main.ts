import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL', 'http://localhost:3001'),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('IdeaTracker API')
    .setDescription('API для платформы краудсорсинга идей')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Аутентификация')
    .addTag('users', 'Пользователи')
    .addTag('ideas', 'Идеи')
    .addTag('ratings', 'Оценки')
    .addTag('comments', 'Комментарии')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  
  console.log(`🚀 Приложение запущено: http://localhost:${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
