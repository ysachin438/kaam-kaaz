import { Injectable } from "@nestjs/common";
import { createTaskDto } from "../dtos/taskdto.dto";
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose";

@Injectable()

export class TaskServices {

    constructor(@InjectModel('tasks') private taskModel: Model<any>) { }

    async findAllTasks(id: number, status?: string) {
        if (status && !['inprogress', 'pending', 'completed'].includes(status)) {
            return [];
        }

        const filter: any = { userId: id };
        if (status) {
            filter.status = status as 'inprogress' | 'pending' | 'completed';
        }

        // Query with Mongoose
        const taskList = await this.taskModel.find(filter);
        return taskList;
    }
    
    async getTaskById(userId: number, taskId: number) {
        const task = await this.taskModel.find({ where: { userId: userId, taskId: taskId } })
        return task
    }

    async addTask(userId: number, taskData: createTaskDto) {
        const newTask = new this.taskModel({ ...taskData, userId: userId })
        const result = await newTask.save();
        return result.taskId
    }

    async updateTask(taskId: number, taskData: createTaskDto) {
        try {
            await this.taskModel.updateOne({ taskId }, { $set: taskData });
            return this.taskModel.findOne({ taskId });
        } catch (err) {
            console.error('Error while updating user info:', err);
            throw err;
        }
    }

    async deleteTask(taskId: number) {
        try {
            await this.taskModel.deleteOne({ taskId });
            return { message: "Task deleted successfully" }
        } catch (err) {
            console.log('Error while deleting a task ', err)
            return { message: "Task deleted successfully" }
        }
    }

}