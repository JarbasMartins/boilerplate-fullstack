import * as z from 'zod';

export const registerSchema = z
    .object({
        name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').nonempty('Nome é obrigatório'),
        email: z.email('Insira um endereço de e-mail válido'),
        password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export type LOGIN_TYPE = z.infer<typeof loginSchema>;
export type REGISTER_TYPE = z.infer<typeof registerSchema>;
