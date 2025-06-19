import { Controller, Get, Post, Delete, Param, Body, Req, Put, UseGuards, Query, UsePipes, ValidationPipe } from "@nestjs/common"
import { createTaskDto } from "../dtos/taskdto.dto"
import { TaskServices } from "../services/task.service";
import { AuthGuard } from "../guards/auth.guard"

@Controller('tasks')

/*  -------------------------------------------------------------------------------------------------------------------------
                                                    T A S K  C O N T R O L L E R
---------------------------------------------------------------------------------------------------------------------------*/
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private taskService: TaskServices) { }

    @Get()
    async getTasks(@Req() req, @Query('status') status?: string) {
        const userId = req.headers['user'].userId;
        const res = await this.taskService.findAllTasks(userId, status);
        return res;
    }

    @Get(':taskId')
    async getTaskById(@Req() req, @Param('taskId') taskId: number) {
        const userId = req.headers['user'].userId;
        return this.taskService.getTaskById(userId, taskId);
    }
    @UsePipes(new ValidationPipe())
    @Post('create')
    async addTask(@Req() req, @Body() taskData: createTaskDto) {
        const userId = req.headers['user'].userId;
        return this.taskService.addTask(userId, taskData);
    }
    
    @UsePipes(new ValidationPipe())
    @Put(':taskId/update')
    async updateTask(@Req() req, @Param('taskId') taskId: number, @Body() taskData: createTaskDto) {
        const userId = req.headers['user'].userId;
        return this.taskService.updateTask(taskId, taskData);
    }
    
    @Delete(':taskId/delete')
    async deleteTask(@Req() req, @Param('taskId') taskId: number) {
        const userId = req.headers['user'].userId;
        return await this.taskService.deleteTask(taskId);
    }
}
