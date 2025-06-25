import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //------------------------ CORS Activation ---------------------------------------
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
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
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(cookieParser());

  const csrfProtection = csurf({
    cookie: { 
      key: '_csrf', 
      sameSite: true, 
      httpOnly: true 
    },
    value: (req: Request) => {
      const token = req.headers['x-xsrf-token'];
      if (typeof token === 'string') {
        return token;
      }
      return '';
    },
  });
  
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      csurf({ cookie: true, value: (req: Request) => req.headers['x-xsrf-token'] as string })(req, res, () => {
         res.cookie('XSRF-TOKEN', req.csrfToken(), { sameSite: true });
         next();
      });
    } else {
      csrfProtection(req, res, next);
    }
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
