import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Conversation } from '../conversation/conversation.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Message {
    @ApiProperty({ example: 1, description: 'Identifiant unique du message' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 1, description: 'ID de l\'expéditeur' })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column()
    @IsNotEmpty()
    senderId: number;

    @ApiProperty({ example: 2, description: 'ID du destinataire' })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiverId' })
    receiver: User;

    @Column()
    @IsNotEmpty()
    receiverId: number;

    @ApiProperty({ example: 1, description: 'ID de la conversation' })
    @ManyToOne(() => Conversation, conversation => conversation.messages)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    @IsNotEmpty()
    conversationId: number;

    @ApiProperty({ 
        example: 'Bonjour, comment vas-tu ?', 
        description: 'Contenu du message',
        maxLength: 1000
    })
    @Column('text')
    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    content: string;

    @ApiProperty({ 
        example: '2024-03-29T19:21:42.000Z', 
        description: 'Date et heure d\'envoi du message' 
    })
    @CreateDateColumn()
    timestamp: Date;

    @ApiProperty({ 
        example: false, 
        description: 'Indique si le message a été lu' 
    })
    @Column({ default: false })
    isRead: boolean;
}