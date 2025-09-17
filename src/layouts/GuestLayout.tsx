import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/shared/navigation/Header';
import { Footer } from '../components/shared/navigation/Footer';

interface GuestLayoutProps {
  children: ReactNode;
}

export const GuestLayout = ({ children }: GuestLayoutProps) => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-heritage-green"></div>
    </div>;
  }

  // Redirect authenticated admin/staff users to their respective dashboards
  if (userData?.role === 'admin' || userData?.role === 'staff') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-heritage-light">
      <Header />
      
      <main className="flex-grow pt-20">
        {children}
      </main>

      <Footer />
    </div>
  );
};
