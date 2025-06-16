import { Controller, Get, Post, Param, Body, Req, Res,Put, Patch } from "@nestjs/common"
import { createTaskDto} from "../dtos/taskdto.dto"
import { TaskServices } from "../services/task.service";

@Controller('tasks')

/*  -------------------------------------------------------------------------------------------------------------------------
                                                    T A S K  C O N T R O L L E R
    ---------------------------------------------------------------------------------------------------------------------------*/

export class TaskController {
    constructor(private taskService: TaskServices) { }
    @Get(':id')
    getTasksById(@Param('id') id: number) {
        return this.taskService.findAllTasks(id);
    }

    @Get(':id/:postId')
    getTaskById(@Param('id') id: number, @Param('postId') postId : number){
        return this.taskService.getTaskById(id, postId)
    }
    @Post('create/:id')
    addTask(@Param('id') id: number, @Body() taskData: createTaskDto) {
        return this.taskService.addTask(id, taskData)
    }

    @Patch(':id/update')
    updateTask(@Param('id') id:number, @Body() taskData: createTaskDto){
        return this.taskService.updateTask(id, taskData);
    }
}
