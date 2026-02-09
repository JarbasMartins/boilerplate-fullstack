import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../../shared/components/Button';
import { registerSchema, type REGISTER_TYPE } from '../schemas/auth.schemas';
import { http } from '../services/http';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<REGISTER_TYPE>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    async function onSubmit(data: REGISTER_TYPE) {
        try {
            const user = await http.post('users/register', data);
            navigate('/login');
            return user;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Layout title="Criar Conta">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                <Input label="Nome" {...register('name')} error={errors.name} />
                <Input label="Email" type="email" {...register('email')} error={errors.email} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Senha" type="password" {...register('password')} error={errors.password} />
                    <Input label="Confirmar" type="password" {...register('confirmPassword')} error={errors.confirmPassword} />
                </div>

                <Button type="submit" isLoading={isSubmitting}>
                    Registrar
                </Button>
            </form>
        </Layout>
    );
}
