import { UserRepository } from './user.repository';
import type { User, CreateUserDTO, LoginUserDTO } from './user.types';
import { hashPassword, comparePassword } from '../../shared/auth/password';

export class UserService {
    constructor(private readonly repository = new UserRepository()) {}

    async createUser(data: CreateUserDTO): Promise<User> {
        const email = data.email.toLowerCase();
        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) throw new Error('Email já está em uso');
        const passwordHash = await hashPassword(data.password);
        const user = await this.repository.create({ name: data.name, email, passwordHash });
        return this.toSafeUser(user);
    }

    async loginUser(data: LoginUserDTO) {
        const user = await this.repository.findByEmail(data.email, true);
        if (!user || !user.isActive) throw new Error('CREDENCIAIS INVÁLIDAS');
        const valid = await comparePassword(data.password, user.passwordHash);
        if (!valid) throw new Error('CREDENCIAIS INVÁLIDAS');
        return this.toSafeUser(user);
    }

    private toSafeUser(user: any) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
