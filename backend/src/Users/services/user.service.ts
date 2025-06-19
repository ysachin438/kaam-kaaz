import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, UserDataDto, UpdateUserDto } from "src/Users/dtos/userdto.dto";
import { users } from "src/Users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()

/* ***************************************-| M y S Q L -- S E R V I C E S |-******************************************** */
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
            await this.userRepo
                .createQueryBuilder()
                .update('users')
                .set(userData)
                .where('userId = :userId', { userId: userId })
                .execute();
            return await this.userRepo.findOne({ where: { userId: userId } })
        } catch (err) {
            console.log('Error while updating user info', err)
        }
    }

    async deleteUser(userId: number): Promise<void> {
        try {
            // await this.userRepo.delete({userId: userId})
            await this.userRepo
                .createQueryBuilder()
                .delete()
                .from('users')
                .where('userId = :userId', { userId })
                .execute();
        } catch (err) {
            console.log('Error while deleting a user ', err)
        }
    }
}
/* ***************************************-| M O N G O O S E -- S E R V I C E S |-*************************************** */

import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose";
@Injectable()
export class UserServices2{
    constructor(@InjectModel('User') private userModel: Model<any>) {}

    async findAllUser(){
        return this.userModel.find()
    }

    async findOne(id: number){
        return await this.userModel.findOne({ where: { userId: id } })
    }

    async addUser(userData: CreateUserDto){
        const newUser = new this.userModel(userData); 
        return await newUser.save()
    }


}
