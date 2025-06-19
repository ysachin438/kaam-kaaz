import { Column, Entity, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class tasks {
    @PrimaryGeneratedColumn()
    taskId: number

    @Column({ type: 'int' })
    userId: number

    @Column({ type: "varchar" })
    title: string

    @Column({ type: "varchar" })
    description: string

    @Column({ type: "enum", enum: ['inprogress', 'pending', 'completed'], default: 'pending' })
    status: 'inprogress' | 'pending' | 'completed'

    @Column({ type: "enum", enum: ['high', 'medium', 'low'], default: 'medium' })
    priority: 'high' | 'medium' | 'low'

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: "datetime" })
    due_date: Timestamp
}