import { Module } from '@nestjs/common';
import { UserModule } from './Users/users.module';
import { AuthModule } from './Users/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { users } from "./Users/entities/user.entity"
import { tasks } from "./Users/entities/task.entity";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '@Nubhav438',
      database: 'node_nest',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [users, tasks],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([users, tasks]),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
