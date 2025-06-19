import { Body, Controller, Get, Param,Put, Post, Req, Res, UsePipes, ValidationPipe, ParseIntPipe, ParseBoolPipe, Query, UseGuards, Patch, Delete } from "@nestjs/common";
import { UserDataDto, CreateUserDto, UpdateUserDto } from "src/Users/dtos/userdto.dto";
import { AuthGuard } from "src/Users/guards/auth.guard";
import { UserServices } from "src/Users/services/user.service";

/*  -------------------------------------------------------------------------------------------------------------------------
                                                    U S E R  C O N T R O L L E R
    ---------------------------------------------------------------------------------------------------------------------------*/
@UseGuards(AuthGuard)
@Controller('users')

export class UserController {
    constructor(private userService: UserServices) { }

    @Get()
    fetchAllUsers() {
        const result = this.userService.findAllUser()
        return result
    }
    @Get(':id')
    GetUserByID(@Param('id') id: number) {
        return this.userService.findOne(id)
    }
    @UsePipes(new ValidationPipe())
    @Put(':id/update')
    async UpdateUser(@Param('id') id: number, @Body() userData: UpdateUserDto){
        const res = await this.userService.updateUser(id, userData)
        return res
    }

    @Delete(':id')
    DeleteUserById(@Param('id') id: number){
        return this.userService.deleteUser(id)
    }










    @Post('create')
    // @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    CreateUser(@Body() userData: CreateUserDto) {
        console.log(userData)
        return this.userService.addUser(userData)
    }

    //Using NESTJS
    @Get(':id/:postId')
    UserById2(@Param('id') id: String, @Param('postId') postId: string) {
        console.log('id :' + id + '\npostId :' + postId)
        return { id: id, postId: postId }
    }
    // @Get()
    getUserByFilter(@Query('sortByAsc', ParseBoolPipe) sortByAsc: Boolean) {
        console.log(sortByAsc)
        return { sortByAsc }

    }

    // @Get(':id')
    GetUserById(@Param('id', ParseIntPipe) id: Number) {
        console.log(id);
        return { id: id }
    }

}