import { Module } from '@nestjs/common';
import { UserModule } from './Users/users.module';
import { AuthModule } from './Users/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { users } from "./Users/entities/user.entity"
import { tasks } from "./Users/entities/task.entity"
import { mysqlConfig } from "./config/database.config"
@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    TypeOrmModule.forFeature([users, tasks]),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
