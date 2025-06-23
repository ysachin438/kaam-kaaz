import { Column, Entity, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class users {
    @PrimaryGeneratedColumn()
    userId: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    gender: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({name: 'e_key'})
    password: string

    @Column({ default: true })
    isActive: boolean;
}
