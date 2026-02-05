import { NavLink } from 'react-router-dom';

export function Header() {
    return (
        <header className="h-16 border-b border-gray-200 px-6 flex items-center">
            <nav className="w-full flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">MyApp</span>

                <ul className="flex items-center gap-6">
                    <li>
                        <NavLink
                            to="/login"
                            className={({ isActive }) => (isActive ? 'text-blue-600 font-medium border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-gray-900')}
                        >
                            Login
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/register"
                            className={({ isActive }) => (isActive ? 'text-blue-600 font-medium border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-gray-900')}
                        >
                            Register
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
