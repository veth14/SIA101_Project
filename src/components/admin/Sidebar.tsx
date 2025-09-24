import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isMobile?: boolean;
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
    name: 'Finances', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ), 
    roles: ['admin', 'accounting'],
    subItems: [
      {
        name: 'Income',
        href: '/admin/income',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        description: 'Track hotel revenue and bookings'
      },
      {
        name: 'Expenses',
        href: '/admin/expenses',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
        description: 'Monitor hotel operating costs'
      },
      {
        name: 'Payroll',
        href: '/admin/payroll',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        description: 'Manage staff salaries and compensation'
      },
      {
        name: 'Reports',
        href: '/admin/reports',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        description: 'Generate and review financial documents'
      }
    ]
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

export const Sidebar = ({ isMobile = false }: SidebarProps) => {
  const location = useLocation();
  const { userData } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const manualInteractionRef = useRef(false);
  
  const userRole = userData?.role || 'admin';

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  // Check if we're on a financial page
  const isOnFinancialPage = location.pathname === '/admin/income' || 
                            location.pathname === '/admin/expenses' || 
                            location.pathname === '/admin/payroll' || 
                            location.pathname === '/admin/reports';

  // Check if we're on inventory or front desk pages
  const isOnInventoryPage = location.pathname === '/admin/inventory' || 
                           location.pathname === '/admin/transactions';
  const isOnFrontDeskPage = location.pathname === '/admin/frontdesk' || 
                           location.pathname === '/admin/rooms';

  // Check if we're on dashboard or staff pages (these should close all dropdowns)
  const isOnDashboardPage = location.pathname === '/admin/dashboard';
  const isOnStaffPage = location.pathname === '/admin/staff';

  // Auto-close all dropdowns when navigating to Dashboard or Staff pages
  useEffect(() => {
    if (isOnDashboardPage || isOnStaffPage) {
      console.log('🏠 Navigated to Dashboard/Staff - closing all dropdowns');
      console.log('📋 Current expandedItems:', expandedItems);
      
      // If there are expanded items, always show closing animation
      if (expandedItems.length > 0) {
        const timer = setTimeout(() => {
          console.log('🎬 Closing with animation');
          setExpandedItems([]);
          manualInteractionRef.current = false; // Reset the flag
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // No expanded items, just reset the flag
        manualInteractionRef.current = false;
      }
    }
  }, [isOnDashboardPage, isOnStaffPage]);

  const toggleExpanded = (itemName: string) => {
    console.log('🔄 Toggle called for:', itemName);
    
    // Mark this as a manual interaction
    manualInteractionRef.current = true;
    
    setExpandedItems(prev => {
      if (prev.includes(itemName)) {
        // If clicking on already expanded item, try to close it
        // But don't close Finances if we're on a financial page
        if (itemName === 'Finances' && isOnFinancialPage) {
          return prev; // Keep Finances open on financial pages
        }
        // Don't close Inventory if we're on inventory pages
        if (itemName === 'Inventory' && isOnInventoryPage) {
          return prev; // Keep Inventory open on inventory pages
        }
        // Don't close Front Desk if we're on front desk pages
        if (itemName === 'Front Desk' && isOnFrontDeskPage) {
          return prev; // Keep Front Desk open on front desk pages
        }
        // Close the clicked dropdown (accordion behavior)
        return prev.filter(name => name !== itemName);
      } else {
        // Opening a new dropdown - ALWAYS close all others and open only this one
        // This ensures accordion behavior: only one dropdown open at a time
        return [itemName];
      }
    });
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
    <div className="bg-white shadow-lg w-72 flex flex-col h-full border-r border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-20 bg-white border-b border-gray-100">
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto px-4">
        {filteredNavigation.map((item) => {
          const isActive = isItemActive(item);
          // Check if item should be expanded based on state or current page
          // Only auto-expand when no dropdowns are currently open (to allow animations)
          const isExpanded = expandedItems.includes(item.name) || 
            (expandedItems.length === 0 && item.name === 'Finances' && isOnFinancialPage) ||
            (expandedItems.length === 0 && item.name === 'Inventory' && isOnInventoryPage) ||
            (expandedItems.length === 0 && item.name === 'Front Desk' && isOnFrontDeskPage);
          
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.name} className="relative">
              {/* Main Navigation Item */}
              {item.href ? (
                <Link
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-heritage-green text-white shadow-sm'
                      : 'text-gray-600 hover:bg-heritage-light hover:text-heritage-green'
                  }`}
                >
                  <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 truncate font-medium">{item.name}</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    console.log('🔘 Button clicked for:', item.name, 'hasSubItems:', hasSubItems);
                    hasSubItems && toggleExpanded(item.name);
                  }}
                  className={`group w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-heritage-green text-white shadow-sm'
                      : 'text-gray-600 hover:bg-heritage-light hover:text-heritage-green'
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.icon}
                    </div>
                    <span className="ml-3 truncate font-medium">{item.name}</span>
                  </div>
                  {hasSubItems && (
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-white' : 'text-gray-400'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              )}

              {/* Sub Navigation Items - Only show when expanded */}
              {hasSubItems && (
                <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'
                }`}>
                  {item.subItems!.map((subItem) => {
                    const isSubActive = isSubItemActive(subItem.href);
                    return (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          // Only close sidebar on mobile when navigating
                          if (isMobile) {
                            // onToggle(); // Removed since we don't have onToggle anymore
                          }
                        }}
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

    </div>
  );
};
