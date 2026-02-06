import { Request, Response } from 'express';
import { userService } from './user.service';

class UserController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const user = await userService.createUser({
                name,
                email,
                password,
            });
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message ?? 'Error creating user',
            });
        }
    }
}

export const userController = new UserController();
