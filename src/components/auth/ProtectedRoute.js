import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
export const ProtectedRoute = ({ allowedRoles, redirectPath = '/login', children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();
    // Handle loading state
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-heritage-green" }) }));
    }
    // Not authenticated - redirect to login with return path
    if (!isAuthenticated || !user) {
        return _jsx(Navigate, { to: redirectPath, state: { from: location }, replace: true });
    }
    // Check role access if roles are specified
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    // Authenticated and authorized
    return _jsx(_Fragment, { children: children });
};
