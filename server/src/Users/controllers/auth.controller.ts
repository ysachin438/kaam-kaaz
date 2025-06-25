import { Body, Controller, Get, Headers, Param, Post, UseGuards, ValidationPipe, UsePipes, Req, Res } from "@nestjs/common";
import { CreateUserDto, LoginUserDataDto, UserDataDto } from "../dtos/userdto.dto";
import { AuthServices } from "../services/auth.service";
import { UserServices } from "../services/user.service";
import { AuthGuard } from "../guards/auth.guard";
import { Request, Response } from 'express';

@Controller('auth')
/*  -------------------------------------------------------------------------------------------------------------------------
                                                A U T H  C O N T R O L L E R
    ---------------------------------------------------------------------------------------------------------------------------*/
export class AuthController {
    constructor(private authService: AuthServices, private userService: UserServices) { }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() userData: LoginUserDataDto) {
        return await this.authService.login(userData.email, userData.password);
    }
    
    @Post('signup') 
    @UsePipes(new ValidationPipe())
    async signup(@Body() userData: CreateUserDto) {
        return await this.authService.signup(userData);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getProfile(@Headers('user') user: any) {
        return await this.userService.findOne(user.userId);
    }

    @Get('csrf-token')
    getCsrfToken(@Req() req: Request, @Res() res: Response) {
        res.json({ csrfToken: req.csrfToken() });
    }
}