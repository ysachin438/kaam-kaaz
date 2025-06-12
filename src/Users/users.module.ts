import { Module } from "@nestjs/common"
import { UserController } from "./controllers/users/user.controller";
@Module({
    controllers: [UserController],
})
export class UserModule{

}