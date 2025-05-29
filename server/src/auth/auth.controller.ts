import {Controller, Post, Body, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Connexion utilisateur' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { 
                    type: 'string', 
                    example: 'user@example.com',
                    description: 'Email de l\'utilisateur'
                },
                password: { 
                    type: 'string', 
                    example: 'password123',
                    description: 'Mot de passe de l\'utilisateur'
                }
            },
            required: ['email', 'password']
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Connexion réussie',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'user@example.com' },
                        username: { type: 'string', example: 'johndoe' },
                        status: { type: 'string', example: 'active' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Identifiants invalides' })
    async login(@Body() { email, password }: { email: string; password: string }) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { 
                    type: 'string', 
                    example: 'John Doe',
                    description: 'Nom complet de l\'utilisateur'
                },
                email: { 
                    type: 'string', 
                    example: 'user@example.com',
                    description: 'Email de l\'utilisateur'
                },
                password: { 
                    type: 'string', 
                    example: 'password123',
                    description: 'Mot de passe de l\'utilisateur'
                },
                username: { 
                    type: 'string', 
                    example: 'johndoe',
                    description: 'Nom d\'utilisateur unique'
                },
                status: { 
                    type: 'string', 
                    example: 'active',
                    description: 'Statut de l\'utilisateur'
                }
            },
            required: ['name', 'email', 'password', 'username']
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Utilisateur créé avec succès',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'user@example.com' },
                        username: { type: 'string', example: 'johndoe' },
                        status: { type: 'string', example: 'active' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async register(@Body() user: Partial<User>) {
        return this.authService.register(user);
    }
}