import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //------------------------ CORS Activation ---------------------------------------
  app.enableCors({
    origin: [
      'https://kaam-kaaz-1.onrender.com', // Render frontend
      'https://kaam-kaaz.onrender.com',   // Render backend (optional)
      'http://localhost:3000',             // local backend (optional)
      'http://localhost:3001',             // local frontend (optional)
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'auth_token',
      'Access-Control-Allow-Headers',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'X-XSRF-TOKEN',
    ],
    exposedHeaders: ['auth_token'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(cookieParser());

  // CSRF protection is temporarily disabled for development/testing

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
