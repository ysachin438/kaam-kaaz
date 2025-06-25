import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { Request } from 'express';

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

  const csrfProtection = csurf({
    cookie: {
      key: '_csrf',
      sameSite: 'none', // Important for cross-origin
      secure: true,     // Important for HTTPS
      httpOnly: false,  // Must be false so frontend JS can read it
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
      csurf({
        cookie: {
          key: '_csrf',
          sameSite: 'none',
          secure: true,
          httpOnly: false,
        },
        value: (req: Request) => req.headers['x-xsrf-token'] as string,
      })(req, res, () => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {
          sameSite: 'none',
          secure: true,
          httpOnly: false,
        });
        next();
      });
    } else {
      csrfProtection(req, res, next);
    }
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
