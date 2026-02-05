import { Suspense } from 'react';
import AppRouter from './app-router';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './features/shared/components/Header';

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                <AppRouter />
            </Suspense>
        </BrowserRouter>
    );
}
