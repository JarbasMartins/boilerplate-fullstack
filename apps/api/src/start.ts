import createApp from './app';
import connectDB from './config/db';
import { UserModel } from './modules/user/user.schema';

export async function startServer() {
    await connectDB();

    const app = createApp();
    const PORT = process.env.PORT ?? 3000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
