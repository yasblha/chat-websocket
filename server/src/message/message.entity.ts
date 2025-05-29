import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

    @Column()
    receiverId: number;

    @Column('text')
    content: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ default: false })
    isRead: boolean;
}