import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { tasks } from "src/Users/entitys/task.entity";
import { Repository } from "typeorm";
import { createTaskDto } from "../dtos/taskdto.dto";

@Injectable()

export class TaskServices {

    constructor(@InjectRepository(tasks) private taskRepo: Repository<tasks>) { }

    async findAllTasks(id) {
        const tasklist = await this.taskRepo.find({ where: { userId: id } })
        return tasklist
    }

    async getTaskById(userId: number, taskId: number) {
        const task = await this.taskRepo.find({ where: { userId: userId, taskId: taskId } })
        return task
    }

    async addTask(userId: number, taskData: createTaskDto) {
        const task = this.taskRepo.create({ ...taskData, userId: userId })
        const result = await this.taskRepo.save(task);
        return result.taskId
    }
    
    async updateTask(taskId: number, taskData: createTaskDto) {
        await this.taskRepo
            .createQueryBuilder()
            .update('tasks')
            .set(taskData)
            .where('taskId = :taskId', { taskId: taskId })
            .execute();
        return true
    }

}