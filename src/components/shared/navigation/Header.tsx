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
  const solidHeaderPages = ['/booking', '/myrequests', '/payment', '/mybookings', '/profile', '/rooms', '/amenities', '/help', '/faqs', '/privacy-policy', '/terms-conditions', '/contact', '/about'];
  const shouldUseSolidHeader = solidHeaderPages.some(page => location.pathname.startsWith(page));


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
              className="flex items-center space-x-4"
            >
              <img 
                src="/BalayGinhawa/balaylogopng.png" 
                alt="Balay Ginhawa Logo" 
                className="w-16 h-16 object-contain transition-all duration-300"
              />
              <span className={`text-2xl font-bold transition-colors duration-300 ${
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
          <div className="flex items-center space-x-3">
            {userData ? (
              <>
                {userData.role === 'guest' ? (
                  <>
                    <Link
                      to="/booking"
                      className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
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
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                          isScrolled || shouldUseSolidHeader
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                        }`}
                      >
                        <div className="w-8 h-8 bg-heritage-green rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden md:block font-medium">
                          {userData.displayName || userData.email?.split('@')[0]}
                        </span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}
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
                                navigate('/mybookings');
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
                <Link
                  to="/auth"
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                    isScrolled || shouldUseSolidHeader
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/auth?mode=register"
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
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
              className={`lg:hidden p-2 rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:text-heritage-green hover:bg-heritage-light/20'
                  : 'text-white hover:text-white/80 hover:bg-white/20'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          <div className={`lg:hidden transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-md border-t border-heritage-light/20' 
              : 'bg-black/20 backdrop-blur-md border-t border-white/20'
          }`}>
            <div className="px-4 py-6 space-y-4">
              {navigation.map((link) => (
                link.type === 'link' ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      location.pathname === link.href
                        ? isScrolled
                          ? 'text-heritage-green bg-heritage-light/20'
                          : 'text-white bg-white/20'
                        : isScrolled
                          ? 'text-gray-700 hover:text-heritage-green hover:bg-heritage-light/20'
                          : 'text-white/90 hover:text-white hover:bg-white/20'
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
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'text-gray-700 hover:text-heritage-green hover:bg-heritage-light/20'
                        : 'text-white/90 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {link.name}
                  </button>
                )
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-current/20 space-y-3">
                {userData ? (
                  <>
                    {userData.role === 'guest' ? (
                      <>
                        <Link
                          to="/booking"
                          className={`block w-full text-center px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            isScrolled
                              ? 'bg-heritage-light/20 text-heritage-green hover:bg-heritage-light/30'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Book Now
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full px-4 py-3 bg-heritage-green text-white rounded-lg font-semibold hover:bg-heritage-green/90 transition-all duration-300"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/account"
                        className="block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-lg font-semibold hover:bg-heritage-green/90 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Account
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`block w-full text-center px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        isScrolled
                          ? 'bg-heritage-light/20 text-heritage-green hover:bg-heritage-light/30'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/auth?mode=register"
                      className="block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-lg font-semibold hover:bg-heritage-green/90 transition-all duration-300"
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
