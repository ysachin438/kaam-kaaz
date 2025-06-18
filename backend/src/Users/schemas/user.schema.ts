import mongoose, { Schema } from "mongoose";
import { timeStamp } from "node:console";
export const userSchema = new Schema({
    userId: Number,
    name: String,
    email: String,
    gender: {type: String, enum: ['M', 'm', 'F', 'f', 'O','o']},
    // created_at: Date,
    // updated_at: Date, Since Mongoose Give inbuilt methods
    e_key: String,
    isActive: Boolean,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    
});

export const taskSchema = new Schema({
    taskId: Number,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: userSchema},
    title: String,
    description: String,
    due_date: Date,
    priority: {type: String, enum:['high','medium','low']},
    status: {type:String, enum:['inprogress','pending','completed']},
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
})