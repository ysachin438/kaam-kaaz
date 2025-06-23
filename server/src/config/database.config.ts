import { users } from "src/Users/entities/user.entity"
import { tasks } from "src/Users/entities/task.entity"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config"

export const mysqlConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: configService.get<string>('DATABASE_HOST'),
    port: parseInt(configService.get<string>('DATABASE_PORT') || '3306', 10),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    entities: [users, tasks],
    // synchronize: true,
})