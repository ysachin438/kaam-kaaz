import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dtos/userdto.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose";
@Injectable()

export class AuthServices {
    constructor(@InjectModel('users') private userModel: Model<any>, private jwtService: JwtService) { }

    async login(email: string, password: string) {
        try {
            const isuser = await this.userModel.findOne({ email });
            console.log("user: ",isuser)
            if (isuser) {
                if (await bcrypt.compare(password, isuser.password)) {
                    console.log("Before Password: ",isuser)
                    const userobj = isuser.toObject()
                    const { password, isActive, createdAt, ...user } = userobj
                    console.log("After Password: ",user)
                    const token = this.jwtService.sign({
                        userId: user._id,
                        email: user.email
                    })
                    console.log("Your token: ",token)
                    return { user, auth_token: token }
                }else{
                    console.log('Hey3')
                    return null
                }
            }else{
                console.log('Hey4')
                return null
            }
        } catch (err) {
            console.log("Internal Error Occurred, ", err)
        }

    }
    // async login(email: string, password: string) {
    //     try {


    //         const isPasswordValid = await bcrypt.compare(password, isuser.password);
    //         if (!isPasswordValid) return null; // invalid password

    //         const userObj = isuser.toObject();
    //         const { password: pwd, isActive, createdAt, ...user } = userObj;

    //         const token = this.jwtService.sign({
    //             userId: user._id,
    //             email: user.email,
    //         });

    //         return { user, auth_token: token };
    //     } catch (err) {
    //         console.error('Internal Error Occurred:', err);
    //         throw err;
    //     }
    // }


    async signup(userData: CreateUserDto) {
        try {

            const hashedpass = await bcrypt.hash(userData.password, 10)
            const newuser = new this.userModel({ ...userData, password: hashedpass })
            const userObj = await newuser.save()
            const savedUser = userObj.toObject();
            // console.log("User added: ", savedUser)
            const token = this.jwtService.sign({
                userId: savedUser._id,
                email: savedUser.email

            })

            const { password, isActive, ...user } = savedUser

            return {
                user: user,
                auth_token: token,
            }
        } catch (err) {
            console.log('Error Occurred auth.service.ts/signup ', err)
            return { message: 'Internal Server Error' }
        }
    }
}