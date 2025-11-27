import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/admin/Sidebar';
import { Topbar } from '../components/admin/Topbar';
export const AdminLayout = ({ children }) => {
    const { userData, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-heritage-light", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-12 h-12 mx-auto border-t-2 border-b-2 rounded-full animate-spin border-heritage-green" }), _jsx("p", { className: "mt-4 text-sm text-gray-600", children: "Loading..." })] }) }));
    }
    // Redirect non-admin users to appropriate pages
    if (!userData || userData.role === 'guest') {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs("div", { className: "flex h-screen overflow-hidden bg-heritage-light/30", children: [_jsx("div", { className: "hidden md:block", children: _jsx(Sidebar, {}) }), mobileMenuOpen && (_jsxs("div", { className: "fixed inset-0 z-40 md:hidden", children: [_jsx("div", { className: "fixed inset-0 bg-gray-600 bg-opacity-75", onClick: () => setMobileMenuOpen(false) }), _jsx("div", { className: "relative flex flex-col flex-1 w-full max-w-xs bg-white", children: _jsx(Sidebar, {}) })] })), _jsxs("div", { className: "flex flex-col flex-1 w-0 overflow-hidden md:ml-72", children: [_jsx(Topbar, { onSidebarToggle: () => setMobileMenuOpen(!mobileMenuOpen) }), _jsx("main", { className: "relative z-0 flex-1 overflow-y-auto focus:outline-none", children: children })] })] }));
};
