import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // URL de ton client React
    credentials: true, // Autoriser l'envoi des cookies
  });
  await app.listen(3001); // Ou tout autre port
}
bootstrap();