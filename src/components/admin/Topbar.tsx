import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface TopbarProps {
  onSidebarToggle: () => void;
  title?: string;
}

export const Topbar = ({ onSidebarToggle }: TopbarProps) => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get page title from path
  const getPageTitle = () => {
    // Finances pages
    if (location.pathname.includes('/profit-analysis')) return 'Profit Analysis';
    if (location.pathname.includes('/finances/dashboard')) return 'Financial Dashboard';
    if (location.pathname.includes('/finances/invoices')) return 'Invoices';
    if (location.pathname.includes('/finances/payments')) return 'Payments';
    if (location.pathname.includes('/finances/transactions')) return 'Transactions';
    if (location.pathname === '/admin/reports') return 'Financial Reports';
    if (location.pathname === '/admin/expenses') return 'Expense Management';
    if (location.pathname === '/admin/income') return 'Revenue Tracking';
    if (location.pathname === '/admin/payroll') return 'Payroll';
    if (location.pathname === '/admin/finances') return 'Finances';
    
    // Inventory pages
    if (location.pathname === '/admin/inventory') return 'Inventory';
    if (location.pathname.includes('/inventory/dashboard')) return 'Inventory Dashboard';
    if (location.pathname.includes('/inventory/departments')) return 'Departments';
    if (location.pathname.includes('/inventory/suppliers')) return 'Suppliers';
    if (location.pathname.includes('/inventory/requisitions')) return 'Requisitions';
    if (location.pathname.includes('/inventory/procurement')) return 'Procurement';
    if (location.pathname.includes('/inventory/analytics')) return 'Inventory Analytics';
    
    // Front Desk pages
    if (location.pathname === '/admin/frontdesk') return 'Reservations';
    if (location.pathname === '/admin/rooms') return 'Room Management';
    if (location.pathname === '/admin/lostfound') return 'Lost & Found';
    if (location.pathname === '/admin/guest-services') return 'Guest Services';
    
    // Maintenance pages
    if (location.pathname.includes('/maintenance')) return 'Maintenance Overview';
    if (location.pathname.includes('/manage-staff')) return 'Manage Staff';
    if (location.pathname.includes('/staff-schedules')) return 'Staff Schedules';
    if (location.pathname.includes('/on-duty-staff')) return 'On-Duty Staff';
    if (location.pathname.includes('/tickets-tasks')) return 'Tickets & Tasks';
    if (location.pathname.includes('/archive')) return 'Archive';
    
    // General pages
    if (location.pathname.includes('/analytics')) return 'Analytics';
    return 'Dashboard';
  };


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <header className="bg-white backdrop-blur-xl border-b border-heritage-green/20 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-[79px] px-8">
        {/* Left side - Mobile menu button and Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="p-2.5 rounded-xl text-gray-500 hover:text-heritage-green hover:bg-heritage-green/5 focus:outline-none focus:ring-2 focus:ring-heritage-green/20 transition-all duration-300 md:hidden group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center space-x-1 text-heritage-neutral/70 hover:text-heritage-green transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Admin</span>
            </button>
            
            {/* Finances Section */}
            {(location.pathname.includes('/finances') || 
              location.pathname === '/admin/reports' || 
              location.pathname === '/admin/expenses' || 
              location.pathname === '/admin/income' || 
              location.pathname === '/admin/payroll') && (
              <>
                <span className="text-heritage-neutral/40">/</span>
                <button 
                  onClick={() => navigate('/admin/finances/dashboard')}
                  className="flex items-center space-x-1 text-heritage-neutral/70 hover:text-heritage-green transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Finances</span>
                </button>
              </>
            )}
            
            {/* Front Desk Section */}
            {(location.pathname === '/admin/frontdesk' || 
              location.pathname === '/admin/rooms' || 
              location.pathname === '/admin/lostfound' || 
              location.pathname === '/admin/guest-services') && (
              <>
                <span className="text-heritage-neutral/40">/</span>
                <button 
                  onClick={() => navigate('/admin/frontdesk')}
                  className="flex items-center space-x-1 text-heritage-neutral/70 hover:text-heritage-green transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Front Desk</span>
                </button>
              </>
            )}
            
            {/* Inventory Section */}
            {location.pathname.includes('/inventory') && (
              <>
                <span className="text-heritage-neutral/40">/</span>
                <button 
                  onClick={() => navigate('/admin/inventory')}
                  className="flex items-center space-x-1 text-heritage-neutral/70 hover:text-heritage-green transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Inventory</span>
                </button>
              </>
            )}
            
            {/* Maintenance Section */}
            {(location.pathname.includes('/maintenance') || 
              location.pathname.includes('/manage-staff') || 
              location.pathname.includes('/staff-schedules') || 
              location.pathname.includes('/on-duty-staff') || 
              location.pathname.includes('/tickets-tasks') || 
              location.pathname.includes('/archive')) && (
              <>
                <span className="text-heritage-neutral/40">/</span>
                <button 
                  onClick={() => navigate('/admin/maintenance')}
                  className="flex items-center space-x-1 text-heritage-neutral/70 hover:text-heritage-green transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Maintenance</span>
                </button>
              </>
            )}
            
            <span className="text-heritage-neutral/40">/</span>
            <span className="text-heritage-green font-medium">{getPageTitle()}</span>
          </div>
        </div>

        {/* Enhanced Right side */}
        <div className="flex items-center space-x-4">

          {/* Enhanced Notifications */}
          <div className="relative notifications-container">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-heritage-neutral hover:text-heritage-green hover:bg-heritage-light/30 rounded-xl transition-all duration-300 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3h-2l-.5 2.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-heritage-green rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                <span className="text-white text-xs font-bold">2</span>
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-heritage-light/40 z-[9999]">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-heritage-green">Notifications</h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-heritage-green/10 text-heritage-green border border-heritage-green/30">
                      2 New
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-4 p-4 bg-heritage-light/30 rounded-xl border border-heritage-light/60 hover:shadow-md hover:bg-heritage-light/40 transition-all duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-heritage-green rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg">🏨</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-heritage-green">New Check-in</p>
                        <p className="text-sm text-heritage-neutral mt-1">Room 101 - John Doe</p>
                        <p className="text-xs text-heritage-green/70 font-medium mt-2">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-heritage-light/30 rounded-xl border border-heritage-light/60 hover:shadow-md hover:bg-heritage-light/40 transition-all duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-heritage-neutral rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg">📦</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-heritage-green">Low Stock Alert</p>
                        <p className="text-sm text-heritage-neutral mt-1">Towels - 5 remaining</p>
                        <p className="text-xs text-heritage-neutral/70 font-medium mt-2">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-heritage-light/40">
                    <button className="w-full text-center text-sm text-heritage-green hover:text-heritage-green/80 font-semibold py-2 px-4 rounded-xl hover:bg-heritage-light/30 transition-all duration-200">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced User menu */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-heritage-light/30 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg shadow-heritage-green/25 group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-sm font-bold">
                    {userData?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-heritage-green rounded-full border-2 border-white animate-pulse shadow-lg"></div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold text-heritage-green group-hover:text-heritage-green/80 transition-colors">
                  {userData?.email?.split('@')[0] || 'Admin User'}
                </p>
                <p className="text-xs text-heritage-neutral font-medium">
                  {userData?.role || 'Administrator'}
                </p>
              </div>
              <svg className="w-4 h-4 text-heritage-neutral hidden lg:block group-hover:text-heritage-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-heritage-light/40 z-[9999]">
                <div className="p-4">
                  {/* Enhanced User Info Header */}
                  <div className="px-4 py-4 bg-heritage-light/30 rounded-xl border border-heritage-green/20 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">
                            {userData?.email?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-heritage-green rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-heritage-green">
                          {userData?.email?.split('@')[0] || 'Admin User'}
                        </p>
                        <p className="text-sm text-heritage-neutral truncate">{userData?.email || 'admin@hotel.com'}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <div className="w-2 h-2 bg-heritage-green rounded-full animate-pulse"></div>
                          <span className="text-xs text-heritage-green font-semibold">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Menu Items */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center px-4 py-3 text-sm text-heritage-neutral hover:bg-heritage-light/40 hover:text-heritage-green rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-heritage-light/50 rounded-xl flex items-center justify-center mr-3 group-hover:bg-heritage-green/20 transition-colors">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Your Profile</p>
                        <p className="text-xs text-heritage-neutral/70">Manage your account</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-sm text-heritage-neutral hover:bg-heritage-light/40 hover:text-heritage-green rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-heritage-light/50 rounded-xl flex items-center justify-center mr-3 group-hover:bg-heritage-green/20 transition-colors">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Settings</p>
                        <p className="text-xs text-heritage-neutral/70">Preferences & configuration</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-sm text-heritage-neutral hover:bg-heritage-light/40 hover:text-heritage-green rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-heritage-light/50 rounded-xl flex items-center justify-center mr-3 group-hover:bg-heritage-green/20 transition-colors">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Help & Support</p>
                        <p className="text-xs text-heritage-neutral/70">Get assistance</p>
                      </div>
                    </button>
                    <div className="border-t border-heritage-light/40 my-3"></div>
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