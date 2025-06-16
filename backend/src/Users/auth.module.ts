import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthServices } from './services/auth.service';
import { users } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServices } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([users]),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthServices, UserServices],
  exports: [AuthServices, UserServices],
})
export class AuthModule { }
