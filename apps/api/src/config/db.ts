import mongoose from 'mongoose';

export default async function connectDB() {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI não definida.');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado.');
    } catch (error) {
        console.error('Erro ao conectar no MongoDB', error);
        process.exit(1);
    }
}
