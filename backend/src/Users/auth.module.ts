import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthServices } from './services/auth.service';
import { users } from './entitys/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServices } from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // optional: make config global
    TypeOrmModule.forFeature([users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        secret: 'qwertyuiop1234567890',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthServices, UserServices],
  exports: [AuthServices, UserServices],
})
export class AuthModule {}
