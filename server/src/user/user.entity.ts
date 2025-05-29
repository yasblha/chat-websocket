import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @ApiProperty({ example: 1, description: 'Identifiant unique de l\'utilisateur' })
    @PrimaryGeneratedColumn()
    id?: number;

    @ApiProperty({ example: 'John Doe', description: 'Nom complet de l\'utilisateur' })
    @Column()
    name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Email de l\'utilisateur' })
    @Column()
    email: string;

    @ApiProperty({ example: 'hashedPassword123', description: 'Mot de passe hashé' })
    @Column()
    password: string;

    @ApiProperty({ example: 'johndoe', description: 'Nom d\'utilisateur unique' })
    @Column()
    username: string;

    @ApiProperty({ example: 'active', description: 'Statut de l\'utilisateur (active/inactive)' })
    @Column()
    status: string;
}