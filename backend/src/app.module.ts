import { Module } from '@nestjs/common';
import { UserModule } from './Users/users.module';
import { AuthModule } from './Users/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { users } from "./Users/entities/user.entity"
import { tasks } from "./Users/entities/task.entity"
import { mysqlConfig } from "./config/database.config"
import { MongooseModule } from '@nestjs/mongoose'
import { taskSchema, userSchema } from './Users/schemas/user.schema';
@Module({
  imports: [
    /********************************************-| MONGOOSE DATABASE CONNECTION |-******************************************************** */
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/node_nest'),
    // MongooseModule.forFeature([{ name: 'users', schema: userSchema }, {name: 'tasks', schema : taskSchema}]),

    /********************************************-| MySQL DATABASE CONNECTION |-********************************************************* */
    TypeOrmModule.forRoot(mysqlConfig),
    TypeOrmModule.forFeature([users, tasks]),

    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
