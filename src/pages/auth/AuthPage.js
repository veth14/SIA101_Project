import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/shared/navigation/Header';
import { SuccessModal } from '../../components/auth/SuccessModal';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { EmailVerificationModal } from '../../components/auth/EmailVerificationModal';
export const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, userData, error: authError, loading } = useAuth();
    // Form mode state - check URL params for initial mode
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    // Login form data
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    // Register form data
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    // Email verification modal state
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');
    const [unverifiedPassword, setUnverifiedPassword] = useState('');
    // Handle initial mode from URL with animation
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const modeFromUrl = searchParams.get('mode') === 'register';
        // Small delay to ensure component is mounted before animation
        setTimeout(() => {
            setIsRegisterMode(modeFromUrl);
            setShouldAnimate(true);
            // Clear errors and reset password visibility when switching modes
            setErrors({});
            setError('');
            setShowPassword(false);
            setShowConfirmPassword(false);
        }, 100);
    }, [location.search]);
    // Redirect if already logged in (but not during registration flow)
    useEffect(() => {
        if (userData && !showSuccessModal) {
            // Check if this is an admin user
            if (userData.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
                return;
            }
            const from = location.state?.from?.pathname;
            if (from) {
                navigate(from, { replace: true });
            }
            else {
                // Regular users redirect to landing page
                navigate('/', { replace: true });
            }
        }
    }, [userData, navigate, location.state, showSuccessModal]);
    // Update error message when auth error changes
    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);
    const validateLoginForm = () => {
        console.log('Validating login form with data:', loginData);
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
        console.log('Validation errors:', newErrors);
        console.log('Validation passed:', Object.keys(newErrors).length === 0);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateRegisterForm = () => {
        const newErrors = {};
        if (!registerData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!registerData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!registerData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!registerData.password) {
            newErrors.password = 'Password is required';
        }
        else {
            const password = registerData.password;
            const passwordErrors = [];
            if (password.length < 8) {
                passwordErrors.push('at least 8 characters');
            }
            if (!/[A-Z]/.test(password)) {
                passwordErrors.push('one uppercase letter');
            }
            if (!/[a-z]/.test(password)) {
                passwordErrors.push('one lowercase letter');
            }
            if (!/\d/.test(password)) {
                passwordErrors.push('one number');
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                passwordErrors.push('one special character');
            }
            if (passwordErrors.length > 0) {
                newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
            }
        }
        if (!registerData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        }
        else if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted! Mode:', isRegisterMode ? 'register' : 'login');
        if (isRegisterMode) {
            if (!validateRegisterForm())
                return;
            try {
                setError('');
                await register({
                    email: registerData.email,
                    password: registerData.password,
                    firstName: registerData.firstName,
                    lastName: registerData.lastName
                });
                // Store registration data and show success modal
                setRegistrationData({
                    firstName: registerData.firstName,
                    lastName: registerData.lastName,
                    email: registerData.email,
                    password: registerData.password
                });
                setShowSuccessModal(true);
            }
            catch (err) {
                console.error('Registration failed:', err);
            }
        }
        else {
            console.log('Login mode - about to validate form');
            if (!validateLoginForm()) {
                console.log('Validation failed, stopping form submission');
                return;
            }
            console.log('Validation passed, proceeding with login');
            try {
                setError('');
                console.log('Login attempt with:', { email: loginData.email, password: loginData.password });
                // Check for admin credentials
                console.log('Checking admin credentials...');
                const isAdminEmail = loginData.email === 'balayginhawaAdmin123@gmail.com';
                const isAdminPassword = loginData.password === 'Admin12345';
                console.log('Admin email match:', isAdminEmail);
                console.log('Admin password match:', isAdminPassword);
                if (isAdminEmail && isAdminPassword) {
                    // Create admin user session using the Firebase document data
                    const adminUser = {
                        uid: 'umHx9eeK065G2XoyONRB', // Use the actual Firebase document ID
                        email: 'balayginhawaAdmin123@gmail.com',
                        displayName: 'Admin',
                        role: 'admin',
                        firstName: 'Admin',
                        lastName: 'User',
                        createdAt: new Date('2025-09-18T20:31:21.000Z'), // From your Firebase document
                        lastLogin: new Date() // Update to current time
                    };
                    console.log('Admin login successful, user object:', adminUser);
                    // Store admin session in sessionStorage (will be cleared when browser/tab closes)
                    sessionStorage.setItem('adminUser', JSON.stringify(adminUser));
                    sessionStorage.setItem('isAdminAuthenticated', 'true');
                    console.log('Admin session stored, redirecting to admin dashboard...');
                    // Use window.location for immediate redirect to bypass any other navigation logic
                    window.location.href = '/admin/dashboard';
                    return;
                }
                else {
                    console.log('Not admin credentials, proceeding with regular login...');
                }
                await login(loginData);
                // Redirect to landing page after successful login
                navigate('/', { replace: true });
            }
            catch (err) {
                console.error('Login failed:', err);
                // Check if error is due to unverified email
                if (err.message && err.message.includes('Email not verified')) {
                    setUnverifiedEmail(loginData.email);
                    setUnverifiedPassword(loginData.password);
                    setShowVerificationModal(true);
                }
            }
        }
    };
    const handleLoginInputChange = (field, value) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };
    const handleRegisterInputChange = (field, value) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
        // Real-time validation
        const newErrors = { ...errors };
        if (field === 'firstName') {
            if (!value.trim()) {
                newErrors.firstName = 'First name is required';
            }
            else {
                delete newErrors.firstName;
            }
        }
        if (field === 'lastName') {
            if (!value.trim()) {
                newErrors.lastName = 'Last name is required';
            }
            else {
                delete newErrors.lastName;
            }
        }
        if (field === 'email') {
            if (!value) {
                newErrors.email = 'Email is required';
            }
            else if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = 'Invalid email address';
            }
            else {
                delete newErrors.email;
            }
        }
        if (field === 'password') {
            if (!value) {
                newErrors.password = 'Password is required';
            }
            else {
                const passwordErrors = [];
                if (value.length < 8) {
                    passwordErrors.push('at least 8 characters');
                }
                if (!/[A-Z]/.test(value)) {
                    passwordErrors.push('one uppercase letter');
                }
                if (!/[a-z]/.test(value)) {
                    passwordErrors.push('one lowercase letter');
                }
                if (!/\d/.test(value)) {
                    passwordErrors.push('one number');
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    passwordErrors.push('one special character');
                }
                if (passwordErrors.length > 0) {
                    newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
                }
                else {
                    delete newErrors.password;
                }
            }
            // Also validate confirm password if it exists
            if (registerData.confirmPassword && value !== registerData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            else if (registerData.confirmPassword && value === registerData.confirmPassword) {
                delete newErrors.confirmPassword;
            }
        }
        if (field === 'confirmPassword') {
            if (!value) {
                newErrors.confirmPassword = 'Please confirm your password';
            }
            else if (registerData.password !== value) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            else {
                delete newErrors.confirmPassword;
            }
        }
        setErrors(newErrors);
    };
    const toggleMode = () => {
        // Navigate to proper URL instead of just toggling state
        if (isRegisterMode) {
            // Switch to login mode
            navigate('/auth');
        }
        else {
            // Switch to register mode
            navigate('/auth?mode=register');
        }
        // The useEffect will handle the actual state changes
    };
    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        // Don't auto-login - require email verification first
        // Switch to login mode so user can try to login after verifying
        setIsRegisterMode(false);
        setRegistrationData(null);
        // Clear the form
        setRegisterData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };
    return (_jsxs("div", { className: "min-h-screen overflow-hidden", children: [_jsx(Header, {}), _jsxs("div", { className: "relative min-h-screen flex items-center justify-center py-20 sm:py-24", children: [_jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [_jsx("div", { className: "absolute inset-0 w-full h-full bg-cover bg-center", style: {
                                    backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
                                } }), _jsx("div", { className: "absolute inset-0 bg-black/60" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/30 to-transparent" })] }), _jsx("div", { className: "relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pointer-events-auto", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-6 sm:gap-8 items-center", children: [_jsxs("div", { className: "hidden lg:block text-white space-y-6 lg:space-y-8", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight", children: ["Welcome to ", _jsx("span", { className: "text-heritage-light", children: "Balay Ginhawa" })] }), _jsx("p", { className: "text-xl md:text-2xl text-white/90 mt-4 lg:mt-6 leading-relaxed", children: "Experience authentic Filipino heritage in our luxurious accommodations" })] }), _jsxs("div", { className: "space-y-3 lg:space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full flex-shrink-0" }), _jsx("p", { className: "text-base lg:text-lg text-white/80", children: "Luxury rooms with Filipino cultural touches" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full flex-shrink-0" }), _jsx("p", { className: "text-base lg:text-lg text-white/80", children: "World-class amenities and services" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full flex-shrink-0" }), _jsx("p", { className: "text-base lg:text-lg text-white/80", children: "Authentic Filipino hospitality" })] })] })] }), _jsxs("div", { className: "relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 border border-white/20 w-full max-w-md lg:max-w-none mx-auto", children: [loading && (_jsx("div", { className: "absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "relative mx-auto mb-4 w-12 h-12", children: _jsx("div", { className: "w-12 h-12 border-4 border-heritage-green/20 rounded-full animate-spin", children: _jsx("div", { className: "absolute inset-0 w-12 h-12 border-t-4 border-heritage-green rounded-full animate-spin" }) }) }), _jsx("p", { className: "text-heritage-green font-semibold", children: isRegisterMode ? 'Creating your account...' : 'Signing you in...' }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Please wait" })] }) })), _jsxs("div", { className: "text-center mb-5 sm:mb-6", children: [_jsx("div", { className: "flex items-center justify-center mb-3 sm:mb-4", children: _jsx("img", { src: "/BalayGinhawa/balaylogopng.png", alt: "Balay Ginhawa Logo", className: "w-14 h-14 sm:w-16 sm:h-16 object-contain" }) }), _jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-gray-900 mb-2 transition-all duration-300", children: isRegisterMode ? 'Create Account' : 'Sign In' }), _jsx("p", { className: "text-sm sm:text-base text-gray-600", children: isRegisterMode ? 'Join our heritage hotel family' : 'Access your account to continue' })] }), _jsxs("form", { className: `space-y-3 sm:space-y-4 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`, onSubmit: handleSubmit, children: [_jsxs("div", { className: `space-y-3 ${shouldAnimate ? 'transition-all duration-500' : ''} ${isRegisterMode ? 'opacity-100' : 'opacity-100'}`, children: [_jsxs("div", { className: `grid grid-cols-1 sm:grid-cols-2 gap-3 ${shouldAnimate ? 'transition-all duration-500' : ''} overflow-hidden ${isRegisterMode ? 'max-h-96 sm:max-h-32 opacity-100' : 'max-h-0 opacity-0'}`, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "firstName", className: "block text-sm font-semibold text-gray-700 mb-1", children: "First Name" }), _jsx("input", { id: "firstName", type: "text", value: registerData.firstName, onChange: (e) => handleRegisterInputChange('firstName', e.target.value), className: `block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`, placeholder: "First name" }), errors.firstName && (_jsx("p", { className: "mt-0.5 text-xs text-red-600", children: errors.firstName }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "lastName", className: "block text-sm font-semibold text-gray-700 mb-1", children: "Last Name" }), _jsx("input", { id: "lastName", type: "text", value: registerData.lastName, onChange: (e) => handleRegisterInputChange('lastName', e.target.value), className: `block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`, placeholder: "Last name" }), errors.lastName && (_jsx("p", { className: "mt-0.5 text-xs text-red-600", children: errors.lastName }))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 mb-1", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" }) }) }), _jsx("input", { id: "email", type: "email", autoComplete: "email", value: isRegisterMode ? registerData.email : loginData.email, onChange: (e) => isRegisterMode
                                                                                ? handleRegisterInputChange('email', e.target.value)
                                                                                : handleLoginInputChange('email', e.target.value), className: `block w-full pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`, placeholder: "Enter your email address" })] }), errors.email && (_jsxs("p", { className: "mt-1 text-xs text-red-600 flex items-center", children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), errors.email] }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }), _jsx("input", { id: "password", type: showPassword ? "text" : "password", autoComplete: isRegisterMode ? "new-password" : "current-password", value: isRegisterMode ? registerData.password : loginData.password, onChange: (e) => isRegisterMode
                                                                                ? handleRegisterInputChange('password', e.target.value)
                                                                                : handleLoginInputChange('password', e.target.value), className: `block w-full pl-10 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`, placeholder: "Enter your password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200", children: showPassword ? (_jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" }) })) : (_jsxs("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }), errors.password && (_jsxs("p", { className: "mt-1 text-xs text-red-600 flex items-center", children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), errors.password] })), isRegisterMode && _jsx(PasswordStrengthIndicator, { password: registerData.password })] }), _jsxs("div", { className: `${shouldAnimate ? 'transition-all duration-500' : ''} overflow-hidden ${isRegisterMode ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`, children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-semibold text-gray-700 mb-1", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }), _jsx("input", { id: "confirmPassword", type: showConfirmPassword ? "text" : "password", autoComplete: "new-password", value: registerData.confirmPassword, onChange: (e) => handleRegisterInputChange('confirmPassword', e.target.value), className: `block w-full pl-10 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`, placeholder: "Confirm your password" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200", children: showConfirmPassword ? (_jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" }) })) : (_jsxs("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }), errors.confirmPassword && (_jsxs("p", { className: "mt-1 text-xs text-red-600 flex items-center", children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), errors.confirmPassword] }))] })] }), error && (_jsx("div", { className: "p-4 rounded-lg bg-red-50 border border-red-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-5 h-5 text-red-400 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }), _jsx("p", { className: "text-sm text-red-700 font-medium", children: error })] }) })), _jsx("div", { className: "pt-1", children: _jsxs("button", { type: "submit", disabled: loading, className: `group relative w-full flex justify-center py-3 sm:py-4 px-6 border border-transparent text-sm sm:text-base font-semibold rounded-lg text-white transition-all duration-300 ${loading
                                                            ? 'bg-heritage-green/60 cursor-not-allowed'
                                                            : 'bg-heritage-green hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-green hover:scale-105 hover:shadow-lg'}`, children: [loading && (_jsx("span", { className: "absolute inset-y-0 left-0 flex items-center pl-4", children: _jsx("div", { className: "relative", children: _jsx("div", { className: "w-5 h-5 border-2 border-white/30 rounded-full animate-spin", children: _jsx("div", { className: "absolute top-0 left-0 w-5 h-5 border-t-2 border-white rounded-full animate-spin" }) }) }) })), loading
                                                                ? (isRegisterMode ? 'Creating Account...' : 'Signing in...')
                                                                : (isRegisterMode ? 'Create Account' : 'Sign In')] }) }), _jsx("div", { className: "text-center pt-5 sm:pt-6 border-t border-gray-200", children: _jsxs("p", { className: "text-xs sm:text-sm text-gray-600", children: [isRegisterMode ? 'Already have an account?' : "Don't have an account?", ' ', _jsx("button", { type: "button", onClick: toggleMode, className: "font-semibold text-heritage-green hover:text-heritage-green/80 transition-colors duration-200", children: isRegisterMode ? 'Sign in here' : 'Create one here' })] }) })] })] })] }) })] }), _jsx(SuccessModal, { isOpen: showSuccessModal, onClose: handleSuccessModalClose, title: "Account Created Successfully!", message: `Welcome, ${registrationData?.firstName}! A verification email has been sent to ${registrationData?.email}. You must verify your email before you can log in.`, buttonText: "I Understand - Go to Login" }), _jsx(EmailVerificationModal, { isOpen: showVerificationModal, onClose: () => {
                    setShowVerificationModal(false);
                    setUnverifiedPassword(''); // Clear password when closing
                }, email: unverifiedEmail, password: unverifiedPassword })] }));
};
export default AuthPage;
