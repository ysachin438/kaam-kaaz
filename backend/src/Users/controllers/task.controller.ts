import { Controller, Get, Post, Delete, Param, Body, Req, Put, UseGuards } from "@nestjs/common"
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
    async getTasks(@Req() req) {
        const userId = req.headers['user'].userId;
        const res = await this.taskService.findAllTasks(userId);
        console.log(res)
        return res
    }

    @Get(':taskId')
    async getTaskById(@Req() req, @Param('taskId') taskId: number) {
        const userId = req.headers['user'].userId;
        return this.taskService.getTaskById(userId, taskId);
    }

    @Post('create')
    async addTask(@Req() req, @Body() taskData: createTaskDto) {
        const userId = req.headers['user'].userId;
        return this.taskService.addTask(userId, taskData);
    }

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
