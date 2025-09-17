import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { ProtectedRouteProps } from '../../types/auth.types';

export const ProtectedRoute = ({ 
  allowedRoles, 
  redirectPath = '/login',
  children 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-heritage-green"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check role access if roles are specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized
  return <>{children}</>;
};
