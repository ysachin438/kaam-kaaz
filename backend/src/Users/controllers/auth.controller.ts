import { Body, Controller, Get, Headers, Param, Post, UseGuards, ValidationPipe, UsePipes } from "@nestjs/common";
import { CreateUserDto, LoginUserDataDto, UserDataDto } from "../dtos/userdto.dto";
import { AuthServices } from "../services/auth.service";
import { UserServices } from "../services/user.service";
import { AuthGuard } from "../guards/auth.guard";

@Controller('auth')
/*  -------------------------------------------------------------------------------------------------------------------------
                                                A U T H  C O N T R O L L E R
    ---------------------------------------------------------------------------------------------------------------------------*/
export class AuthController {
    constructor(private authService: AuthServices, private userService: UserServices) { }

    @Get('login')
    @UseGuards(AuthGuard)
    getUser(@Body() userId: number){
        return this.userService.findOne(userId)
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() userData: LoginUserDataDto) {
        const res = this.authService.login(userData.email, userData.password)
        return res
    }
    
    @Post('signup')
    @UsePipes(new ValidationPipe())
    signup(@Body() userData: CreateUserDto){
        const res = this.authService.signup(userData)
        return res
    }

}