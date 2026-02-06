import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlenght: 2 },
        email: { type: String, required: true, unique: true, trim: true, index: true, lowercase: true },
        passwordHash: { type: String, required: true, select: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false },
);

export const UserModel = mongoose.model('User', userSchema);
