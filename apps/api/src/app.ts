import express from 'express';
import cors from 'cors';
import { router as userRouter } from './modules/user/user.routes';

export default function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    app.use('/users', userRouter);

    return app;
}
