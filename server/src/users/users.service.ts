import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async createUser(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async updateUser(id: number, user: User): Promise<User> {
        const updatedUser = await this.userRepository.preload({
            id,
            ...user,
        });
        return this.userRepository.save(updatedUser);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findOneBy({ id });
    }

    getUserByUsername(userName: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ userName });
    }
    
}
