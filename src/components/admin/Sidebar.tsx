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
  subItems?: SubNavItem[];
  roles: string[];
}

export const navigation: NavItem[] = [
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
        name: 'Dashboard',
        href: '/admin/finances/dashboard',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        description: 'Overview of revenue, expenses, profit/loss, occupancy rate'
      },
      {
        name: 'Transactions',
        href: '/admin/finances/transactions',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
        description: 'Record all income and expenses, filter by date and type'
      },
      {
        name: 'Invoices',
        href: '/admin/finances/invoices',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        description: 'Generate and manage guest invoices and billing'
      },
      {
        name: 'Payments',
        href: '/admin/finances/payments',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
        description: 'Track received and pending payments by mode'
      },
      {
        name: 'Financial Reports',
        href: '/admin/reports',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        description: 'Income statement, balance sheet, cash flow reports'
      },
      {
        name: 'Expense Management',
        href: '/admin/expenses',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
          </svg>
        ),
        description: 'Add and categorize operational expenses by department'
      },
      {
        name: 'Revenue Tracking',
        href: '/admin/income',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        description: 'Breakdown of revenues by source with trend visualization'
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

export const Sidebar = ({ }: SidebarProps) => {
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
                            location.pathname === '/admin/reports' ||
                            location.pathname === '/admin/finances/dashboard' ||
                            location.pathname === '/admin/finances/transactions' ||
                            location.pathname === '/admin/finances/invoices' ||
                            location.pathname === '/admin/finances/payments' ||
                            location.pathname.includes('/admin/finances/profit-analysis');

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
    // DON'T reset manualInteractionRef when not on dashboard
  }, [isOnDashboardPage]);

  const toggleExpanded = (itemName: string) => {
    // Mark this as a manual interaction
    manualInteractionRef.current = true;
    
    // Reset manual interaction flag after 2 seconds to allow auto-expansion again
    setTimeout(() => {
      if (manualInteractionRef.current) {
        manualInteractionRef.current = false;
      }
    }, 2000);
    
    setExpandedItems(prev => {
      if (prev.includes(itemName)) {
        // Close the clicked dropdown
        const newExpanded = prev.filter(name => name !== itemName);
        return newExpanded;
      } else {
        // Open the clicked dropdown - close all others (accordion behavior)
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

const exactCreamGradient = 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)';

  return (
    <div style={{ backgroundImage: exactCreamGradient }} className="fixed left-0 top-0 z-50 flex flex-col h-screen border-r-2 shadow-2xl w-72 border-heritage-green/20 shadow-heritage-green/10">
      
      {/* Sidebar Header */}
      <div className="flex items-center px-6 py-4 border-b-2 bg-transparent border-heritage-green/15">
        <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 p-1.5 bg-gradient-to-br from-heritage-green to-heritage-green/80 rounded-xl shadow-lg border border-heritage-green/20">
              <img
                src="/BalayGinhawa/balaylogopng.png"
                alt="Balay Ginhawa Hotel Logo"
                className="object-contain w-full h-full filter brightness-0 invert"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="ml-3">
              <h1 className="font-serif text-lg font-bold leading-tight text-heritage-green">Balay Ginhawa</h1>
              <p className="text-xs font-medium text-heritage-neutral">Hotel Management System</p>
            </div>
          </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-3 mt-2 space-y-2 overflow-y-auto bg-transparent">{filteredNavigation.map((item) => {
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
            <div key={item.name} className="space-y-1">
              {!hasSubItems ? (
                <Link
                  to={item.href!}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 border-l-4 backdrop-blur-sm ${
                    isActive
                      ? 'text-white shadow-lg bg-heritage-green border-heritage-green shadow-heritage-green/25'
                      : 'border-transparent backdrop-blur-sm text-heritage-neutral hover:bg-white/80 hover:text-heritage-green hover:border-heritage-green/40 hover:shadow-md'
                  }`}
                >
                  <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-heritage-neutral group-hover:text-heritage-green'}`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-semibold">{item.name}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (hasSubItems) {
                      toggleExpanded(item.name);
                    }
                  }}
                  style={{ pointerEvents: 'auto' }}
                  className={`group w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 border-l-4 backdrop-blur-sm ${
                    isActive
                      ? 'text-white shadow-lg bg-heritage-green border-heritage-green shadow-heritage-green/25'
                      : 'border-transparent backdrop-blur-sm text-heritage-neutral hover:bg-white/80 hover:text-heritage-green hover:border-heritage-green/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-heritage-neutral group-hover:text-heritage-green'}`}>
                      {item.icon}
                    </div>
                    <span className="ml-3 font-semibold">{item.name}</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : 'rotate-0'
                    } ${isActive ? 'text-white' : 'text-heritage-neutral group-hover:text-heritage-green'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Sub Navigation Items - Only show when expanded */}
              {hasSubItems && (
                <div className={`ml-6 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? 'opacity-100 max-h-[800px]' : 'max-h-0 opacity-0'
                }`}>
                  {item.subItems!.map((subItem) => {
                    const isSubActive = isSubItemActive(subItem.href);
                    return (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={`group flex items-start px-4 py-2 text-xs rounded-lg transition-all duration-300 border-l-3 backdrop-blur-sm ${
                          isSubActive
                            ? 'shadow-md bg-white/90 text-heritage-green border-heritage-green'
                            : 'backdrop-blur-sm text-heritage-neutral/80 hover:text-heritage-green hover:bg-white/70 border-heritage-neutral/30 hover:border-heritage-green/50'
                        }`}
                      >
                        <div className={`flex-shrink-0 mt-0.5 ${isSubActive ? 'text-heritage-green' : 'text-heritage-neutral/60 group-hover:text-heritage-green'}`}>
                          {subItem.icon}
                        </div>
                        <div className="ml-2">
                          <span className="block text-sm font-semibold">{subItem.name}</span>
                          {subItem.description && (
                            <span className="text-xs text-heritage-neutral/70 mt-0.5 block leading-tight">{subItem.description}</span>
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