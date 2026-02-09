import './index.css';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app-router';
import Loader from './features/shared/components/Loader';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <AppRouter />
            </Suspense>
        </BrowserRouter>
    </StrictMode>,
);
