import { Injectable } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "src/users/dtos/userdto.dto";
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose";


@Injectable()

/* ***************************************-| M O N G O O S E -- S E R V I C E S |-*************************************** */
export class UserServices {

    constructor(@InjectModel('users') private userModel: Model<any>) { }

    async findAllUser() {
        return await this.userModel.find()
    }

    async findOne(id: number) {
        return await this.userModel.findOne({ where: { userId: id } })
    }

    async addUser(userData: CreateUserDto) {
        const user = new this.userModel(userData)
        return await user.save();
    }

    async updateUser(userId: number, userData: UpdateUserDto): Promise<any> {
        try {
            await this.userModel.updateOne({ userId }, { $set: userData });
            return this.userModel.findOne({ userId });
        } catch (err) {
            console.error('Error while updating user info:', err);
            throw err;
        }
    }

    async deleteUser(userId: number): Promise<void> {
        try {
            await this.userModel.deleteOne({ userId });
        } catch (err) {
            console.error('Error while deleting a user:', err);
            throw err;
        }
    }
}

