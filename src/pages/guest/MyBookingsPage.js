import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
const getRoomDisplayName = (roomType) => {
    const roomNames = {
        'standard': 'Silid Payapa - Standard Room',
        'deluxe': 'Silid Marahuyo - Deluxe Room',
        'suite': 'Silid Ginhawa - Suite Room',
        'family': 'Silid Haraya - Premium Family Suite'
    };
    return roomNames[roomType] || roomType;
};
export const MyBookingsPage = () => {
    const { userData } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    useEffect(() => {
        if (userData?.email) {
            fetchBookings();
        }
    }, [userData]);
    const fetchBookings = async () => {
        if (!userData?.email)
            return;
        try {
            const bookingsQuery = query(collection(db, 'bookings'), where('userEmail', '==', userData.email));
            const querySnapshot = await getDocs(bookingsQuery);
            const bookingsData = [];
            querySnapshot.forEach((doc) => {
                bookingsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            bookingsData.sort((a, b) => {
                if (a.createdAt && b.createdAt) {
                    return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
                }
                return new Date(b.bookingDate || '').getTime() - new Date(a.bookingDate || '').getTime();
            });
            setBookings(bookingsData);
            setError('');
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Failed to load bookings. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const getFilteredBookings = () => {
        const now = new Date();
        // Set time to start of day for more accurate comparison
        now.setHours(0, 0, 0, 0);
        return bookings.filter(booking => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            checkInDate.setHours(0, 0, 0, 0);
            checkOutDate.setHours(0, 0, 0, 0);
            // Debug logging for upcoming filter
            if (filter === 'upcoming') {
                console.log('Booking:', booking.bookingId, {
                    checkIn: booking.checkIn,
                    checkInDate: checkInDate,
                    now: now,
                    isCheckInFuture: checkInDate >= now,
                    status: booking.status,
                    isNotCancelled: booking.status !== 'cancelled',
                    willShow: checkInDate >= now && booking.status !== 'cancelled'
                });
            }
            // Search filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === '' ||
                (booking.bookingId && booking.bookingId.toLowerCase().includes(searchLower)) ||
                (booking.roomName && booking.roomName.toLowerCase().includes(searchLower)) ||
                (booking.roomType && booking.roomType.toLowerCase().includes(searchLower)) ||
                (booking.status && booking.status.toLowerCase().includes(searchLower));
            if (!matchesSearch)
                return false;
            // Status filter
            switch (filter) {
                case 'upcoming':
                    // Changed from > to >= to include today's bookings
                    return checkInDate >= now && booking.status !== 'cancelled';
                case 'past':
                    return checkOutDate < now || booking.status === 'completed';
                case 'cancelled':
                    return booking.status === 'cancelled';
                default:
                    return true;
            }
        });
    };
    // Pagination
    const filteredBookings = getFilteredBookings();
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredBookings.slice(startIndex, endIndex);
    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter]);
    const getFilterCounts = () => {
        const now = new Date();
        // Set time to start of day for consistent comparison
        now.setHours(0, 0, 0, 0);
        const counts = {
            all: bookings.length,
            upcoming: 0,
            past: 0,
            cancelled: 0
        };
        bookings.forEach(booking => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            checkInDate.setHours(0, 0, 0, 0);
            checkOutDate.setHours(0, 0, 0, 0);
            if (booking.status === 'cancelled') {
                counts.cancelled++;
            }
            else if (checkInDate >= now) { // Changed from > to >= to match filter logic
                counts.upcoming++;
            }
            else if (checkOutDate < now || booking.status === 'completed') {
                counts.past++;
            }
        });
        return counts;
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen py-12 pt-32 bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20", children: _jsx("div", { className: "max-w-6xl px-4 mx-auto sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex flex-col items-center justify-center h-64", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-16 h-16 border-4 rounded-full animate-spin border-heritage-light" }), _jsx("div", { className: "absolute top-0 left-0 w-16 h-16 border-4 rounded-full animate-spin border-heritage-green border-t-transparent" })] }), _jsx("p", { className: "mt-4 font-medium text-heritage-green", children: "Loading your bookings..." })] }) }) }));
    }
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 sm:pt-24", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 blur-3xl animate-pulse" }), _jsx("div", { className: "absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl animate-pulse", style: { animationDelay: '2s' } }), _jsx("div", { className: "absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-2xl animate-pulse", style: { animationDelay: '4s' } })] }), _jsx("div", { className: "relative z-10 py-8 sm:py-12", children: _jsxs("div", { className: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8 sm:mb-12 md:mb-16 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl hover:scale-110", children: _jsx("svg", { className: "w-8 h-8 sm:w-10 sm:h-10 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsx("h1", { className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-transparent bg-gradient-to-r from-slate-900 via-heritage-green to-emerald-600 bg-clip-text px-4", children: "My Reservations" }), _jsxs("p", { className: "max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 px-4", children: ["Manage and track your luxury stays at ", _jsx("span", { className: "font-semibold text-heritage-green", children: "Balay Ginhawa" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 mt-6 sm:mt-8 px-4", children: [_jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Live Sync" })] }), _jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0", style: { animationDelay: '1s' } }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Real-time Updates" })] }), _jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("svg", { className: "w-4 h-4 text-heritage-green flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Secure" })] })] })] }), error && (_jsx("div", { className: "p-3 mb-4 border border-red-200 rounded-lg bg-red-50", children: _jsx("p", { className: "text-sm text-red-600", children: error }) })), _jsx("div", { className: "mb-6 sm:mb-8 overflow-hidden border shadow-xl bg-white/95 backdrop-blur-xl rounded-2xl border-white/50", children: _jsxs("div", { className: "px-4 sm:px-6 py-4 sm:py-5", children: [_jsxs("div", { className: "flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center", children: [_jsx("div", { className: "w-full lg:flex-1 lg:max-w-md", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx("svg", { className: "w-4 h-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Search bookings...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full py-2.5 sm:py-3 pl-10 pr-4 text-sm font-medium transition-all duration-200 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green placeholder-slate-400" }), searchTerm && (_jsx("button", { onClick: () => setSearchTerm(''), className: "absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }) }), _jsx("div", { className: "w-full lg:w-auto", children: _jsx("div", { className: "grid grid-cols-2 lg:flex gap-2 p-2 shadow-inner bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl", children: (() => {
                                                        const counts = getFilterCounts();
                                                        return [
                                                            {
                                                                key: 'all',
                                                                label: 'All',
                                                                count: counts.all,
                                                                activeClass: 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-lg',
                                                                hoverClass: 'hover:bg-gradient-to-r hover:from-heritage-green/80 hover:to-heritage-neutral/80 hover:text-white'
                                                            },
                                                            {
                                                                key: 'upcoming',
                                                                label: 'Upcoming',
                                                                count: counts.upcoming,
                                                                activeClass: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg',
                                                                hoverClass: 'hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 hover:text-white'
                                                            },
                                                            {
                                                                key: 'past',
                                                                label: 'Past',
                                                                count: counts.past,
                                                                activeClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg',
                                                                hoverClass: 'hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-500 hover:text-white'
                                                            },
                                                            {
                                                                key: 'cancelled',
                                                                label: 'Cancelled',
                                                                count: counts.cancelled,
                                                                activeClass: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg',
                                                                hoverClass: 'hover:bg-gradient-to-r hover:from-red-400 hover:to-red-500 hover:text-white'
                                                            }
                                                        ].map((tab) => (_jsxs("button", { onClick: () => setFilter(tab.key), className: `relative px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 ${filter === tab.key
                                                                ? `${tab.activeClass} scale-105 ring-2 ring-white/30`
                                                                : `text-slate-600 bg-white/70 backdrop-blur-sm border border-slate-200/50 ${tab.hoverClass} hover:shadow-md hover:border-transparent`}`, children: [filter === tab.key && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl" })), _jsxs("div", { className: "relative flex items-center space-x-1 sm:space-x-2", children: [_jsx("span", { className: "whitespace-nowrap", children: tab.label }), tab.count > 0 && (_jsx("span", { className: `px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-black ${filter === tab.key
                                                                                ? 'bg-white/25 text-white backdrop-blur-sm'
                                                                                : 'bg-slate-100 text-slate-600 group-hover:bg-white/20 group-hover:text-white'}`, children: tab.count }))] })] }, tab.key)));
                                                    })() }) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 text-xs sm:text-sm text-slate-500", children: [_jsxs("div", { children: ["Showing ", _jsxs("span", { className: "font-semibold text-slate-700", children: [startIndex + 1, "\u2013", Math.min(endIndex, filteredBookings.length)] }), " of ", _jsx("span", { className: "font-semibold text-slate-700", children: filteredBookings.length }), " bookings"] }), searchTerm && (_jsxs("div", { className: "flex items-center space-x-1 text-heritage-green", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsxs("span", { className: "font-medium", children: ["\"", searchTerm, "\""] })] }))] })] }) }), _jsx("div", { className: "overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/50", children: filteredBookings.length === 0 ? (_jsxs("div", { className: "py-16 sm:py-20 md:py-24 text-center px-4", children: [_jsx("div", { className: "flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 shadow-xl bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl", children: _jsx("svg", { className: "w-10 h-10 sm:w-12 sm:h-12 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsx("h3", { className: "mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-slate-900", children: filter === 'upcoming' ? 'No upcoming reservations' :
                                            filter === 'past' ? 'No past reservations' :
                                                filter === 'cancelled' ? 'No cancelled reservations' :
                                                    'No reservations found' }), _jsx("p", { className: "text-base sm:text-lg text-slate-500 px-4", children: filter === 'upcoming' ? 'You don\'t have any upcoming bookings. Book a new stay to see future reservations here.' :
                                            filter === 'past' ? 'You don\'t have any completed or past bookings yet.' :
                                                filter === 'cancelled' ? 'You don\'t have any cancelled bookings.' :
                                                    'Try adjusting your search criteria or create a new booking.' }), _jsx("button", { className: "px-5 sm:px-6 py-2.5 sm:py-3 mt-4 sm:mt-6 text-sm sm:text-base font-semibold text-white transition-all duration-300 transform bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl sm:rounded-2xl hover:shadow-xl hover:scale-105", children: "Book New Stay" })] })) : (_jsxs("div", { className: "p-4 sm:p-6 md:p-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pb-4 mb-6 sm:mb-8 border-b border-slate-200", children: [_jsxs("div", { className: "flex items-center space-x-2 sm:space-x-3", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-heritage-green to-emerald-600 flex-shrink-0", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900", children: "Your Reservations" }), _jsxs("p", { className: "text-xs sm:text-sm text-slate-500", children: [filteredBookings.length, " booking", filteredBookings.length !== 1 ? 's' : '', " found"] })] })] }), _jsxs("div", { className: "text-xs sm:text-sm text-slate-500", children: ["Page ", currentPage, " of ", totalPages] })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2", children: currentItems.map((booking, index) => (_jsxs("div", { className: "relative p-4 sm:p-6 transition-all duration-300 border group bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl border-slate-200/50 hover:shadow-xl hover:-translate-y-1", children: [_jsx("div", { className: `absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${booking.status === 'confirmed' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                                                        booking.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                                            booking.status === 'cancelled' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                                'bg-gradient-to-r from-slate-400 to-slate-500'}` }), _jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 rounded-xl group-hover:scale-110 flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 sm:w-6 sm:h-6 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" }) }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h4", { className: "text-base sm:text-lg font-bold leading-tight text-slate-900 truncate", children: booking.roomName || getRoomDisplayName(booking.roomType) }), _jsxs("p", { className: "font-mono text-xs sm:text-sm text-slate-500 truncate", children: ["ID: ", booking.bookingId || booking.id.slice(-8)] })] })] }), _jsxs("div", { className: "text-right flex-shrink-0", children: [_jsxs("div", { className: "text-lg sm:text-xl md:text-2xl font-black text-heritage-green", children: ["\u20B1", booking.totalAmount.toLocaleString()] }), booking.nights && (_jsxs("div", { className: "text-xs text-slate-500", children: [booking.nights, " night", booking.nights > 1 ? 's' : ''] }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 sm:gap-4 mb-4", children: [_jsx("div", { className: "space-y-3", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1 space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-emerald-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7" }) }), _jsx("span", { className: "text-xs font-semibold tracking-wide uppercase text-slate-600", children: "Check-in" })] }), _jsx("div", { className: "text-sm font-bold text-slate-900", children: new Date(booking.checkIn).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        }) }), _jsx("div", { className: "text-xs text-slate-500", children: new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'long' }) })] }) }), _jsx("div", { className: "space-y-3", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1 space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }), _jsx("span", { className: "text-xs font-semibold tracking-wide uppercase text-slate-600", children: "Check-out" })] }), _jsx("div", { className: "text-sm font-bold text-slate-900", children: new Date(booking.checkOut).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        }) }), _jsx("div", { className: "text-xs text-slate-500", children: new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'long' }) })] }) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-slate-200", children: [_jsxs("div", { className: "flex items-center flex-wrap gap-2 sm:gap-4", children: [_jsxs("div", { className: "flex items-center space-x-1 sm:space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" }) }), _jsxs("span", { className: "text-xs sm:text-sm font-semibold text-slate-600", children: [booking.guests, " guest", booking.guests > 1 ? 's' : ''] })] }), _jsxs("span", { className: `inline-flex items-center px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                                'bg-slate-100 text-slate-700'}`, children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full mr-2 ${booking.status === 'confirmed' ? 'bg-emerald-500' :
                                                                                booking.status === 'pending' ? 'bg-amber-500' :
                                                                                    booking.status === 'cancelled' ? 'bg-red-500' : 'bg-slate-500'}` }), booking.status.charAt(0).toUpperCase() + booking.status.slice(1)] })] }), _jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [_jsxs("button", { onClick: () => setSelectedBooking(booking), className: "flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white transition-all duration-200 transform bg-gradient-to-r from-heritage-green to-emerald-600 rounded-lg sm:rounded-xl hover:shadow-lg active:scale-95 sm:hover:scale-105", children: [_jsxs("svg", { className: "w-4 h-4 mr-1 sm:mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), "View Details"] }), (booking.status === 'Checkout' || ((booking.status === 'completed' || booking.status === 'confirmed' || booking.status === 'Confirmed') && new Date(booking.checkOut) < new Date())) && (_jsxs("button", { onClick: () => window.location.href = `/submit-review/${booking.bookingId}`, className: "flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-heritage-green bg-white border-2 border-heritage-green transition-all duration-200 transform rounded-lg sm:rounded-xl hover:bg-heritage-green hover:text-white hover:shadow-lg active:scale-95 sm:hover:scale-105", children: [_jsx("svg", { className: "w-4 h-4 mr-1 sm:mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }) }), "Write Review"] }))] })] })] }, booking.id))) }), totalPages > 1 && (_jsx("div", { className: "px-4 sm:px-6 py-4 mt-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white", children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: `inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${currentPage === 1
                                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                                        : 'text-gray-700 hover:bg-heritage-green hover:text-white shadow-sm bg-white border border-gray-200'}`, children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex space-x-1 sm:space-x-2", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        }
                                                        else if (currentPage <= 3) {
                                                            pageNum = i + 1;
                                                        }
                                                        else if (currentPage >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        }
                                                        else {
                                                            pageNum = currentPage - 2 + i;
                                                        }
                                                        return (_jsx("button", { onClick: () => setCurrentPage(pageNum), className: `w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 ${currentPage === pageNum
                                                                ? 'bg-heritage-green text-white shadow-md transform scale-105'
                                                                : 'text-gray-700 hover:bg-heritage-green hover:text-white bg-white border border-gray-200 shadow-sm'}`, children: pageNum }, pageNum));
                                                    }) }), _jsxs("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: `inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 ${currentPage === totalPages
                                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                                        : 'text-gray-700 hover:bg-heritage-green hover:text-white shadow-sm bg-white border border-gray-200'}`, children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }))] })) })] }) })] }));
};
