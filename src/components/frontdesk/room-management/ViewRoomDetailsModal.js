import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';
// --- Icons ---
const IconBed = () => _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) });
const IconInfo = () => _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) });
const IconUser = () => _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) });
// --- Helper: Status Badge ---
const getStatusBadge = (status) => {
    const config = {
        available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available', dot: 'bg-green-400' },
        occupied: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Occupied', dot: 'bg-orange-400' },
        maintenance: { bg: 'bg-red-100', text: 'text-red-800', label: 'Maintenance', dot: 'bg-red-400' },
        cleaning: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Cleaning', dot: 'bg-blue-400' },
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status, dot: 'bg-gray-400' };
    return (_jsxs("div", { className: `inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full ${config.dot} animate-pulse` }), _jsx("span", { className: "capitalize", children: config.label })] }));
};
// --- Helper: Info Item ---
const InfoItem = ({ label, value }) => (_jsxs("div", { children: [_jsx("dt", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider", children: label }), _jsx("dd", { className: "mt-1 text-sm font-semibold text-gray-900", children: value || "—" })] }));
export const ViewRoomDetailsModal = ({ isOpen, onClose, room, onEdit }) => {
    const [guestDetails, setGuestDetails] = useState(null);
    const [loadingGuest, setLoadingGuest] = useState(false);
    // Prevent background scroll
    useEffect(() => {
        if (!isOpen)
            return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
    }, [isOpen]);
    // Fetch Occupant Details when modal opens for an occupied room
    useEffect(() => {
        if (isOpen && room && room.status === 'occupied') {
            const fetchOccupancy = async () => {
                setLoadingGuest(true);
                try {
                    // Query the bookings collection for the active reservation
                    const q = query(collection(db, 'bookings'), where('roomNumber', '==', room.roomNumber), where('status', '==', 'checked-in'), limit(1));
                    const snapshot = await getDocs(q);
                    if (!snapshot.empty) {
                        const data = snapshot.docs[0].data();
                        setGuestDetails({
                            name: data.userName || 'Unknown Guest',
                            checkIn: data.checkIn,
                            checkOut: data.checkOut
                        });
                    }
                    else {
                        setGuestDetails(null);
                    }
                }
                catch (error) {
                    console.error("Error fetching guest details:", error);
                    setGuestDetails(null);
                }
                finally {
                    setLoadingGuest(false);
                }
            };
            fetchOccupancy();
        }
        else {
            setGuestDetails(null);
        }
    }, [isOpen, room]);
    // Helper to format date string
    const formatDate = (dateStr) => {
        if (!dateStr)
            return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };
    if (!isOpen || !room)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: onClose }), _jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 flex flex-col", children: [_jsx("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl flex-shrink-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "flex items-center justify-center w-14 h-14 text-white rounded-2xl shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600", children: _jsx("span", { className: "text-xl font-bold", children: room.roomNumber }) }), _jsx("div", { className: "absolute -inset-1 bg-emerald-500 blur opacity-20 rounded-2xl" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: room.roomName || room.roomType }), _jsxs("div", { className: "flex items-center mt-1 space-x-2", children: [room.roomName && (_jsx("span", { className: "text-xs font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100", children: room.roomType })), getStatusBadge(room.status), _jsxs("span", { className: "text-xs text-gray-400 ml-2", children: ["ID: ", room.id] })] })] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), _jsxs("div", { className: "p-6 overflow-y-auto flex-1 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5 shadow-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4 text-emerald-700", children: [_jsx(IconBed, {}), _jsx("h4", { className: "font-semibold", children: "Details" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(InfoItem, { label: "Base Price", value: `₱${room.basePrice.toLocaleString()}` }), _jsx(InfoItem, { label: "Max Guests", value: `${room.maxGuests} Persons` }), _jsx(InfoItem, { label: "Room Size", value: room.roomSize }), _jsx(InfoItem, { label: "Floor", value: room.floor })] })] }), _jsxs("div", { className: "md:col-span-2 p-5 bg-white rounded-2xl ring-1 ring-black/5 shadow-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4 text-emerald-700", children: [_jsx(IconInfo, {}), _jsx("h4", { className: "font-semibold", children: "Amenities & Description" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider mb-2", children: "Amenities" }), _jsx("div", { className: "flex flex-wrap gap-2", children: room.amenities && room.amenities.length > 0 ? (room.amenities.map((amenity, idx) => (_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200", children: amenity }, idx)))) : (_jsx("span", { className: "text-sm text-gray-400 italic", children: "No amenities listed" })) })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider mb-1", children: "Description" }), _jsx("p", { className: "text-sm text-gray-600 leading-relaxed", children: room.description || "No description available." })] })] })] })] }), room.status === 'occupied' && (_jsxs("div", { className: "p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4 text-orange-800", children: [_jsx(IconUser, {}), _jsx("h4", { className: "font-semibold", children: "Current Occupancy" })] }), loadingGuest ? (_jsxs("div", { className: "flex items-center space-x-2 text-sm text-orange-600 py-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Fetching booking details..." })] })) : (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(InfoItem, { label: "Guest Name", value: guestDetails?.name || room.guest || "Unknown" }), _jsx(InfoItem, { label: "Check In", value: formatDate(guestDetails?.checkIn || room.checkIn) }), _jsx(InfoItem, { label: "Check Out", value: formatDate(guestDetails?.checkOut || room.checkOut) })] }))] }))] }), _jsx("div", { className: "p-6 bg-white border-t border-gray-100 flex-shrink-0", children: _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { onClick: onClose, className: "px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 shadow-sm transition", children: "Close" }), onEdit && (_jsx("button", { onClick: () => {
                                        onEdit(room);
                                        onClose();
                                    }, className: "px-5 py-2.5 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl hover:bg-emerald-100 shadow-sm transition", children: "Edit Room" }))] }) })] })] }), document.body);
};
