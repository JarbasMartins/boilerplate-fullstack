import { useRoutes } from 'react-router-dom';
import { authRoutes } from './features/auth/routes';

export default function AppRouter() {
    return useRoutes([...authRoutes, { path: '*', element: <div>404</div> }]);
}
