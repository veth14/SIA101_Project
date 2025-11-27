import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/shared/navigation/Header';
export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, userData, error: authError, loading } = useAuth();
    // Login form data
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    // Redirect if already logged in
    useEffect(() => {
        if (userData) {
            const from = location.state?.from?.pathname;
            if (from) {
                navigate(from, { replace: true });
            }
            else {
                // Role-based routing
                if (userData.role === 'admin' || userData.role === 'staff') {
                    navigate('/admin/dashboard', { replace: true });
                }
                else {
                    navigate('/guest/dashboard', { replace: true });
                }
            }
        }
    }, [userData, navigate, location.state]);
    // Update error message when auth error changes
    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);
    const validateLoginForm = () => {
        const newErrors = {};
        if (!loginData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!loginData.password) {
            newErrors.password = 'Password is required';
        }
        else if (loginData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateLoginForm())
            return;
        try {
            setError('');
            await login(loginData);
            // Navigation will be handled by the useEffect above
        }
        catch (err) {
            // Error is handled by the auth context and displayed via the error state
            console.error('Login failed:', err);
        }
    };
    const handleLoginInputChange = (field, value) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Header, {}), _jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsxs("div", { className: "absolute inset-0 z-0", children: [_jsx("div", { className: "absolute inset-0 w-full h-full bg-cover bg-center", style: {
                                    backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
                                } }), _jsx("div", { className: "absolute inset-0 bg-black/60" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/30 to-transparent" })] }), _jsx("div", { className: "relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { className: "text-white space-y-8", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight", children: ["Welcome to ", _jsx("span", { className: "text-heritage-light", children: "Balay Ginhawa" })] }), _jsx("p", { className: "text-xl md:text-2xl text-white/90 mt-6 leading-relaxed", children: "Experience authentic Filipino heritage in our luxurious accommodations" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full" }), _jsx("p", { className: "text-lg text-white/80", children: "Luxury rooms with Filipino cultural touches" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full" }), _jsx("p", { className: "text-lg text-white/80", children: "World-class amenities and services" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full" }), _jsx("p", { className: "text-lg text-white/80", children: "Authentic Filipino hospitality" })] })] })] }), _jsxs("div", { className: "bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "flex items-center justify-center mb-6", children: _jsx("img", { src: "/BalayGinhawa/balaylogopng.png", alt: "Balay Ginhawa Logo", className: "w-16 h-16 object-contain" }) }), _jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Sign In" }), _jsx("p", { className: "text-gray-600", children: "Access your account to continue" })] }), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" }) }) }), _jsx("input", { id: "email", type: "email", autoComplete: "email", value: loginData.email, onChange: (e) => handleLoginInputChange('email', e.target.value), className: `block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`, placeholder: "Enter your email address" })] }), errors.email && (_jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), errors.email] }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }), _jsx("input", { id: "password", type: "password", autoComplete: "current-password", value: loginData.password, onChange: (e) => handleLoginInputChange('password', e.target.value), className: `block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`, placeholder: "Enter your password" })] }), errors.password && (_jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), errors.password] }))] })] }), error && (_jsx("div", { className: "p-4 rounded-lg bg-red-50 border border-red-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-5 h-5 text-red-400 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }), _jsx("p", { className: "text-sm text-red-700 font-medium", children: error })] }) })), _jsx("div", { children: _jsxs("button", { type: "submit", disabled: loading, className: `group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-lg text-white transition-all duration-300 ${loading
                                                            ? 'bg-heritage-green/60 cursor-not-allowed'
                                                            : 'bg-heritage-green hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-green hover:scale-105 hover:shadow-lg'}`, children: [loading && (_jsx("span", { className: "absolute inset-y-0 left-0 flex items-center pl-4", children: _jsx("div", { className: "w-5 h-5 border-t-2 border-white rounded-full animate-spin" }) })), loading ? 'Signing in...' : 'Sign In'] }) }), _jsx("div", { className: "text-center pt-6 border-t border-gray-200", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/auth?mode=register", className: "font-semibold text-heritage-green hover:text-heritage-green/80 transition-colors duration-200", children: "Create one here" })] }) })] })] })] }) })] })] }));
};
export default LoginPage;
