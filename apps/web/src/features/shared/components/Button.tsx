import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export default function Button({ children, isLoading, ...props }: Props) {
    return (
        <button
            disabled={isLoading}
            className="w-full cursor-pointer bg-black text-white font-bold uppercase py-4 border-2 border-black hover:bg-white hover:text-black transition disabled:opacity-70"
            {...props}
        >
            <span className="flex items-center justify-center gap-2">
                {isLoading ? 'Processando...' : children}
                {!isLoading && <ArrowRight size={18} />}
            </span>
        </button>
    );
}
