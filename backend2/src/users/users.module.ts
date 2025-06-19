import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { UserController } from "./controllers/user.controller";
import { UserServices } from "./services/user.service";
import { AuthMiddleware, secondMiddleware } from "./middlewares/auth.middleware";
import { TaskServices } from "./services/task.service";
import { TaskController } from "./controllers/task.controller";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./auth.module";
import { jwtConfig } from '../config/jwt.config';
import { MongooseModule } from "@nestjs/mongoose";
import { taskSchema, userSchema } from "./schemas/user.schema";

@Module({
    imports: [
        AuthModule,
        JwtModule.register(jwtConfig),
        MongooseModule.forFeature([{ name: 'users', schema: userSchema }, { name: 'tasks', schema: taskSchema }])
    ],
    controllers: [UserController, TaskController],
    providers: [UserServices, TaskServices]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes('users/sad')
            .apply(secondMiddleware)
            .forRoutes({
                path: 'users/:id/sad',
                method: RequestMethod.GET,
            })
            .apply(AuthMiddleware)
            .forRoutes({
                path: 'users/create/asdaas',
                method: RequestMethod.ALL
            })
    }
}