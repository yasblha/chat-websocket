import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async update(id: number, updatedUser: Partial<User>): Promise<User> {
        await this.userRepository.update(id, updatedUser);
        return this.findById(id);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }
}
