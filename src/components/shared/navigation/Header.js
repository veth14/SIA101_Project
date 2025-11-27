import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    const solidHeaderPages = ['/booking', '/submit-review', '/myrequests', '/payment', '/mybookings', '/profile', '/rooms', '/amenities', '/help', '/faqs', '/privacy-policy', '/terms-conditions', '/contact', '/about'];
    const shouldUseSolidHeader = solidHeaderPages.some(page => location.pathname.startsWith(page));
    // Mobile menu should be solid on auth pages for better visibility
    const shouldMobileMenuBeSolid = isScrolled || shouldUseSolidHeader || location.pathname.startsWith('/auth');
    const handleScrollTo = (sectionId) => {
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
    return (_jsx("header", { className: `fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled || shouldUseSolidHeader
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'}`, children: _jsxs("nav", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", "aria-label": "Top", children: [_jsxs("div", { className: `w-full py-4 flex items-center justify-between transition-all duration-300 ${isScrolled || shouldUseSolidHeader ? 'border-b border-heritage-light/20' : ''}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsxs(Link, { to: "/", onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }), className: "flex items-center space-x-2 sm:space-x-3 md:space-x-4", children: [_jsx("img", { src: "/BalayGinhawa/balaylogopng.png", alt: "Balay Ginhawa Logo", className: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain transition-all duration-300 flex-shrink-0" }), _jsx("span", { className: `text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300 whitespace-nowrap ${isScrolled || shouldUseSolidHeader ? 'text-heritage-green' : 'text-white'}`, children: "Balay Ginhawa" })] }), _jsx("div", { className: "hidden ml-12 space-x-8 lg:flex", children: navigation.map((link) => (link.type === 'link' ? (_jsxs(Link, { to: link.href, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }), className: `relative text-base font-medium transition-all duration-300 group ${location.pathname === link.href
                                            ? isScrolled || shouldUseSolidHeader
                                                ? 'text-heritage-green'
                                                : 'text-white font-semibold'
                                            : location.pathname === '/' && (isScrolled || shouldUseSolidHeader)
                                                ? 'text-gray-700 hover:text-heritage-green'
                                                : location.pathname === '/'
                                                    ? 'text-white/90 hover:text-white'
                                                    : isScrolled || shouldUseSolidHeader
                                                        ? 'text-gray-700 hover:text-heritage-green'
                                                        : 'text-white/90 hover:text-white'}`, children: [link.name, _jsx("span", { className: `absolute -bottom-1 left-0 h-0.5 transition-all duration-300 group-hover:w-full ${location.pathname === link.href
                                                    ? 'w-full'
                                                    : 'w-0'} ${isScrolled || shouldUseSolidHeader
                                                    ? 'bg-heritage-green'
                                                    : 'bg-white'}` })] }, link.name)) : (_jsxs("button", { onClick: () => handleScrollTo(link.scrollTo), className: `relative text-base font-medium transition-all duration-300 group ${location.pathname === '/' && (isScrolled || shouldUseSolidHeader)
                                            ? 'text-gray-700 hover:text-heritage-green'
                                            : location.pathname === '/'
                                                ? 'text-white/90 hover:text-white'
                                                : isScrolled || shouldUseSolidHeader
                                                    ? 'text-gray-700 hover:text-heritage-green'
                                                    : 'text-white/90 hover:text-white'}`, children: [link.name, _jsx("span", { className: `absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isScrolled || shouldUseSolidHeader
                                                    ? 'bg-heritage-green'
                                                    : 'bg-white'}` })] }, link.name)))) })] }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [userData ? (_jsx(_Fragment, { children: userData.role === 'guest' ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/booking", className: `hidden sm:inline-flex px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${isScrolled || shouldUseSolidHeader
                                                    ? 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-md'
                                                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'}`, children: "Book Now" }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => {
                                                            setShowUserDropdown(!showUserDropdown);
                                                            setIsMobileMenuOpen(false); // Close mobile menu when opening user dropdown
                                                        }, className: `flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 ${isScrolled || shouldUseSolidHeader
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                                            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'}`, children: [_jsx("div", { className: "w-7 h-7 sm:w-8 sm:h-8 bg-heritage-green rounded-full flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-white font-semibold text-xs sm:text-sm", children: userData.displayName ? userData.displayName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase() }) }), _jsx("span", { className: "hidden md:block font-medium text-sm", children: userData.displayName || userData.email?.split('@')[0] }), _jsx("svg", { className: `w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${showUserDropdown ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), showUserDropdown && (_jsxs("div", { className: "absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden", children: [_jsx("div", { className: "p-4 bg-gradient-to-r from-heritage-green to-heritage-neutral", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-white/20 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-lg", children: userData.displayName ? userData.displayName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase() }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-semibold text-lg", children: userData.displayName || 'Guest User' }), _jsx("p", { className: "text-white/80 text-sm", children: userData.email })] })] }) }), _jsxs("div", { className: "py-2", children: [_jsxs("button", { onClick: () => {
                                                                            setShowUserDropdown(false);
                                                                            navigate('/profile');
                                                                        }, className: "flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors", children: [_jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: "My Profile" }), _jsx("div", { className: "text-sm text-gray-500", children: "Manage your account details" })] })] }), _jsxs("button", { onClick: () => {
                                                                            setShowUserDropdown(false);
                                                                            navigate('/mybookings');
                                                                        }, className: "flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors", children: [_jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: "My Bookings" }), _jsx("div", { className: "text-sm text-gray-500", children: "View your reservations" })] })] }), _jsxs("button", { onClick: () => {
                                                                            setShowUserDropdown(false);
                                                                            navigate('/myrequests');
                                                                        }, className: "flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors", children: [_jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: "My Requests" }), _jsx("div", { className: "text-sm text-gray-500", children: "Track support requests" })] })] }), _jsx("hr", { className: "my-2" }), _jsxs("button", { onClick: () => {
                                                                            setShowUserDropdown(false);
                                                                            logout();
                                                                        }, className: "flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: "Sign Out" }), _jsx("div", { className: "text-sm text-red-500", children: "Log out of your account" })] })] })] })] })), showUserDropdown && (_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowUserDropdown(false) }))] })] })) : (_jsx(Link, { to: "/account", className: `px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${isScrolled || shouldUseSolidHeader
                                            ? 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-md'
                                            : 'bg-heritage-green text-white hover:bg-heritage-green/90'}`, children: "My Account" })) })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/auth", className: `hidden sm:inline-flex px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${isScrolled || shouldUseSolidHeader
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'}`, children: "Sign in" }), _jsx(Link, { to: "/auth?mode=register", className: `px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${isScrolled || shouldUseSolidHeader
                                                ? 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-md'
                                                : 'bg-heritage-green text-white hover:bg-heritage-green/90'}`, children: "Register" })] })), _jsxs("button", { type: "button", className: `lg:hidden p-2 rounded-lg transition-all duration-300 ${isScrolled || shouldUseSolidHeader
                                        ? 'text-gray-700 hover:text-heritage-green hover:bg-heritage-light/20'
                                        : 'text-white hover:text-white/80 hover:bg-white/20'}`, onClick: () => {
                                        setIsMobileMenuOpen(!isMobileMenuOpen);
                                        setShowUserDropdown(false); // Close user dropdown when opening mobile menu
                                    }, "aria-label": "Toggle menu", children: [_jsx("span", { className: "sr-only", children: "Open menu" }), isMobileMenuOpen ? (_jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })) : (_jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }))] })] })] }), isMobileMenuOpen && (_jsx("div", { className: `lg:hidden transition-all duration-500 ease-in-out rounded-b-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 fade-in mb-6 ${shouldMobileMenuBeSolid
                        ? 'bg-gradient-to-b from-white via-white to-gray-50/50 backdrop-blur-xl border-t border-gray-200'
                        : 'bg-slate-900/98 backdrop-blur-xl border-t border-white/10'}`, children: _jsxs("div", { className: "px-4 pt-5 pb-8 space-y-2", children: [navigation.map((link) => (link.type === 'link' ? (_jsx(Link, { to: link.href, onClick: () => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setIsMobileMenuOpen(false);
                                }, className: `block w-full text-left px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${location.pathname === link.href
                                    ? shouldMobileMenuBeSolid
                                        ? 'text-heritage-green bg-gradient-to-r from-heritage-light/40 to-heritage-light/20 shadow-sm'
                                        : 'text-heritage-light bg-white/20 shadow-sm'
                                    : shouldMobileMenuBeSolid
                                        ? 'text-gray-700 hover:text-heritage-green hover:bg-gradient-to-r hover:from-heritage-light/30 hover:to-heritage-light/10'
                                        : 'text-white hover:text-heritage-light hover:bg-white/20'}`, children: link.name }, link.name)) : (_jsx("button", { onClick: () => {
                                    handleScrollTo(link.scrollTo);
                                    setIsMobileMenuOpen(false);
                                }, className: `block w-full text-left px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${shouldMobileMenuBeSolid
                                    ? 'text-gray-700 hover:text-heritage-green hover:bg-gradient-to-r hover:from-heritage-light/30 hover:to-heritage-light/10'
                                    : 'text-white hover:text-heritage-light hover:bg-white/20'}`, children: link.name }, link.name)))), _jsx("div", { className: `pt-5 pb-2 space-y-3 transition-colors duration-300 ${shouldMobileMenuBeSolid ? 'border-t border-gray-200' : 'border-t border-white/20'}`, children: userData ? (_jsx(_Fragment, { children: userData.role === 'guest' ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/booking", className: "block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-all duration-300 shadow-md transform hover:scale-[1.02]", onClick: () => setIsMobileMenuOpen(false), children: "Book Now" }), _jsx("button", { onClick: () => {
                                                    logout();
                                                    setIsMobileMenuOpen(false);
                                                }, className: `block w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${shouldMobileMenuBeSolid
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`, children: "Sign Out" })] })) : (_jsx(Link, { to: "/account", className: "block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-all duration-300 shadow-md transform hover:scale-[1.02]", onClick: () => setIsMobileMenuOpen(false), children: "My Account" })) })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/auth", className: `block w-full text-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${shouldMobileMenuBeSolid
                                                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                                                : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`, onClick: () => setIsMobileMenuOpen(false), children: "Sign in" }), _jsx(Link, { to: "/auth?mode=register", className: "block w-full text-center px-4 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-all duration-300 shadow-md transform hover:scale-[1.02]", onClick: () => setIsMobileMenuOpen(false), children: "Register" })] })) })] }) }))] }) }));
};
