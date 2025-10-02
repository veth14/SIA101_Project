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
      },
      {
        name: 'Lost & Found',
        href: '/admin/lostfound',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        description: 'Manage lost and found items'
      },
      {
        name: 'Guest Services',
        href: '/admin/guest-services',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        description: 'Guest feedback, loyalty & assistance'
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
        name: 'Dashboard',
        href: '/admin/inventory/dashboard',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4M12 5v4M16 5v4" />
          </svg>
        ),
        description: 'Inventory overview & metrics'
      },
      {
        name: 'Inventory',
        href: '/admin/inventory',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        description: 'Manage inventory items'
      },
      {
        name: 'Procurement',
        href: '/admin/inventory/procurement',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        ),
        description: 'Purchase orders & procurement'
      },
      {
        name: 'Requisitions',
        href: '/admin/inventory/requisitions',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
        description: 'Internal requests & requisitions'
      },
      {
        name: 'Suppliers',
        href: '/admin/inventory/suppliers',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        description: 'Manage suppliers & vendors'
      },
      {
        name: 'Analytics',
        href: '/admin/inventory/analytics',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        description: 'Inventory reports & analytics'
      },
      {
        name: 'Departments',
        href: '/admin/inventory/departments',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        description: 'Department inventory management'
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
    name: 'Maintenance', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ), 
    roles: ['admin'],
    subItems: [
      {
        name: 'Overview',
        href: '/admin/maintenance',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        description: 'Maintenance dashboard and overview'
      },
      {
        name: 'Manage Staff',
        href: '/admin/manage-staff',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        description: 'Manage maintenance staff and personnel'
      },  
      {
        name: 'Staff Schedules',
        href: '/admin/staff-schedules',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        description: 'Schedule and manage staff shifts'
      },
      {
        name: 'On-Duty Staff',
        href: '/admin/on-duty-staff',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        description: 'View currently active staff members'
      },
      {
        name: 'Tickets & Tasks',
        href: '/admin/tickets-tasks',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
        description: 'Manage maintenance tickets and tasks'
      },
      {
        name: 'Archive',
        href: '/admin/archive',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        ),
        description: 'Archived maintenance records and data'
      } // Archive item - should be visible now
    ]
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

  // Debug log to check if Archive is included
  console.log('Filtered Navigation:', filteredNavigation);
  console.log('User Role:', userRole);

  // Check if we're on a financial page
  const isOnFinancialPage = location.pathname === '/admin/income' || 
                            location.pathname === '/admin/expenses' || 
                            location.pathname === '/admin/payroll' || 
                            location.pathname === '/admin/reports';

  // Check if we're on inventory or front desk pages
  const isOnInventoryPage = location.pathname === '/admin/inventory' || 
                           location.pathname === '/admin/transactions' ||
                           location.pathname.startsWith('/admin/inventory/');
  const isOnFrontDeskPage = location.pathname === '/admin/frontdesk' || 
                           location.pathname === '/admin/rooms' ||
                           location.pathname === '/admin/lostfound' ||
                           location.pathname === '/admin/guest-services';

  // Check if we're on maintenance pages
  const isOnMaintenancePage = location.pathname === '/admin/maintenance' || 
                             location.pathname === '/admin/manage-staff' || 
                             location.pathname === '/admin/staff-schedules' || 
                             location.pathname === '/admin/on-duty-staff' || 
                             location.pathname === '/admin/tickets-tasks' || 
                             location.pathname === '/admin/archive';

  // Check if we're on dashboard page (this should close all dropdowns)
  const isOnDashboardPage = location.pathname === '/admin/dashboard';

  // Auto-close all dropdowns when navigating to Dashboard page
  useEffect(() => {
    if (isOnDashboardPage) {
      // If there are expanded items, always show closing animation
      if (expandedItems.length > 0) {
        const timer = setTimeout(() => {
          setExpandedItems([]);
          manualInteractionRef.current = false; // Reset the flag
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // No expanded items, just reset the flag
        manualInteractionRef.current = false;
      }
    }
  }, [isOnDashboardPage]);

  // Auto-expand inventory dropdown when on inventory pages
  useEffect(() => {
    if (isOnInventoryPage && !manualInteractionRef.current && !expandedItems.includes('Inventory')) {
      setExpandedItems(['Inventory']);
    }
  }, [isOnInventoryPage, expandedItems]);

  const toggleExpanded = (itemName: string) => {
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
        // Don't close Maintenance if we're on maintenance pages
        if (itemName === 'Maintenance' && isOnMaintenancePage) {
          return prev; // Keep Maintenance open on maintenance pages
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
            (expandedItems.length === 0 && item.name === 'Front Desk' && isOnFrontDeskPage) ||
            (expandedItems.length === 0 && item.name === 'Maintenance' && isOnMaintenancePage);
          
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
                  onClick={() => hasSubItems && toggleExpanded(item.name)}
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
                  isExpanded ? 'max-h-[600px] opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'
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
