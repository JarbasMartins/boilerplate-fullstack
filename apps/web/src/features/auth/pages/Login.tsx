import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../../shared/components/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LOGIN_TYPE } from '../schemas/auth.schemas';
import { http } from '../services/http';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LOGIN_TYPE>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    async function onSubmit(data: LOGIN_TYPE) {
        try {
            const user = await http.post('users/login', data);
            navigate('/');
            return user;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Layout title="Entre na sua conta">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                <Input label="Email" type="email" {...register('email')} error={errors.email} />
                <Input label="Senha" type="password" {...register('password')} error={errors.password} />
                <Button type="submit" isLoading={isSubmitting}>
                    Entrar
                </Button>
            </form>
        </Layout>
    );
}
