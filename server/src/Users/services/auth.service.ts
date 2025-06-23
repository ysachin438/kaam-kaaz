import { Injectable, UnauthorizedException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { users } from "../entities/user.entity";
import { CreateUserDto, UserDataDto } from "../dtos/userdto.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthServices {
    constructor(@InjectRepository(users) private userRepo: Repository<users>, private jwtService: JwtService) { }

    async login(email: string, password: string) {
        try {
            const user = await this.userRepo.findOne({ where: { email: email } });
            
            if (!user) {
                throw new UnauthorizedException('Invalid email or password');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid email or password');
            }

            const { password: _, isActive, createdAt, ...userData } = user;
            const token = this.jwtService.sign({
                userId: userData.userId,
                email: userData.email
            });

            return {
                token: token,
                userId: userData.userId,
                user: userData
            };
        } catch (err) {
            if (err instanceof UnauthorizedException) {
                throw err;
            }
            console.error("Login error:", err);
            throw new InternalServerErrorException('An error occurred during login');
        }
    }

    async signup(userData: CreateUserDto) {
        try {
            const hashedpass = await bcrypt.hash(userData.password, 10);
            const newuser = this.userRepo.create({ ...userData, password: hashedpass });
            const savedUser = await this.userRepo.save(newuser);
            
            const token = this.jwtService.sign({
                userId: savedUser.userId,
                email: savedUser.email
            });
            
            const { password: _, isActive, ...user } = savedUser;
            
            return {
                token: token,
                userId: user.userId,
                user: user
            };
        } catch (err) {
            console.error('Signup error:', err);
            throw new InternalServerErrorException('An error occurred during signup');
        }
    }
}