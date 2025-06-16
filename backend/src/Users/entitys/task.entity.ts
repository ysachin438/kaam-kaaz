import { Column, Entity, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class tasks {
    @PrimaryGeneratedColumn()
    taskId: number

    @Column({ type: 'int' })
    userId: number

    @Column({ type: "varchar" })
    description: string

    @Column({ type: "enum", enum: ['start', 'pending', 'completed'], default: 'pending' })
    status: 'start' | 'pending' | 'completed'

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // @Column({ type: "datetime" })
    // due_date: Timestamp
}