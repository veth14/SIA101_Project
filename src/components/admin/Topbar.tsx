import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigation } from './Sidebar';

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
    // revenue title is handled below to allow ?tab=profit or #profit deep-links
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

    // If we're on the revenue page, respect the ?tab=profit or #profit deep-link
    if (location.pathname === '/admin/income') {
      try {
        const params = new URLSearchParams(location.search);
        if (params.get('tab') === 'profit' || location.hash === '#profit') {
          return 'Profit & Margin';
        }
      } catch (e) {
        // ignore malformed URL
      }
      return 'Revenue Tracking';
    }

    return 'Dashboard';
  };

  // Get a context-aware icon for the current page — reuse the same icons declared in Sidebar's navigation
  const getPageIcon = () => {
    // Try to match subItems first (exact href match), then top-level items by href or name
    const path = location.pathname;

    for (const item of navigation) {
      // check subItems
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (sub.href && path === sub.href) return sub.icon;
        }
      }
      // check main item href
      if (item.href && path === item.href) return item.icon;
      // fallback: match by path segments or keywords
      if (item.name && path.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])) return item.icon;
    }

    // Last resort: return dashboard icon from navigation if present
    const dash = navigation.find(n => n.name === 'Dashboard');
    return dash ? dash.icon : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v4" />
      </svg>
    );
  };

  // Return styling variants for the icon container and title depending on current page
  const getPageStyles = () => {
    const path = location.pathname;
    // defaults
    let bgClass = 'bg-heritage-light/20 border border-heritage-light/30';
    let iconColorClass = 'text-heritage-green';
    let titleClass = 'text-2xl font-bold text-heritage-green';

    // Finances -> green gradient, white icon
    if (path.includes('/finances') || path === '/admin/income' || path === '/admin/expenses' || path === '/admin/payroll' || path === '/admin/reports') {
      bgClass = 'bg-gradient-to-br from-heritage-green to-heritage-green/80 border border-heritage-green/30';
      iconColorClass = 'text-white';
      titleClass = 'text-2xl font-bold text-heritage-green';
    }

    // Inventory -> neutral darker bg, white icon
    if (path.startsWith('/admin/inventory')) {
      bgClass = 'bg-heritage-neutral/80 border border-heritage-neutral/30';
      iconColorClass = 'text-white';
      titleClass = 'text-2xl font-bold text-heritage-green';
    }

    // Front desk -> light background, green icon
    if (path.startsWith('/admin/frontdesk') || path === '/admin/rooms' || path === '/admin/lostfound' || path.includes('/frontdesk')) {
      bgClass = 'bg-heritage-light/30 border border-heritage-light/30';
      iconColorClass = 'text-heritage-green';
      titleClass = 'text-2xl font-bold text-heritage-green';
    }

    // Maintenance -> accent (amber) with white icon
    if (path.startsWith('/admin/maintenance') || path.includes('/manage-staff') || path.includes('/tickets-tasks')) {
      bgClass = 'bg-amber-500 border border-amber-400';
      iconColorClass = 'text-white';
      titleClass = 'text-2xl font-bold text-heritage-green';
    }

    // Analytics / Profit Analysis -> indigo accent
    if (path.includes('/profit-analysis') || path.includes('/analytics')) {
      bgClass = 'bg-indigo-600 border border-indigo-500';
      iconColorClass = 'text-white';
      titleClass = 'text-2xl font-bold text-heritage-green';
    }

    return { bgClass, iconColorClass, titleClass };
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
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm backdrop-blur-xl border-heritage-green/20">
      <div className="flex items-center justify-between h-[79px] px-8">

        {/* Page Title */}
        <div className="flex items-center space-x-3">
          {(() => {
            const { bgClass, iconColorClass, titleClass } = getPageStyles();
            return (
              <>
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${bgClass}`}>
                  <div className={`${iconColorClass}`}>{getPageIcon()}</div>
                </div>
                <h1 className={titleClass}>{getPageTitle()}</h1>
              </>
            );
          })()}
        </div>

        {/* Enhanced Right side */}
        <div className="flex items-center space-x-4">

          {/* Enhanced Notifications */}
          <div className="relative notifications-container">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 transition-all duration-300 text-heritage-neutral hover:text-heritage-green hover:bg-heritage-light/30 rounded-xl group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3h-2l-.5 2.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
              </svg>
              <span className="absolute flex items-center justify-center w-5 h-5 border-2 border-white rounded-full shadow-lg -top-1 -right-1 bg-heritage-green animate-pulse">
                <span className="text-xs font-bold text-white">2</span>
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
                    <div className="flex items-start p-4 space-x-4 transition-all duration-200 border bg-heritage-light/30 rounded-xl border-heritage-light/60 hover:shadow-md hover:bg-heritage-light/40">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-heritage-green rounded-xl">
                          <span className="text-lg text-white">🏨</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-heritage-green">New Check-in</p>
                        <p className="mt-1 text-sm text-heritage-neutral">Room 101 - John Doe</p>
                        <p className="mt-2 text-xs font-medium text-heritage-green/70">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start p-4 space-x-4 transition-all duration-200 border bg-heritage-light/30 rounded-xl border-heritage-light/60 hover:shadow-md hover:bg-heritage-light/40">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-heritage-neutral rounded-xl">
                          <span className="text-lg text-white">📦</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-heritage-green">Low Stock Alert</p>
                        <p className="mt-1 text-sm text-heritage-neutral">Towels - 5 remaining</p>
                        <p className="mt-2 text-xs font-medium text-heritage-neutral/70">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 mt-5 border-t border-heritage-light/40">
                    <button className="w-full px-4 py-2 text-sm font-semibold text-center transition-all duration-200 text-heritage-green hover:text-heritage-green/80 rounded-xl hover:bg-heritage-light/30">
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
              className="flex items-center gap-3 px-2 py-1 transition-all duration-200 rounded-xl hover:bg-heritage-light/30 group"
            >
              <div className="relative flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-heritage-green to-heritage-green/80 rounded-full shadow-sm border border-white text-white">
                  <span className="text-sm font-bold">{userData?.email?.charAt(0).toUpperCase() || 'A'}</span>
                </div>
                <span className="absolute w-3 h-3 bg-heritage-green rounded-full border-2 border-white -bottom-0.5 -right-0.5 shadow-md"></span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight text-left min-w-0">
                <span className="text-sm font-semibold text-heritage-green truncate">{userData?.email?.split('@')[0] || 'Admin User'}</span>
                <span className="mt-1 text-xs text-heritage-neutral truncate">{userData?.role || 'admin'}</span>
              </div>
              <svg className="hidden w-4 h-4 text-heritage-neutral sm:block group-hover:text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-heritage-light/40 z-[9999]">
                  <div className="p-3">
                    {/* Compact User Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-heritage-green to-heritage-green/80 shadow-sm border border-white text-white">
                          <span className="text-sm font-bold">{userData?.email?.charAt(0).toUpperCase() || 'A'}</span>
                        </div>
                        <span className="absolute w-3 h-3 bg-heritage-green rounded-full border-2 border-white -bottom-0.5 -right-0.5 shadow-md"></span>
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold text-heritage-green truncate">{userData?.email?.split('@')[0] || 'Admin User'}</p>
                        <p className="text-xs text-heritage-neutral mt-1 truncate">{userData?.role || 'admin'}</p>
                        <p className="text-xs text-heritage-neutral/70 mt-1 truncate">{userData?.email || 'admin@hotel.com'}</p>
                      </div>
                    </div>
                    <div className="-mx-3 mb-2 border-t border-heritage-light/40"></div>

                    {/* Enhanced Menu Items */}
                    <div className="space-y-2">
                    <button className="flex items-center w-full px-4 py-3 text-sm transition-all duration-200 text-heritage-neutral hover:bg-heritage-light/40 hover:text-heritage-green rounded-xl group">
                      <div className="flex items-center justify-center w-8 h-8 mr-3 transition-colors bg-heritage-light/50 rounded-xl group-hover:bg-heritage-green/20">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Your Profile</p>
                        <p className="text-xs text-heritage-neutral/70">Manage your account</p>
                      </div>
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm transition-all duration-200 text-heritage-neutral hover:bg-heritage-light/40 hover:text-heritage-green rounded-xl group">
                      <div className="flex items-center justify-center w-8 h-8 mr-3 transition-colors bg-heritage-light/50 rounded-xl group-hover:bg-heritage-green/20">
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
                    <button className="flex items-center w-full px-4 py-3 text-sm transition-all duration-200 text-heritage-neutral hover:bg-heritage-light/40 hover:text-heritage-green rounded-xl group">
                      <div className="flex items-center justify-center w-8 h-8 mr-3 transition-colors bg-heritage-light/50 rounded-xl group-hover:bg-heritage-green/20">
                        <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Help & Support</p>
                        <p className="text-xs text-heritage-neutral/70">Get assistance</p>
                      </div>
                    </button>
                    <div className="my-3 border-t border-heritage-light/40"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 transition-all duration-200 hover:bg-red-50 rounded-xl group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 mr-3 transition-colors bg-red-100 rounded-xl group-hover:bg-red-200">
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