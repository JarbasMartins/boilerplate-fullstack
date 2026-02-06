import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import AppRouter from './app-router';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <AppRouter />
            </Suspense>
        </BrowserRouter>
    </StrictMode>,
);
