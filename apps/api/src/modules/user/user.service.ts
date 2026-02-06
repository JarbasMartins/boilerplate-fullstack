import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import type { User, CreateUserDTO } from './user.types';

class UserService {
    private userRepository = new UserRepository();

    async createUser(data: CreateUserDTO): Promise<User> {
        const email = data.email.toLowerCase();

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error('Email já está em uso');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.create({
            name: data.name,
            email,
            passwordHash,
        });

        return user;
    }
}

export const userService = new UserService();
