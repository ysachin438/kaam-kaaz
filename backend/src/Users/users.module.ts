import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { UserController } from "./controllers/user.controller";
import { UserServices } from "./services/user.service";
import { AuthMiddleware, secondMiddleware } from "./middlewares/auth.middleware";
import { TaskServices } from "./services/task.service";
import { TaskController } from "./controllers/task.controller";
import { TypeOrmModule } from '@nestjs/typeorm'
import { users} from "./entitys/user.entity"
import { tasks } from "./entitys/task.entity";
@Module({
    imports: [TypeOrmModule.forFeature([users, tasks])],
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