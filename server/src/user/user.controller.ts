import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService} from "./user.service";
import { User} from "./user.entity";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
    @ApiBody({ type: User })
    @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès', type: User })
    async create(user: User) {
        return this.userService.create(user);
    }

    @Get()
    @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
    @ApiResponse({ status: 200, description: 'Liste des utilisateurs', type: [User] })
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
    @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
    @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: User })
    @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findById(id);
    }

    @Post(':id')
    @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
    @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
    @ApiBody({ type: User })
    @ApiResponse({ status: 200, description: 'Utilisateur mis à jour avec succès', type: User })
    @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
    async update(@Param('id') id: number, @Body() user: User) {
        return this.userService.update(id, user);
    }
}
