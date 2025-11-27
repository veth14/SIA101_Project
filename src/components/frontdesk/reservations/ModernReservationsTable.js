import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WalkInModal } from './WalkInModal';
const ModernReservationsTable = ({ reservations, onRowClick, onCheckIn, onCheckOut, onEdit, onCancel, onAddReservation, }) => {
    const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const dropdownRef = useRef(null);
    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Filter & Sort Logic
    const filteredReservations = useMemo(() => {
        if (!reservations || reservations.length === 0) {
            return [];
        }
        const getStatusPriority = (status) => {
            if (status === 'checked-in' || status === 'confirmed') {
                return 1;
            }
            return 2;
        };
        return reservations
            .filter(reservation => {
            const searchLower = (searchTerm || '').toLowerCase().trim();
            const matchesSearch = searchLower === '' ||
                (reservation.userName && reservation.userName.toLowerCase().includes(searchLower)) ||
                (reservation.userEmail && reservation.userEmail.toLowerCase().includes(searchLower)) ||
                (reservation.roomName && reservation.roomName.toLowerCase().includes(searchLower)) ||
                (reservation.roomNumber && reservation.roomNumber.toLowerCase().includes(searchLower)) ||
                (reservation.bookingId && reservation.bookingId.toLowerCase().includes(searchLower));
            const matchesStatus = !selectedStatus ||
                selectedStatus === 'All Status' ||
                (selectedStatus === 'Confirmed' && reservation.status === 'confirmed') ||
                (selectedStatus === 'Checked In' && reservation.status === 'checked-in') ||
                (selectedStatus === 'Checked Out' && reservation.status === 'checked-out') ||
                (selectedStatus === 'Cancelled' && reservation.status === 'cancelled');
            return matchesSearch && matchesStatus;
        })
            .sort((a, b) => {
            const priorityA = getStatusPriority(a.status);
            const priorityB = getStatusPriority(b.status);
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });
    }, [reservations, searchTerm, selectedStatus]);
    // Pagination
    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReservations = filteredReservations.slice(startIndex, endIndex);
    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus]);
    // Helper: Status Badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            confirmed: {
                bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
                text: 'text-amber-800',
                dot: 'bg-amber-400',
                label: 'Confirmed'
            },
            'checked-in': {
                bg: 'bg-gradient-to-r from-emerald-100 to-green-100',
                text: 'text-emerald-800',
                dot: 'bg-emerald-400',
                label: 'Checked In'
            },
            'checked-out': {
                bg: 'bg-gradient-to-r from-blue-100 to-indigo-100',
                text: 'text-blue-800',
                dot: 'bg-blue-400',
                label: 'Checked Out'
            },
            cancelled: {
                bg: 'bg-gradient-to-r from-red-100 to-rose-100',
                text: 'text-red-800',
                dot: 'bg-red-400',
                label: 'Cancelled'
            }
        };
        const config = statusConfig[status] || statusConfig.confirmed;
        return (_jsxs("div", { className: `inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`, children: [_jsx("div", { className: `w-2 h-2 ${config.dot} rounded-full animate-pulse` }), _jsx("span", { children: config.label })] }));
    };
    // Helper: Payment Badge
    const getPaymentBadge = (status) => {
        const paymentConfig = {
            paid: { bg: 'bg-gradient-to-r from-green-100 to-emerald-100', text: 'text-green-800', icon: '✓', label: 'Paid' },
            pending: { bg: 'bg-gradient-to-r from-orange-100 to-amber-100', text: 'text-orange-800', icon: '⏳', label: 'Pending' },
            refunded: { bg: 'bg-gradient-to-r from-gray-100 to-slate-100', text: 'text-gray-800', icon: '↩', label: 'Refunded' }
        };
        const config = paymentConfig[status] || paymentConfig.pending;
        return (_jsxs("div", { className: `inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`, children: [_jsx("span", { children: config.icon }), _jsx("span", { children: config.label })] }));
    };
    // Helper: Action Buttons
    const getActionButtons = (reservation) => (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [reservation.status === 'confirmed' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onCheckIn(reservation);
                }, className: "px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200", children: "Check In" })), reservation.status === 'checked-in' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onCheckOut(reservation);
                }, className: "px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200", children: "Check Out" })), reservation.status !== 'cancelled' && reservation.status !== 'checked-out' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onEdit(reservation);
                }, className: "px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200", children: "Edit" })), reservation.status === 'confirmed' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onCancel(reservation);
                }, className: "px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200", children: "Cancel" })), (reservation.status === 'checked-out' || reservation.status === 'cancelled') && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onRowClick(reservation);
                }, className: "px-3 py-1.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200", children: "View" }))] }));
    return (_jsxs("div", { className: "bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden", children: [_jsx("div", { className: "px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Reservations" }), _jsxs("p", { className: "text-sm text-gray-500 font-medium", children: ["Showing ", startIndex + 1, "-", Math.min(endIndex, filteredReservations.length), " of ", filteredReservations.length, " reservations", searchTerm && _jsxs("span", { className: "ml-2 text-heritage-green", children: ["\u2022 Searching: \"", searchTerm, "\""] }), selectedStatus !== 'All Status' && _jsxs("span", { className: "ml-2 text-blue-600", children: ["\u2022 Status: ", selectedStatus] })] })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "relative flex items-center", children: [_jsx("svg", { className: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-heritage-green z-10", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search guests, rooms, or reservations...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-12 pr-6 py-3 w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300" })] })] }), _jsxs("div", { className: "relative group", ref: dropdownRef, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsDropdownOpen(!isDropdownOpen), className: "flex items-center justify-between px-6 py-3 w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full" }), _jsx("span", { className: "text-gray-800", children: selectedStatus })] }), _jsx("svg", { className: `w-4 h-4 text-heritage-green transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), isDropdownOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-[9999]", onClick: () => setIsDropdownOpen(false) }), _jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[10000]", children: ['All Status', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'].map((status) => (_jsxs("button", { onClick: () => {
                                                                    setSelectedStatus(status);
                                                                    setIsDropdownOpen(false);
                                                                }, className: `w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${selectedStatus === status
                                                                    ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green'
                                                                    : 'text-gray-700 hover:text-heritage-green'}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full transition-all duration-200 ${selectedStatus === status
                                                                            ? 'bg-gradient-to-r from-heritage-green to-emerald-500'
                                                                            : 'bg-gray-300'}` }), _jsx("span", { className: "flex-1", children: status }), selectedStatus === status && (_jsx("svg", { className: "w-4 h-4 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }))] }, status))) })] }))] })] }), _jsxs("button", { onClick: () => setIsWalkInModalOpen(true), className: "inline-flex items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Add Reservation"] })] })] }) }), _jsx(WalkInModal, { isOpen: isWalkInModalOpen, onClose: () => setIsWalkInModalOpen(false), onBooking: (booking) => {
                    if (onAddReservation) {
                        onAddReservation(booking);
                    }
                    setIsWalkInModalOpen(false);
                } }), _jsx("div", { className: "overflow-x-auto h-[580px]", children: _jsxs("table", { className: "w-full table-fixed", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200/50", children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[25%]", children: "Guest" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[15%]", children: "Room" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]", children: "Dates" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]", children: "Payment" }), _jsx("th", { className: "px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]", children: "Amount" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[20%]", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200/50", children: paginatedReservations.map((reservation, index) => (_jsxs("tr", { onClick: () => onRowClick(reservation), className: "group h-20 hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-emerald-50/50 cursor-pointer transition-all duration-200", style: { animationDelay: `${index * 50}ms` }, children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg", children: _jsx("span", { className: "text-white font-bold text-sm", children: reservation.userName.split(' ').map(n => n[0]).join('').toUpperCase() }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900 group-hover:text-heritage-green transition-colors", children: reservation.userName }), _jsx("div", { className: "text-sm text-gray-500", children: reservation.userEmail })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: reservation.roomName }), reservation.roomNumber && (_jsxs("div", { className: "text-sm text-gray-500", children: ["Room ", reservation.roomNumber] })), _jsxs("div", { className: "flex items-center mt-1 text-xs text-gray-400", children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" }) }), reservation.guests, " guests"] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-semibold text-gray-900", children: (() => {
                                                        try {
                                                            if (!reservation.checkIn || !reservation.checkOut)
                                                                return 'Invalid Date';
                                                            const checkInDate = new Date(reservation.checkIn);
                                                            const checkOutDate = new Date(reservation.checkOut);
                                                            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
                                                                return 'Invalid Date';
                                                            }
                                                            const formatDate = (date) => {
                                                                const month = date.toLocaleDateString('en-US', { month: 'short' });
                                                                const day = date.getDate().toString().padStart(2, '0');
                                                                return `${month} ${day}`;
                                                            };
                                                            return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;
                                                        }
                                                        catch (error) {
                                                            return 'Invalid Date';
                                                        }
                                                    })() }), _jsxs("div", { className: "text-xs text-gray-500", children: [reservation.nights, " night", reservation.nights !== 1 ? 's' : ''] })] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: getStatusBadge(reservation.status) }), _jsx("td", { className: "px-6 py-4 text-center", children: getPaymentBadge(reservation.paymentDetails.paymentStatus) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "font-bold text-gray-900 text-lg", children: ["\u20B1", reservation.totalAmount.toLocaleString()] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: getActionButtons(reservation) })] }, reservation.bookingId))) })] }) }), totalPages > 1 && (_jsx("div", { className: "flex items-center justify-center space-x-2 pt-6 pb-6 border-t border-gray-100", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`, children: "Previous" }), Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1)
                            .map((page, i, arr) => {
                            const isGap = i > 0 && page - arr[i - 1] > 1;
                            return (_jsxs(React.Fragment, { children: [isGap && _jsx("span", { className: "text-gray-400", children: "..." }), _jsx("button", { onClick: () => setCurrentPage(page), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${currentPage === page
                                            ? 'bg-heritage-green text-white'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`, children: page })] }, page));
                        }), _jsx("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-heritage-green hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105'}`, children: "Next" })] }) })), reservations.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsx("p", { className: "text-gray-500", children: "Reservations will appear here when available" })] }))] }));
};
export default ModernReservationsTable;
