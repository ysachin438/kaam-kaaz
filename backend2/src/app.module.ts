import { Module } from '@nestjs/common';
import { AuthModule } from './users/auth.module';
import { UserModule } from './users/users.module';
import { MongooseModule } from "@nestjs/mongoose";
import { userSchema, taskSchema } from './users/schemas/user.schema';
@Module({
  imports: [
    /********************************************-| MONGOOSE DATABASE CONNECTION |-******************************************************** */
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/node_nest'),
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }, {name: 'tasks', schema : taskSchema}]),
    AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
