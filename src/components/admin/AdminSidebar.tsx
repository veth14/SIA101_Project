import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import {
  ViewIcon,
  StarIcon,
  SunIcon,
  TimeIcon,
  SettingsIcon,
  CloseIcon,
} from '@chakra-ui/icons';

interface NavItem {
  path: string;
  label: string;
  icon: JSX.Element;
}

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(true);

  const navItems: NavItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <ViewIcon className="text-xl" /> },
    { path: '/admin/rooms', label: 'Rooms', icon: <StarIcon className="text-xl" /> },
    { path: '/admin/guests', label: 'Guests', icon: <SunIcon className="text-xl" /> },
    { path: '/admin/bookings', label: 'Bookings', icon: <TimeIcon className="text-xl" /> },
    { path: '/admin/settings', label: 'Settings', icon: <SettingsIcon className="text-xl" /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`h-screen bg-gray-900 text-white ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 fixed left-0 top-0`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {isOpen && <h1 className="text-xl font-bold">Heritage Hotel</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors
                  ${location.pathname === item.path
                    ? 'bg-teal-600 text-white'
                    : 'hover:bg-gray-800'}`}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 w-full px-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 p-3 rounded-lg w-full hover:bg-gray-800 text-red-400
            ${!isOpen && 'justify-center'}`}
        >
          <CloseIcon className="text-xl" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
