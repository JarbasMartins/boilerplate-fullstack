import { Request, Response } from 'express';
import { UserService } from './user.service';

const service = new UserService();

export class UserController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const user = await service.createUser({ name, email, password });
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao criar usuário' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await service.loginUser({ email, password });
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(401).json({ message: error.message ?? 'Erro ao entrar' });
        }
    }
}
