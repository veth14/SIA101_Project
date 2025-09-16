import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/shared/navigation/Header';
import { Footer } from '../components/shared/navigation/Footer';

interface GuestLayoutProps {
  children: ReactNode;
}

export const GuestLayout = ({ children }: GuestLayoutProps) => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heritage-green"></div>
    </div>;
  }

  // Redirect authenticated admin/staff users to their respective dashboards
  if (userData?.role === 'admin' || userData?.role === 'staff') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-heritage-light flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};
