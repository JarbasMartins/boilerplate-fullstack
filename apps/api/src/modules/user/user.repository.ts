import { UserModel } from './user.schema';

export class UserRepository {
    async findByEmail(email: string, includePassword = false) {
        const query = UserModel.findOne({ email });
        if (includePassword) query.select('+passwordHash');
        return query.exec();
    }

    async create(data: { name: string; email: string; passwordHash: string }) {
        return UserModel.create(data);
    }
}
