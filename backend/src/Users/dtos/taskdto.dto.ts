import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class createTaskDto{
    @IsNotEmpty()
    @IsOptional()
    Description?: string
    
    @IsNotEmpty()
    @IsOptional()
    status?: 'start' | 'pending' | 'completed'
}