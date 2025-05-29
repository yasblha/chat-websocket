import { Injectable } from '@nestjs/common';
import { User} from "./user.entity";

@Injectable()
export class UserService {
    private readonly users: User[] = [];

    create(user: User) {
        this.users.push(user);
        return user;
    }

    findById(id: number): User {
        return this.users.find(user => user.id === id);
    }

    findAll(): User[] {
        return this.users;
    }

    delete(id: number): void {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }

    update(id: number, updatedUser: Partial<User>): User {
        const user = this.users.find(user => user.id === id);
        if (user) {
            Object.assign(user, updatedUser);
        }
        return user;
    }

    findByEmail(email: string): User {
        return this.users.find(user => user.email === email);
    }
}
