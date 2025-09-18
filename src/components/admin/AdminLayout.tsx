import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { DashboardHeader } from './DashboardHeader';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-6">
          {/* Header */}
          <DashboardHeader 
            adminName={userData?.displayName || 'Admin User'}
            position="Administrator"
          />
          
          {/* Page Content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
