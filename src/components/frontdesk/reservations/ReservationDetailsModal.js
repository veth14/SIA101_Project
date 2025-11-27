import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Timestamp } from 'firebase/firestore';
// --- Icon Components ---
const IconUser = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }));
const IconEnvelope = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }));
const IconUsers = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6m6 3v-1a6 6 0 00-6-6h-1.5m-1.5-9a4 4 0 00-4-4h-1a4 4 0 100 8h1" }) }));
const IconBed = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7v4a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h2a1 1 0 011 1zm8 0v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V7a1 1 0 011-1h2a1 1 0 011 1zM3 15h18v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4z" }) }));
const IconHashtag = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 20l4-16m2 16l4-16M5 9h14M5 15h14" }) }));
const IconCreditCard = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }));
const IconDollar = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.657 0-3-.895-3-2s1.343-2 3-2 3-.895 3-2-1.343-2-3-2m-3.5 7.039a5.002 5.002 0 01-2.599-1M15.5 11.039a5.002 5.002 0 012.599-1" }) }));
const IconCalendar = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }));
const IconInfo = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
const IconClock = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
const InfoItem = ({ icon, label, children }) => (_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 w-6 h-6 text-gray-400 pt-1", children: icon }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: label }), _jsx("div", { className: "text-sm text-gray-900 mt-1", children: children })] })] }));
// --- Badge Functions ---
const getStatusBadge = (status) => {
    const statusConfig = {
        confirmed: { bg: 'bg-gradient-to-r from-amber-100 to-yellow-100', text: 'text-amber-800', dot: 'bg-amber-400', label: 'Confirmed' },
        'checked-in': { bg: 'bg-gradient-to-r from-emerald-100 to-green-100', text: 'text-emerald-800', dot: 'bg-emerald-400', label: 'Checked In' },
        'checked-out': { bg: 'bg-gradient-to-r from-blue-100 to-indigo-100', text: 'text-blue-800', dot: 'bg-blue-400', label: 'Checked Out' },
        cancelled: { bg: 'bg-gradient-to-r from-red-100 to-rose-100', text: 'text-red-800', dot: 'bg-red-400', label: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.confirmed;
    return (_jsxs("div", { className: `inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`, children: [_jsx("div", { className: `w-2 h-2 ${config.dot} rounded-full animate-pulse` }), _jsx("span", { children: config.label })] }));
};
const getPaymentBadge = (status) => {
    const paymentConfig = {
        paid: { bg: 'bg-gradient-to-r from-green-100 to-emerald-100', text: 'text-green-800', icon: '✓', label: 'Paid' },
        pending: { bg: 'bg-gradient-to-r from-orange-100 to-amber-100', text: 'text-orange-800', icon: '⏳', label: 'Pending' },
        refunded: { bg: 'bg-gradient-to-r from-gray-100 to-slate-100', text: 'text-gray-800', icon: '↩', label: 'Refunded' }
    };
    const config = paymentConfig[status] || paymentConfig.pending;
    return (_jsxs("div", { className: `inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`, children: [_jsx("span", { children: config.icon }), _jsx("span", { children: config.label })] }));
};
// --- Helper Functions ---
const formatDate = (dateString, options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) => {
    if (!dateString)
        return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', options);
};
const formatDateTime = (dateInput) => {
    if (!dateInput)
        return "N/A";
    let date;
    if (dateInput instanceof Timestamp)
        date = dateInput.toDate();
    else if (dateInput instanceof Date)
        date = dateInput;
    else
        date = new Date(dateInput);
    if (isNaN(date.getTime()))
        return "Invalid Date";
    return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
// --- Main Component ---
export const ReservationDetailsModal = ({ isOpen, onClose, reservation, onEdit, onCheckIn, onCheckOut, onCancel }) => {
    useEffect(() => {
        if (!isOpen)
            return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);
    if (!isOpen || !reservation)
        return null;
    // --- Handlers (Delegators) ---
    const handleCheckInClick = () => {
        if (onCheckIn) {
            onCheckIn(reservation);
            onClose();
        }
    };
    const handleEditClick = () => {
        if (onEdit) {
            onEdit(reservation);
            onClose();
        }
    };
    const handleCheckOutClick = () => {
        if (onCheckOut) {
            onCheckOut(reservation);
            onClose();
        }
    };
    const handleCancelClick = () => {
        if (onCancel) {
            onCancel(reservation);
            onClose();
        }
    };
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: onClose, "aria-label": "Close overlay" }), _jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5", children: [_jsx("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsx(IconInfo, {}) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold md:text-2xl text-emerald-700", children: reservation.userName }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Reservation Details" })] })] }), _jsx("button", { onClick: onClose, "aria-label": "Close", className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), _jsxs("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-6", children: [_jsxs("div", { className: "p-4 rounded-xl bg-gray-50 border border-gray-200", children: [_jsx("p", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Booking Status & Reference" }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("p", { className: "text-sm font-medium text-gray-600", children: ["ID: ", reservation.bookingId] }), _jsxs("div", { className: "flex space-x-2 mt-2 sm:mt-0", children: [getStatusBadge(reservation.status), getPaymentBadge(reservation.paymentDetails.paymentStatus)] })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Stay Dates" }), _jsxs("div", { className: "flex items-center justify-between text-center", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Check-in" }), _jsx("p", { className: "text-base font-semibold text-gray-900 mt-1", children: formatDate(reservation.checkIn, { month: 'short', day: 'numeric', year: 'numeric' }) }), _jsx("p", { className: "text-sm text-gray-500", children: formatDate(reservation.checkIn, { weekday: 'short' }) })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("span", { className: "text-sm font-bold text-emerald-600", children: [reservation.nights, " night", reservation.nights > 1 ? 's' : ''] }), _jsxs("svg", { className: "w-12 h-4 text-gray-300", viewBox: "0 0 100 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M0 10 H100", stroke: "currentColor", strokeWidth: "2", strokeDasharray: "4 4" }), _jsx("path", { d: "M90 5 L100 10 L90 15", stroke: "currentColor", strokeWidth: "2", fill: "none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Check-out" }), _jsx("p", { className: "text-base font-semibold text-gray-900 mt-1", children: formatDate(reservation.checkOut, { month: 'short', day: 'numeric', year: 'numeric' }) }), _jsx("p", { className: "text-sm text-gray-500", children: formatDate(reservation.checkOut, { weekday: 'short' }) })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Guest Information" }), _jsxs("div", { className: "space-y-4", children: [_jsx(InfoItem, { icon: _jsx(IconUser, {}), label: "Full Name", children: reservation.userName }), _jsx(InfoItem, { icon: _jsx(IconEnvelope, {}), label: "Email Address", children: reservation.userEmail }), _jsxs(InfoItem, { icon: _jsx(IconUsers, {}), label: "Number of Guests", children: [reservation.guests, " guest", reservation.guests > 1 ? 's' : ''] })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Booking & Payment" }), _jsxs("div", { className: "space-y-4", children: [_jsx(InfoItem, { icon: _jsx(IconBed, {}), label: "Room Type", children: reservation.roomName }), _jsx(InfoItem, { icon: _jsx(IconHashtag, {}), label: "Room Number", children: reservation.roomNumber ? `Room ${reservation.roomNumber}` : 'Not assigned' }), _jsx(InfoItem, { icon: _jsx(IconDollar, {}), label: "Total Amount", children: _jsxs("span", { className: "text-lg font-bold text-gray-900", children: ["\u20B1", reservation.totalAmount.toLocaleString()] }) }), _jsx(InfoItem, { icon: _jsx(IconCreditCard, {}), label: "Payment Method", children: _jsx("span", { className: "capitalize", children: reservation.paymentDetails.paymentMethod.replace('-', ' ') }) })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Booking Timeline" }), _jsxs("div", { className: "space-y-4", children: [_jsx(InfoItem, { icon: _jsx(IconCalendar, {}), label: "Booking Created", children: formatDateTime(reservation.createdAt) }), _jsx(InfoItem, { icon: _jsx(IconClock, {}), label: "Last Updated", children: formatDateTime(reservation.updatedAt) }), _jsx(InfoItem, { icon: _jsx(IconInfo, {}), label: "Current Status", children: _jsx("span", { className: "capitalize", children: reservation.status.replace('-', ' ') }) })] })] })] })] }), _jsx("div", { className: "p-6 bg-white border-t border-gray-100", children: _jsx("div", { className: "flex flex-col-reverse justify-start gap-3 sm:flex-row sm:items-center", children: _jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2", children: [onEdit && ['confirmed', 'checked-in'].includes(reservation.status) && (_jsxs("button", { onClick: handleEditClick, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 7.232z" }) }), "Edit Booking"] })), reservation.status === 'confirmed' && onCheckIn && (_jsxs("button", { onClick: handleCheckInClick, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-2xl shadow-sm hover:bg-green-700 transition transform hover:-translate-y-0.5", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" }) }), "Check In"] })), reservation.status === 'checked-in' && onCheckOut && (_jsxs("button", { onClick: handleCheckOutClick, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-2xl shadow-sm hover:bg-blue-700 transition transform hover:-translate-y-0.5", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H3m5 4v1a3 3 0 003 3h6a3 3 0 003-3V7a3 3 0 00-3-3h-6a3 3 0 00-3 3v1" }) }), "Check Out"] })), reservation.status === 'confirmed' && onCancel && (_jsxs("button", { onClick: handleCancelClick, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-300 rounded-2xl shadow-sm hover:bg-red-100 transition transform hover:-translate-y-0.5", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Cancel Booking"] }))] }) }) })] })] }), document.body);
};
