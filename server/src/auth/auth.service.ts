import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(user: User): Promise<{ access_token: string; user: UserWithoutPassword }> {
        const payload = { username: user.username, sub: user.id };
        const { password, ...userWithoutPassword } = user;
        return {
            access_token: this.jwtService.sign(payload),
            user: userWithoutPassword
        };
    }

    async register(user: Partial<User>): Promise<{ access_token: string; user: UserWithoutPassword }> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: User = {
            name: user.name!,
            email: user.email!,
            password: hashedPassword,
            username: user.username!,
            status: user.status!,
        };

        const createdUser = await this.userService.create(newUser);
        const { password, ...userWithoutPassword } = createdUser;
        const payload = { username: createdUser.username, sub: createdUser.id };

        return {
            access_token: this.jwtService.sign(payload),
            user: userWithoutPassword
        };
    }
}