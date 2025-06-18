import { users } from "src/Users/entities/user.entity"
import { tasks } from "src/Users/entities/task.entity"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const mongoDB: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '@Nubhav438',
    database: 'node_nest',
    // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    entities: [users, tasks],
    synchronize: true,
}