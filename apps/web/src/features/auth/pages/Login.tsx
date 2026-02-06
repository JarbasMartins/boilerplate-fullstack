import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../../shared/components/Button';
import { loginSchema, type LOGIN_TYPE } from '../schemas/auth.schemas';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LOGIN_TYPE>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    function onSubmit(data: LOGIN_TYPE) {
        console.log('login payload', data);
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
