import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/shared/navigation/Header';
import { SuccessModal } from '../../components/auth/SuccessModal';

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, userData, error: authError, loading } = useAuth();
  
  // Form mode state - check URL params for initial mode
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  // Login form data
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  // Register form data
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Partial<LoginFormData & RegisterFormData>>({});
  const [error, setError] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<{ firstName: string; lastName: string; email: string; password: string } | null>(null);

  // Handle initial mode from URL with animation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const modeFromUrl = searchParams.get('mode') === 'register';
    
    if (modeFromUrl) {
      // Small delay to ensure component is mounted before animation
      setTimeout(() => {
        setIsRegisterMode(true);
        setShouldAnimate(true);
      }, 100);
    } else {
      setShouldAnimate(true);
    }
  }, [location.search]);

  // Redirect if already logged in (but not during registration flow)
  useEffect(() => {
    if (userData && !showSuccessModal) {
      // Check if this is an admin user
      if (userData.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
        return;
      }
      
      const from = (location.state as { from: { pathname: string } })?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
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

  const validateLoginForm = (): boolean => {
    console.log('Validating login form with data:', loginData);
    const newErrors: Partial<LoginFormData> = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    console.log('Validation errors:', newErrors);
    console.log('Validation passed:', Object.keys(newErrors).length === 0);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!registerData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!registerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else {
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
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted! Mode:', isRegisterMode ? 'register' : 'login');
    
    if (isRegisterMode) {
      if (!validateRegisterForm()) return;
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
      } catch (err) {
        console.error('Registration failed:', err);
      }
    } else {
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
        } else {
          console.log('Not admin credentials, proceeding with regular login...');
        }
        
        await login(loginData);
        // Redirect to landing page after successful login
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Login failed:', err);
      }
    }
  };

  const handleLoginInputChange = (field: keyof LoginFormData, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegisterInputChange = (field: keyof RegisterFormData, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const newErrors = { ...errors };
    
    if (field === 'firstName') {
      if (!value.trim()) {
        newErrors.firstName = 'First name is required';
      } else {
        delete newErrors.firstName;
      }
    }
    
    if (field === 'lastName') {
      if (!value.trim()) {
        newErrors.lastName = 'Last name is required';
      } else {
        delete newErrors.lastName;
      }
    }
    
    if (field === 'email') {
      if (!value) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = 'Invalid email address';
      } else {
        delete newErrors.email;
      }
    }
    
    if (field === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else {
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
        } else {
          delete newErrors.password;
        }
      }
      
      // Also validate confirm password if it exists
      if (registerData.confirmPassword && value !== registerData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else if (registerData.confirmPassword && value === registerData.confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }
    
    if (field === 'confirmPassword') {
      if (!value) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (registerData.password !== value) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    
    setErrors(newErrors);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrors({});
    setError('');
    // Reset password visibility states when switching modes
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSuccessModalClose = async () => {
    setShowSuccessModal(false);
    if (registrationData) {
      // Auto-login the user after successful registration
      try {
        await login({
          email: registrationData.email,
          password: registrationData.password
        });
        // Redirect to landing page after login
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Auto-login failed:', err);
        // If auto-login fails, switch to login mode
        setIsRegisterMode(false);
        setError('Registration successful! Please sign in with your credentials.');
      }
      setRegistrationData(null);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      
      {/* Hero Background Section */}
      <div className="relative h-full flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/30 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
            
            {/* Left Side - Welcome Content */}
            <div className="text-white space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Welcome to <span className="text-heritage-light">Balay Ginhawa</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mt-6 leading-relaxed">
                  Experience authentic Filipino heritage in our luxurious accommodations
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-heritage-light rounded-full"></div>
                  <p className="text-lg text-white/80">Luxury rooms with Filipino cultural touches</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-heritage-light rounded-full"></div>
                  <p className="text-lg text-white/80">World-class amenities and services</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-heritage-light rounded-full"></div>
                  <p className="text-lg text-white/80">Authentic Filipino hospitality</p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Auth Form */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="relative mx-auto mb-4 w-12 h-12">
                      <div className="w-12 h-12 border-4 border-heritage-green/20 rounded-full animate-spin">
                        <div className="absolute inset-0 w-12 h-12 border-t-4 border-heritage-green rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <p className="text-heritage-green font-semibold">
                      {isRegisterMode ? 'Creating your account...' : 'Signing you in...'}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Please wait</p>
                  </div>
                </div>
              )}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-6">
                  <img 
                    src="/BalayGinhawa/balaylogopng.png" 
                    alt="Balay Ginhawa Logo" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 transition-all duration-300">
                  {isRegisterMode ? 'Create Account' : 'Sign In'}
                </h2>
                <p className="text-gray-600">
                  {isRegisterMode ? 'Join our heritage hotel family' : 'Access your account to continue'}
                </p>
              </div>

              <form className={`space-y-4 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`} onSubmit={handleSubmit}>
                <div className={`space-y-4 ${shouldAnimate ? 'transition-all duration-500' : ''} ${isRegisterMode ? 'opacity-100' : 'opacity-100'}`}>
                  
                  {/* Registration Fields */}
                  <div className={`grid grid-cols-2 gap-4 ${shouldAnimate ? 'transition-all duration-500' : ''} overflow-hidden ${
                    isRegisterMode ? 'max-h-32 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
                  }`}>
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) => handleRegisterInputChange('firstName', e.target.value)}
                        className={`block w-full px-3 py-3 border ${
                          errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`}
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={registerData.lastName}
                        onChange={(e) => handleRegisterInputChange('lastName', e.target.value)}
                        className={`block w-full px-3 py-3 border ${
                          errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`}
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={isRegisterMode ? registerData.email : loginData.email}
                        onChange={(e) => isRegisterMode 
                          ? handleRegisterInputChange('email', e.target.value)
                          : handleLoginInputChange('email', e.target.value)
                        }
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={isRegisterMode ? "new-password" : "current-password"}
                        value={isRegisterMode ? registerData.password : loginData.password}
                        onChange={(e) => isRegisterMode 
                          ? handleRegisterInputChange('password', e.target.value)
                          : handleLoginInputChange('password', e.target.value)
                        }
                        className={`block w-full pl-10 pr-12 py-3 border ${
                          errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field - Only for Registration */}
                  <div className={`${shouldAnimate ? 'transition-all duration-500' : ''} overflow-hidden ${
                    isRegisterMode ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
                  }`}>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={registerData.confirmPassword}
                        onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
                        className={`block w-full pl-10 pr-12 py-3 border ${
                          errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-heritage-green focus:border-heritage-green'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-lg text-white transition-all duration-300 ${
                      loading
                        ? 'bg-heritage-green/60 cursor-not-allowed'
                        : 'bg-heritage-green hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-green hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    {loading && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <div className="relative">
                          <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin">
                            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                          </div>
                        </div>
                      </span>
                    )}
                    {loading 
                      ? (isRegisterMode ? 'Creating Account...' : 'Signing in...') 
                      : (isRegisterMode ? 'Create Account' : 'Sign In')
                    }
                  </button>
                </div>
                
                {/* Toggle Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-heritage-green hover:text-heritage-green/80 transition-colors duration-200"
                    >
                      {isRegisterMode ? 'Sign in here' : 'Create one here'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Account Created Successfully!"
        message={`Welcome to Balay Ginhawa, ${registrationData?.firstName}! Your account has been created and you're now ready to experience authentic Filipino hospitality.`}
        buttonText="Continue to Dashboard"
      />
    </div>
  );
};

export default AuthPage;
