import { useRoutes } from 'react-router-dom';
import { authRoutes } from './features/auth/routes';
import App from './App';

export default function AppRouter() {
    return useRoutes([...authRoutes, { path: '/', element: <App /> }, { path: '*', element: <div>404</div> }]);
}
