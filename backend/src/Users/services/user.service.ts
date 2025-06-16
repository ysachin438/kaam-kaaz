import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, UserDataDto, UpdateUserDto } from "src/Users/dtos/userdto.dto";
import { users } from "src/Users/entitys/user.entity";
import { Repository } from "typeorm";

@Injectable()

export class UserServices {

    constructor(@InjectRepository(users) private userRepo: Repository<users>) { }

    async findAllUser() {
        return await this.userRepo.find()
    }

    async findOne(id: number) {
        return await this.userRepo.findOne({ where: { userId: id } })
    }

    async addUser(userData: CreateUserDto) {
        const user = this.userRepo.create(userData)
        return await this.userRepo.save(user);
    }

    async updateUser(userId: number, userData: UpdateUserDto) {
        try {
            const res = await this.userRepo
                .createQueryBuilder()
                .update('users')
                .set(userData)
                .where('userId = :userId', { userId: userId })
                .execute();
            return res
        } catch (err) {
            console.log('Error while updating user info', err)
        }
    }



    private fakeUser = [{ name: 'Sachin', designation: 'PHP Trainee' },
    { name: 'Maxwell', designation: 'Cricketer' }]

    getUsers() {
        return this.fakeUser
    }

    CreateUser(userDetails: UserDataDto) {
        this.fakeUser.push(userDetails)
        return 'User Created Success...'
    }

    GetUserById(id) {
        return [{ id, name: 'Maxwell', designation: 'Cricketer' }]
    }
}