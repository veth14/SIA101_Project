import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface SubNavItem {
  name: string;
  href: string;
  icon: JSX.Element;
  description?: string;
}

interface NavItem {
  name: string;
  href?: string;
  icon: JSX.Element;
  roles: string[];
  subItems?: SubNavItem[];
}

const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v4" />
      </svg>
    ), 
    roles: ['admin', 'frontdesk', 'inventory-manager', 'accounting', 'staff'] 
  },
  { 
    name: 'Front Desk', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ), 
    roles: ['admin', 'frontdesk'],
    subItems: [
      {
        name: 'Reservations',
        href: '/admin/frontdesk',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        description: 'Manage bookings & check-ins'
      },
      {
        name: 'Room Management',
        href: '/admin/rooms',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        ),
        description: 'Room status & availability'
      }
    ]
  },
  { 
    name: 'Inventory', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ), 
    roles: ['admin', 'inventory-manager'],
    subItems: [
      {
        name: 'Items',
        href: '/admin/inventory',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        description: 'Manage inventory items'
      },
      {
        name: 'Transactions',
        href: '/admin/transactions',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        description: 'Stock transactions & logs'
      }
    ]
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ), 
    roles: ['admin', 'accounting'] 
  },
  { 
    name: 'Staff', 
    href: '/admin/staff', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ), 
    roles: ['admin'] 
  },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const userRole = userData?.role || 'admin';

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  const handleLogout = async () => {
    try {
      console.log('Admin logout initiated from sidebar...');
      await logout();
      console.log('Admin logout successful, redirecting...');
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Admin logout failed:', error);
    }
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (item: NavItem) => {
    if (item.href && location.pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.href);
    }
    return false;
  };

  const isSubItemActive = (href: string) => location.pathname === href;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} flex flex-col h-full border-r border-gray-100`}>
      {/* Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between px-6'} h-20 bg-heritage-light border-b border-gray-100`}>
        {isCollapsed ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-1 p-1">
              <img 
                src="/BalayGinhawa/balaylogopng.png" 
                alt="Balay Ginhawa Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded text-gray-400 hover:text-heritage-green transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm p-1">
                <img 
                  src="/BalayGinhawa/balaylogopng.png" 
                  alt="Balay Ginhawa Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-lg font-bold text-gray-800 font-serif">
                  Balay Ginhawa
                </h1>
                <p className="text-xs text-heritage-neutral font-medium">Hotel Management</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-heritage-green hover:bg-heritage-light/50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-6 space-y-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {filteredNavigation.map((item) => {
          const isActive = isItemActive(item);
          const isExpanded = expandedItems.includes(item.name);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.name} className="relative">
              {/* Main Navigation Item */}
              {item.href ? (
                <Link
                  to={item.href}
                  className={`group flex items-center ${isCollapsed ? 'justify-center px-3 py-4' : 'px-4 py-3'} text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-heritage-green text-white shadow-sm'
                      : 'text-gray-600 hover:bg-heritage-light hover:text-heritage-green'
                  }`}
                >
                  <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="ml-3 truncate font-medium">{item.name}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-20 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => hasSubItems && !isCollapsed && toggleExpanded(item.name)}
                  className={`group w-full flex items-center ${isCollapsed ? 'justify-center px-3 py-4' : 'justify-between px-4 py-3'} text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-heritage-green text-white shadow-sm'
                      : 'text-gray-600 hover:bg-heritage-light hover:text-heritage-green'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? '' : 'flex-1'}`}>
                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 truncate font-medium">{item.name}</span>
                    )}
                  </div>
                  {!isCollapsed && hasSubItems && (
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-white' : 'text-gray-400'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-20 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl whitespace-nowrap">
                      {item.name}
                      {hasSubItems && (
                        <div className="text-xs text-gray-300 mt-1">
                          {item.subItems!.map(sub => sub.name).join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              )}

              {/* Sub Navigation Items - Only show when expanded */}
              {hasSubItems && !isCollapsed && (
                <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {item.subItems!.map((subItem) => {
                    const isSubActive = isSubItemActive(subItem.href);
                    return (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={`group flex items-start px-4 py-3 ml-4 text-sm rounded-lg transition-all duration-200 border-l-2 ${
                          isSubActive
                            ? 'bg-heritage-green/10 text-heritage-green border-heritage-green'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-heritage-neutral'
                        }`}
                      >
                        <div className={`flex-shrink-0 mt-0.5 ${isSubActive ? 'text-heritage-green' : 'text-gray-400'}`}>
                          {subItem.icon}
                        </div>
                        <div className="ml-3">
                          <span className="block font-medium">{subItem.name}</span>
                          {subItem.description && (
                            <span className="text-xs text-gray-400 mt-0.5 block">{subItem.description}</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className={`border-t border-gray-100 bg-gray-50/50 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {!isCollapsed ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-heritage-green rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">
                  {userData?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {userData?.email?.split('@')[0] || 'Admin User'}
                </p>
                <p className="text-xs text-heritage-neutral capitalize font-medium">{userRole}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 bg-heritage-green rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">
                {userData?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div className="absolute left-20 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl whitespace-nowrap">
                Sign out
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
