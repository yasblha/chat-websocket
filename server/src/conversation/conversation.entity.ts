import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Conversation {
    @ApiProperty({ example: 1, description: 'Identifiant unique de la conversation' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 1, description: 'Premier participant de la conversation' })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user1Id' })
    user1: User;

    @Column()
    user1Id: number;

    @ApiProperty({ example: 2, description: 'Deuxième participant de la conversation' })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user2Id' })
    user2: User;

    @Column()
    user2Id: number;

    @ApiProperty({ 
        example: '2024-03-29T19:21:42.000Z', 
        description: 'Date de création de la conversation' 
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ 
        type: [Message],
        description: 'Liste des messages de la conversation',
        example: [
            {
                id: 1,
                content: 'Bonjour !',
                timestamp: '2024-03-29T19:21:42.000Z',
                isRead: false
            }
        ]
    })
    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @ApiProperty({ 
        example: true, 
        description: 'Indique si la conversation est active' 
    })
    @Column({ default: true })
    isActive: boolean;
} 