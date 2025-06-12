import {IsEmail, IsNotEmpty, isNotEmpty} from 'class-validator'
export class UserDataDto{

    @IsNotEmpty()
    name: String
    
    @IsEmail()
    email:String
}