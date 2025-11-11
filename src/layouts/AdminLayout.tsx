import type { ReactNode } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/admin/Sidebar';
import { Topbar } from '../components/admin/Topbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { userData, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-heritage-light">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-b-2 rounded-full animate-spin border-heritage-green"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect non-admin users to appropriate pages
  if (!userData || userData.role === 'guest') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-heritage-light/30">
      {/* Fixed Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content area - shifted right on desktop */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden md:ml-72">
        {/* Topbar */}
        <Topbar onSidebarToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Main content */}
        <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};
