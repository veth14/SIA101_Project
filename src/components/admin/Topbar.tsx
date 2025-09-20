import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onSidebarToggle: () => void;
  title?: string;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'reservation' | 'guest' | 'inventory' | 'room';
  href: string;
}

export const Topbar = ({ onSidebarToggle, title = 'Dashboard' }: TopbarProps) => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock search data - in real app, this would come from your API
  const mockSearchData: SearchResult[] = [
    { id: '1', title: 'John Doe', subtitle: 'Room 101 - Check-in Today', type: 'reservation', href: '/admin/frontdesk' },
    { id: '2', title: 'Jane Smith', subtitle: 'Room 205 - VIP Guest', type: 'guest', href: '/admin/frontdesk' },
    { id: '3', title: 'Towels', subtitle: '5 remaining - Low Stock', type: 'inventory', href: '/admin/inventory' },
    { id: '4', title: 'Suite Room', subtitle: 'Room 301 - Available', type: 'room', href: '/admin/rooms' },
    { id: '5', title: 'Mike Johnson', subtitle: 'Checked out - Room 102', type: 'reservation', href: '/admin/frontdesk' },
    { id: '6', title: 'Bed Sheets', subtitle: '12 available', type: 'inventory', href: '/admin/inventory' },
  ];

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = mockSearchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
      if (!target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (result: SearchResult) => {
    navigate(result.href);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getSearchResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'reservation':
        return '📅';
      case 'guest':
        return '👤';
      case 'inventory':
        return '📦';
      case 'room':
        return '🏨';
      default:
        return '🔍';
    }
  };

  return (
    <header className="bg-gradient-to-r from-white via-heritage-light/30 to-white shadow-lg border-b border-heritage-green/10 backdrop-blur-sm relative z-50">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onSidebarToggle}
            className="p-3 rounded-xl text-heritage-green hover:text-white hover:bg-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/50 transition-all duration-300 shadow-sm md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 font-serif tracking-wide">{title}</h1>
              <p className="text-sm text-heritage-neutral font-medium">Hotel Management System</p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative search-container">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <div className="w-8 h-8 bg-heritage-green/30 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reservations, guests, inventory..."
              className="block w-full pl-16 pr-6 py-4 border-2 border-heritage-green/20 rounded-2xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-4 focus:ring-heritage-green/20 focus:border-heritage-green shadow-lg transition-all duration-300 text-sm font-medium"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-heritage-green/20 z-[9999] max-h-80 overflow-y-auto">
                <div className="p-3">
                  <div className="text-xs font-semibold text-heritage-green px-4 py-3 border-b border-heritage-green/10 bg-heritage-light/30 rounded-t-xl">
                    Search Results ({searchResults.length})
                  </div>
                  <div className="mt-2 space-y-1">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full flex items-center space-x-4 px-4 py-4 hover:bg-heritage-light/50 rounded-xl transition-all duration-200 text-left group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-heritage-green/20 to-heritage-neutral/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <span className="text-lg">{getSearchResultIcon(result.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{result.title}</p>
                          <p className="text-xs text-gray-600 truncate mt-1">{result.subtitle}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-heritage-green/10 to-heritage-neutral/10 text-heritage-green capitalize border border-heritage-green/20">
                            {result.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-heritage-green/20 z-[9999]">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-heritage-green/10 to-heritage-neutral/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-heritage-green/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-gray-500 mt-2">Try searching for reservations, guests, or inventory items</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative notifications-container">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-heritage-green hover:text-white hover:bg-heritage-green rounded-2xl focus:outline-none focus:ring-4 focus:ring-heritage-green/20 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm border border-heritage-green/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3h-2l-.5 2.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </span>
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-heritage-green/20 z-[9999]">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      2 New
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-heritage-light/50 to-heritage-light/30 rounded-xl border border-heritage-green/10">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg">🏨</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">New Check-in</p>
                        <p className="text-sm text-gray-600 mt-1">Room 101 - John Doe</p>
                        <p className="text-xs text-heritage-neutral font-medium mt-2">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg">📦</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Low Stock Alert</p>
                        <p className="text-sm text-gray-600 mt-1">Towels - 5 remaining</p>
                        <p className="text-xs text-orange-600 font-medium mt-2">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-heritage-green/10">
                    <button className="w-full text-center text-sm text-heritage-green hover:text-heritage-green/80 font-semibold py-2 px-4 rounded-xl hover:bg-heritage-light/30 transition-all duration-200">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-4 p-3 text-sm rounded-2xl hover:bg-heritage-light/50 focus:outline-none focus:ring-4 focus:ring-heritage-green/20 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm border border-heritage-green/20"
            >
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {userData?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-800">
                  {userData?.email?.split('@')[0] || 'Admin User'}
                </p>
                <p className="text-xs text-heritage-neutral capitalize font-semibold">
                  {userData?.role || 'Administrator'}
                </p>
              </div>
              <svg className="w-5 h-5 text-heritage-green hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-heritage-green/20 z-[9999]">
                <div className="p-4">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-heritage-green/10 bg-gradient-to-r from-heritage-light/30 to-heritage-light/10 rounded-t-xl">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">
                            {userData?.email?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {userData?.email?.split('@')[0] || 'Admin User'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{userData?.email || 'admin@hotel.com'}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-semibold">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-3 space-y-1">
                    <button className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-heritage-light/50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-heritage-green/10 rounded-xl flex items-center justify-center mr-3 group-hover:bg-heritage-green/20 transition-colors">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Your Profile</p>
                        <p className="text-xs text-gray-500">Manage your account</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-heritage-light/50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-heritage-green/10 rounded-xl flex items-center justify-center mr-3 group-hover:bg-heritage-green/20 transition-colors">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Settings</p>
                        <p className="text-xs text-gray-500">Preferences & configuration</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-heritage-light/50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-heritage-green/10 rounded-xl flex items-center justify-center mr-3 group-hover:bg-heritage-green/20 transition-colors">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Help & Support</p>
                        <p className="text-xs text-gray-500">Get assistance</p>
                      </div>
                    </button>
                    <div className="border-t border-heritage-green/10 my-3"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Sign out</p>
                        <p className="text-xs text-red-400">End your session</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};