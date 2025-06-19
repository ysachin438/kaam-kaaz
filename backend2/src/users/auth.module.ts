import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthServices } from './services/auth.service';
import { UserServices } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import { MongooseModule } from "@nestjs/mongoose";
import { taskSchema, userSchema } from "./schemas/user.schema";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register(jwtConfig),
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }, { name: 'tasks', schema: taskSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthServices, UserServices],
  exports: [AuthServices, UserServices],
})
export class AuthModule { }
