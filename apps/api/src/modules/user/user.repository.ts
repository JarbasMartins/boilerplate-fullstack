import { UserModel } from './user.schema';

export class UserRepository {
    async findByEmail(email: string) {
        return UserModel.findOne({ email });
    }

    async create(data: { name: string; email: string; passwordHash: string }) {
        return UserModel.create(data);
    }
}
