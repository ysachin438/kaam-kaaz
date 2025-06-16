import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { users } from "../entitys/user.entity";
import { CreateUserDto, UserDataDto } from "../dtos/userdto.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
@Injectable()

export class AuthServices {
    constructor(@InjectRepository(users) private userRepo: Repository<users>, private jwtService: JwtService) { }

    async login(email: string, password: string) {
        try {
            const isuser = await this.userRepo.findOne({ where: { email: email } })
            
            if (isuser) {
                if (await bcrypt.compare(password, isuser.password)) {
                    const { password, isActive, createdAt, ...user } = isuser
                    const token = this.jwtService.sign({
                        userId: user.userId,
                        email: user.email
                    })
                    return { user, auth_token: token }
                }
            }
        } catch (err) {
            console.log("Internal Error Occurred, ", err)
        }

    }
    
    async signup(userData: CreateUserDto) {
        try{

            const hashedpass = await bcrypt.hash(userData.password, 10)
            const newuser = this.userRepo.create({ ...userData, password: hashedpass })
            const savedUser = await this.userRepo.save(newuser)
            
            const token = this.jwtService.sign({
                userId: savedUser.userId,
                email: savedUser.email
                
            })
            
            const { password, isActive, ...user } = savedUser
            
            return {
                user: user,
                auth_token: token,
            }
        }catch(err){
            console.log('Error Occurred auth.service.ts/signup ', err)
            return {message:'Internal Server Error'}
        }
    }
}