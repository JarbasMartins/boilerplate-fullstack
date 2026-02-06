import React from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
}

export default function Layout({ title, children }: Props) {
    return (
        <div className="min-h-screen w-full bg-[#f0f0f0] text-neutral-900 font-sans flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
                    <header className="mb-2 border-b-2 border-black pb-2">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase italic">{title}</h1>
                        <p className="mt-2 text-sm font-mono text-neutral-600">Preencha os dados para acessar</p>
                    </header>

                    {children}
                </div>
            </div>
        </div>
    );
}
