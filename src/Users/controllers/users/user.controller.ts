import { Body, Controller, Get, Param, Post, Req, Res, UsePipes, ValidationPipe, ParseIntPipe, ParseBoolPipe, Query } from "@nestjs/common";
import { Request, Response } from 'express';
import { UserDataDto } from "src/Users/dtos/userdto.dto";

@Controller('users')

export class UserController {
    // @Get()
    GetAllUsers() {
        return [{ name: 'Sachin', designation: 'PHP Trainee' }, { name: 'Maxwell', designation: 'Cricketer' }]
    }

    @Get('posts')
    UserPosts() {
        return [{
            name: 'Sachin', designation: 'PHP Trainee',
            Posts: [
                {
                    id: '1', title: 'Post 1'
                },
                {
                    id: '2', title: 'Post 2'
                },
                {
                    id: '1', title: 'Post 3'
                }]
        }]
    }

    @Get('post/comments')
    UserPostComments() {
        return [{
            name: 'Sachin', designation: 'PHP Trainee',
            Posts: { id: '1', title: 'Post 1' },
            Comments: [
                { id: '101', c: 'Good One' },
                { id: '102', c: 'Best One' },
                { id: '103', c: 'Excellent' }
            ]
        }]
    }
    // Using Express Method
    @Post()
    AddUser(@Req() request: Request, @Res() response: Response) {
        console.log(request.body)
        response.send('User Created Successfully.')

    }
    // Using NEST JS Method
    @Post()
    AddUser2(@Body() userdata: UserDataDto) {
        console.log(userdata);
        return { msg: 'User Created Successfully' }

    }
    // Using Express Method
    // @Get(':id')
    // UserById(@Req() req: Request, @Res() res: Response ){
    //     const id = req.params.id
    //     console.log(id)
    //     res.send({msg:`Your Id is: ${id}`})

    // }
    //Using NESTJS
    @Get(':id/:postId')
    UserById2(@Param('id') id: String, @Param('postId') postId: string) {
        console.log('id :' + id + '\npostId :' + postId)
        return { id: id, postId: postId }
    }
    @Get()
    getUserByFilter(@Query('sortByAsc', ParseBoolPipe) sortByAsc: Boolean) {
        console.log(sortByAsc)
        return {sortByAsc}

    }

    @Post('create')
    @UsePipes(new ValidationPipe())
    CreateUser(@Body() userData: UserDataDto) {
        console.log(userData)
        return { userData }
    }
    @Get(':id')
    GetUserById(@Param('id', ParseIntPipe) id: Number) {
        console.log(id);
        return { id: id }
    }
}