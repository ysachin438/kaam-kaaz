import { IsNotEmpty, IsOptional, IsArray } from "class-validator";

export class createTaskDto {
    @IsNotEmpty()
    @IsOptional()
    title?: string
    
    @IsNotEmpty()
    @IsOptional()
    description?: string

    @IsNotEmpty()
    @IsOptional()
    status?: 'inprogress' | 'pending' | 'completed'

    @IsNotEmpty()
    @IsOptional()
    priority?: 'high' | 'medium' | 'low'

    @IsOptional()
    due_date?: Date

    @IsOptional()
    @IsArray()
    subtasks?: { title: string; completed: boolean }[];
}