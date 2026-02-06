import React, { useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: FieldError;
}

const Input = React.forwardRef<HTMLInputElement, Props>(({ label, error, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold uppercase tracking-tighter">{label}</label>

            <div className="relative">
                <input
                    ref={ref}
                    type={inputType}
                    aria-invalid={!!error}
                    className={`w-full bg-white px-4 py-3 border-2 outline-none transition-all border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${error ? 'border-red-600 bg-red-50' : ''}`}
                    {...props}
                />

                {isPassword && (
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {error && (
                <span className="flex items-center gap-1 text-[12px] font-bold text-red-600">
                    <AlertCircle size={14} />
                    {error.message}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
