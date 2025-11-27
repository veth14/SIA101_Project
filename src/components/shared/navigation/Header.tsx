import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', scrollTo: 'home', type: 'scroll' },
    { name: 'About', href: '/', scrollTo: 'about', type: 'scroll' },
    { name: 'Amenities', href: '/amenities', scrollTo: 'amenities', type: 'link' },
    { name: 'Rooms', href: '/rooms', scrollTo: 'rooms', type: 'link' },
  ];

  // Pages where header should always be solid (not transparent)
  const solidHeaderPages = ['/booking', '/submit-review', '/myrequests', '/payment', '/my-bookings', '/profile', '/rooms', '/amenities', '/help', '/faqs', '/privacy-policy', '/terms-conditions', '/contact', '/about'];
  const shouldUseSolidHeader = solidHeaderPages.some(page => location.pathname.startsWith(page));
  
  // Mobile menu should be solid on auth pages for better visibility
  const shouldMobileMenuBeSolid = isScrolled || shouldUseSolidHeader || location.pathname.startsWith('/auth');


  const handleScrollTo = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first then scroll
      navigate('/');
      // Use setTimeout to allow navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for fixed header height
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
  }, [location.pathname]);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled || shouldUseSolidHeader
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className={`w-full py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled || shouldUseSolidHeader ? 'border-b border-heritage-light/20' : ''
        }`}>
          <div className="flex items-center">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-2 sm:space-x-3 md:space-x-4"
            >
              <img 
                src="/BalayGinhawa/balaylogopng.png" 
                alt="Balay Ginhawa Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain transition-all duration-300 flex-shrink-0"
              />
              <span className={`text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300 whitespace-nowrap ${
                isScrolled || shouldUseSolidHeader ? 'text-heritage-green' : 'text-white'
              }`}>
                Balay Ginhawa
              </span>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden ml-12 space-x-8 lg:flex">
              {navigation.map((link) => (
                link.type === 'link' ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`relative text-base font-medium transition-all duration-300 group ${
                      location.pathname === link.href
                        ? isScrolled || shouldUseSolidHeader
                          ? 'text-heritage-green'
                          : 'text-white font-semibold'
                        : location.pathname === '/' && (isScrolled || shouldUseSolidHeader)
                          ? 'text-gray-700 hover:text-heritage-green'
                          : location.pathname === '/'
                            ? 'text-white/90 hover:text-white'
                            : isScrolled || shouldUseSolidHeader
                              ? 'text-gray-700 hover:text-heritage-green'
                              : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      location.pathname === link.href
                        ? 'w-full'
                        : 'w-0'
                    } ${
                      isScrolled || shouldUseSolidHeader
                        ? 'bg-heritage-green'
                        : 'bg-white'
                    }`}></span>
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleScrollTo(link.scrollTo)}
                    className={`relative text-base font-medium transition-all duration-300 group ${
                      location.pathname === '/' && (isScrolled || shouldUseSolidHeader)
                        ? 'text-gray-700 hover:text-heritage-green'
                        : location.pathname === '/'
                          ? 'text-white/90 hover:text-white'
                          : isScrolled || shouldUseSolidHeader
                            ? 'text-gray-700 hover:text-heritage-green'
                            : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isScrolled || shouldUseSolidHeader
                        ? 'bg-heritage-green'
                        : 'bg-white'
                    }`}></span>
                  </button>
                )
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {userData ? (
              <>
                {userData.role === 'guest' ? (
                  <>
                    {/* Book Now - Hidden on very small screens, shows on sm+ */}
                    <Link
                      to="/booking"
                      className={`hidden sm:inline-flex px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${
                        isScrolled || shouldUseSolidHeader
                          ? 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-md'
                          : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                      }`}
                    >
                      Book Now
                    </Link>
                    
                    {/* User Profile Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowUserDropdown(!showUserDropdown);
                          setIsMobileMenuOpen(false); // Close mobile menu when opening user dropdown
                        }}
                        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                          isScrolled || shouldUseSolidHeader
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                        }`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-heritage-green rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden md:block font-medium text-sm">
                          {userData.displayName || userData.email?.split('@')[0]}
                        </span>
                        <svg 
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${showUserDropdown ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {showUserDropdown && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                          {/* User Info Header */}
                          <div className="p-4 bg-gradient-to-r from-heritage-green to-heritage-neutral">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg">
                                  {userData.displayName || 'Guest User'}
                                </h3>
                                <p className="text-white/80 text-sm">{userData.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <button
                              onClick={() => {
                                setShowUserDropdown(false);
                                navigate('/profile');
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <div className="text-left">
                                <div className="font-medium">My Profile</div>
                                <div className="text-sm text-gray-500">Manage your account details</div>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                  setShowUserDropdown(false);
                                  navigate('/my-bookings');
                                }}
                              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div className="text-left">
                                <div className="font-medium">My Bookings</div>
                                <div className="text-sm text-gray-500">View your reservations</div>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                setShowUserDropdown(false);
                                navigate('/submit-review');
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.284 3.95a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.284 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.839-.197-1.54-1.118l1.284-3.95a1 1 0 00-.364-1.118L2.07 9.377c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.284-3.95z" />
                              </svg>
                              <div className="text-left">
                                <div className="font-medium">Submit Review</div>
                                <div className="text-sm text-gray-500">Share your stay experience</div>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                setShowUserDropdown(false);
                                navigate('/myrequests');
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              <div className="text-left">
                                <div className="font-medium">My Requests</div>
                                <div className="text-sm text-gray-500">Track support requests</div>
                              </div>
                            </button>

                            <hr className="my-2" />

                            <button
                              onClick={() => {
                                setShowUserDropdown(false);
                                logout();
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <div className="text-left">
                                <div className="font-medium">Sign Out</div>
                                <div className="text-sm text-red-500">Log out of your account</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Click outside to close dropdown */}
                      {showUserDropdown && (
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserDropdown(false)}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <Link
                    to="/account"
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      isScrolled || shouldUseSolidHeader
                        ? 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-md'
                        : 'bg-heritage-green text-white hover:bg-heritage-green/90'
                    }`}
                  >
                    My Account
                  </Link>
                )}
              </>
            ) : (
              <>
                {/* Sign In - Hidden on extra small, visible on sm+ */}
                <Link
                  to="/auth"
                  className={`hidden sm:inline-flex px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${
                    isScrolled || shouldUseSolidHeader
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  Sign in
                </Link>
                {/* Register - Always visible, responsive sizing */}
                <Link
                  to="/auth?mode=register"
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${
                    isScrolled || shouldUseSolidHeader
                      ? 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-md'
                      : 'bg-heritage-green text-white hover:bg-heritage-green/90'
                  }`}
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled || shouldUseSolidHeader
                  ? 'text-gray-700 hover:text-heritage-green hover:bg-heritage-light/20'
                  : 'text-white hover:text-white/80 hover:bg-white/20'
              }`}
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setShowUserDropdown(false); // Close user dropdown when opening mobile menu
              }}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden transition-all duration-500 ease-in-out rounded-b-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 fade-in mb-6 ${
            shouldMobileMenuBeSolid
              ? 'bg-gradient-to-b from-white via-white to-gray-50/50 backdrop-blur-xl border-t border-gray-200'
              : 'bg-slate-900/98 backdrop-blur-xl border-t border-white/10'
          }`}>
            <div className="px-4 pt-5 pb-8 space-y-2">
              {navigation.map((link) => (
                link.type === 'link' ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                      location.pathname === link.href
                        ? shouldMobileMenuBeSolid
                          ? 'text-heritage-green bg-gradient-to-r from-heritage-light/40 to-heritage-light/20 shadow-sm'
                          : 'text-heritage-light bg-white/20 shadow-sm'
                        : shouldMobileMenuBeSolid
                          ? 'text-gray-700 hover:text-heritage-green hover:bg-gradient-to-r hover:from-heritage-light/30 hover:to-heritage-light/10'
                          : 'text-white hover:text-heritage-light hover:bg-white/20'
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => {
                      handleScrollTo(link.scrollTo);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                      shouldMobileMenuBeSolid
                        ? 'text-gray-700 hover:text-heritage-green hover:bg-gradient-to-r hover:from-heritage-light/30 hover:to-heritage-light/10'
                        : 'text-white hover:text-heritage-light hover:bg-white/20'
                    }`}
                  >
                    {link.name}
                  </button>
                )
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className={`pt-5 pb-2 space-y-3 transition-colors duration-300 ${
                shouldMobileMenuBeSolid ? 'border-t border-gray-200' : 'border-t border-white/20'
              }`}>
                {userData ? (
                  <>
                    {userData.role === 'guest' ? (
                      <>
                        <Link
                          to="/booking"
                          className="block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-all duration-300 shadow-md transform hover:scale-[1.02]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Book Now
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className={`block w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                            shouldMobileMenuBeSolid
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                          }`}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/account"
                        className="block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-all duration-300 shadow-md transform hover:scale-[1.02]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Account
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className={`block w-full text-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                        shouldMobileMenuBeSolid
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                          : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/auth?mode=register"
                      className="block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-all duration-300 shadow-md transform hover:scale-[1.02]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
