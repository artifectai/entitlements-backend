import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(helmet());
  app.use(compression());
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
  }));
  app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }));

  const sequelize = app.get(Sequelize);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  await app.listen(3001);
}
bootstrap();
