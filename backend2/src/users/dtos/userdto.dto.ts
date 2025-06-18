import { isEmail, IsEmail, IsIn, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator'
export class UserDataDto {
    @IsNumber()
    userId: number
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    designation: string
}
export class CreateUserDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsIn(['M','m','F','f'])
    gender: string

    @IsNotEmpty()
    @MinLength(6)
    password: string

}

export class UpdateUserDto{
    @IsNotEmpty()
    @IsOptional()
    name: string
    
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email: string
    
    @IsNotEmpty()
    @IsIn(['M','m','F','f'])
    @IsOptional()
    gender: string
    
    @IsNotEmpty()
    @MinLength(6)
    @IsOptional()
    password: string
}
export class LoginUserDataDto{

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @MinLength(6)
    password: string
}