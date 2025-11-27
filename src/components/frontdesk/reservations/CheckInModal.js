import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
// --- IMPORTED CONTEXT & TYPES ---
import { useRooms } from './ReservationsContext';
// --- IMPORTED SHARED UTILS ---
import { normalizeTypeKey, checkDateOverlap } from './reservations.utils';
// --- HELPER ---
const formatDate = (dateString) => {
    if (!dateString)
        return "---";
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
// --- MAIN COMPONENT ---
export const CheckInModal = ({ isOpen, onClose, reservation, onCheckIn }) => {
    const [selectedRoom, setSelectedRoom] = useState('');
    const [paymentReceived, setPaymentReceived] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [notes, setNotes] = useState('');
    const [guestIdVerified, setGuestIdVerified] = useState(false);
    const [keyCardsIssued, setKeyCardsIssued] = useState(false);
    // Get rooms from context
    const { rooms: allRooms, loading: roomsLoading } = useRooms();
    // Local state for the filtered *available* rooms list
    const [filteredRooms, setFilteredRooms] = useState([]);
    // State for our single availability query
    const [overlappingBookings, setOverlappingBookings] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [errors, setErrors] = useState({});
    // Prevent background scroll
    useEffect(() => {
        if (!isOpen)
            return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);
    // Prefill data
    useEffect(() => {
        if (!isOpen || !reservation)
            return;
        setSelectedRoom(reservation.roomNumber || '');
        setPaymentReceived(reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0);
        setPaymentMethod(reservation.paymentDetails.paymentMethod || 'cash');
        // Reset checklist
        setGuestIdVerified(false);
        setKeyCardsIssued(false);
        setNotes('');
        setErrors({});
    }, [isOpen, reservation]);
    // --- handleCheckIn ---
    const handleCheckIn = () => {
        const newErrors = {};
        if (!selectedRoom) {
            newErrors.room = 'Please select a room to assign';
        }
        if (!guestIdVerified) {
            newErrors.checklist = 'Please verify guest ID before completing check-in';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0 || !reservation) {
            return;
        }
        const now = new Date();
        const newPaymentStatus = paymentReceived >= reservation.totalAmount ? 'paid' : 'pending';
        const updatedReservation = {
            ...reservation,
            roomNumber: selectedRoom,
            status: 'checked-in',
            updatedAt: Timestamp.fromDate(now),
            paymentDetails: {
                ...reservation.paymentDetails,
                paymentMethod: paymentMethod,
                paymentStatus: newPaymentStatus,
                paidAt: newPaymentStatus === 'paid'
                    ? (reservation.paymentDetails.paidAt || Timestamp.fromDate(now))
                    : null,
            },
        };
        onCheckIn(updatedReservation);
    };
    const remainingBalance = reservation ? Math.max(0, reservation.totalAmount - paymentReceived) : 0;
    // --- Availability Query (Step 1) ---
    useEffect(() => {
        if (!isOpen || !reservation?.checkIn || !reservation?.checkOut) {
            setOverlappingBookings([]);
            return;
        }
        let mounted = true;
        const fetchOverlappingBookings = async () => {
            setIsCheckingAvailability(true);
            setOverlappingBookings([]);
            try {
                const { checkIn, checkOut, bookingId } = reservation;
                const q = query(collection(db, 'bookings'), where('status', 'in', ['confirmed', 'checked-in']), where('checkIn', '<', checkOut), where('checkOut', '>', checkIn));
                const snap = await getDocs(q);
                if (!mounted)
                    return;
                const bookings = snap.docs
                    .map(doc => ({ ...doc.data(), bookingId: doc.id }))
                    // Exclude the reservation we are *currently* checking in
                    .filter(b => b.bookingId !== bookingId);
                setOverlappingBookings(bookings);
            }
            catch (err) {
                console.error("Error fetching overlapping bookings:", err);
                if (mounted)
                    setOverlappingBookings([]);
            }
            finally {
                if (mounted)
                    setIsCheckingAvailability(false);
            }
        };
        fetchOverlappingBookings();
        return () => { mounted = false; };
    }, [isOpen, reservation]);
    // --- Filter Rooms In-Memory (Step 2) ---
    useEffect(() => {
        if (!reservation) {
            setFilteredRooms([]);
            return;
        }
        // USED UTILITY
        const reservationTypeKey = normalizeTypeKey(reservation.roomType);
        const candidateRooms = allRooms.filter(r => normalizeTypeKey(r.roomType) === reservationTypeKey);
        const occupiedRoomNumbers = new Set();
        for (const b of overlappingBookings) {
            if (!b.roomNumber)
                continue;
            // USED UTILITY
            const isOverlapping = checkDateOverlap(reservation.checkIn, reservation.checkOut, b.checkIn, b.checkOut);
            if (isOverlapping) {
                occupiedRoomNumbers.add(b.roomNumber);
            }
        }
        const availableRooms = candidateRooms.filter(room => {
            if (room.id === reservation.roomNumber)
                return true;
            if (room.status !== 'available' || room.isActive === false)
                return false;
            if (occupiedRoomNumbers.has(room.id))
                return false;
            return true;
        });
        setFilteredRooms(availableRooms.map(r => ({
            number: r.id,
            type: r.roomType,
            status: r.status
        })));
    }, [allRooms, overlappingBookings, reservation]);
    // Auto-select room
    useEffect(() => {
        if (!isOpen || !reservation)
            return;
        if ((!selectedRoom || selectedRoom === '') && !reservation.roomNumber && filteredRooms.length > 0) {
            setSelectedRoom(filteredRooms[0].number);
        }
    }, [filteredRooms, isOpen, selectedRoom, reservation]);
    if (!isOpen || !reservation)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: onClose, "aria-label": "Close overlay" }), _jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5", children: [_jsxs("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsx(IconKey, {}) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold md:text-2xl text-emerald-700", children: "Guest Check-In" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: reservation.bookingId })] })] }) }), _jsx("button", { onClick: onClose, "aria-label": "Close", className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-160px)]", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-4", children: [_jsx(IconKey, {}), _jsxs("span", { className: "ml-2", children: ["1. Assign Room (", reservation.roomName, ")"] })] }), _jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Available Rooms", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { title: "Room Assignment", "aria-label": "Room Assignment", value: selectedRoom, onChange: (e) => {
                                                        setSelectedRoom(e.target.value);
                                                        setErrors(prev => ({ ...prev, room: '' }));
                                                    }, className: `w-full px-3 py-2 border rounded-md ${errors.room ? 'border-red-300' : 'border-gray-300'}`, disabled: roomsLoading || isCheckingAvailability, children: [_jsx("option", { value: "", children: roomsLoading ? 'Loading rooms...' :
                                                                isCheckingAvailability ? 'Checking availability...' :
                                                                    (filteredRooms.length > 0 ? 'Select a room' : 'No rooms available') }), filteredRooms.map((room) => (_jsxs("option", { value: room.number, children: ["Room ", room.number] }, room.number)))] }), errors.room && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.room })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-4", children: [_jsx(IconCreditCard, {}), _jsx("span", { className: "ml-2", children: "2. Collect Payment" })] }), _jsxs("div", { className: "flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Total Amount" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: ["\u20B1", reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 text-right", children: "Payment Status" }), _jsx("span", { className: `px-3 py-1 text-sm font-medium rounded-full ${reservation.paymentDetails.paymentStatus === 'paid'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-yellow-100 text-yellow-800'}`, children: reservation.paymentDetails.paymentStatus.charAt(0).toUpperCase() + reservation.paymentDetails.paymentStatus.slice(1) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Payment Received Now" }), _jsx("input", { type: "number", value: paymentReceived, onChange: (e) => setPaymentReceived(Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-md", placeholder: "0.00" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Payment Method" }), _jsxs("select", { title: "Payment Method", "aria-label": "Payment Method", value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md", children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "card", children: "Credit/Debit Card" }), _jsx("option", { value: "gcash", children: "GCash" })] })] })] }), remainingBalance > 0 && (_jsx("div", { className: "mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl", children: _jsxs("p", { className: "text-sm font-semibold text-yellow-800", children: ["Remaining Balance: \u20B1", remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] }) }))] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-4", children: [_jsx(IconClipboardCheck, {}), _jsx("span", { className: "ml-2", children: "3. Final Checklist" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: guestIdVerified, onChange: (e) => {
                                                                        setGuestIdVerified(e.target.checked);
                                                                        setErrors(prev => ({ ...prev, checklist: '' }));
                                                                    }, className: "h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" }), _jsx("span", { className: "ml-3 text-sm font-medium text-gray-700", children: "Guest ID Verified" }), _jsx("span", { className: "ml-1 text-red-500", children: "*" })] }), errors.checklist && _jsx("p", { className: "text-red-500 text-xs -mt-2 ml-3", children: errors.checklist }), _jsxs("label", { className: "flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: keyCardsIssued, onChange: (e) => setKeyCardsIssued(e.target.checked), className: "h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" }), _jsx("span", { className: "ml-3 text-sm font-medium text-gray-700", children: "Key Cards Issued" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md resize-none", placeholder: "e.g., Guest requested extra towels..." })] })] })] })] }), _jsxs("div", { className: "lg:col-span-1 lg:sticky lg:top-6 space-y-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-3", children: [_jsx(IconUser, {}), _jsx("span", { className: "ml-2", children: "Guest" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500", children: "Name" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: reservation.userName })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500", children: "Email" }), _jsx("p", { className: "text-sm text-gray-900", children: reservation.userEmail })] })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-3", children: [_jsx(IconCalendar, {}), _jsx("span", { className: "ml-2", children: "Booking" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500", children: "Guests" }), _jsxs("p", { className: "text-sm font-semibold text-gray-900", children: [reservation.guests, " guest", reservation.guests > 1 ? 's' : ''] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Check-in" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: formatDate(reservation.checkIn) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500", children: "Check-out" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: formatDate(reservation.checkOut) })] })] })] })] })] }) }), _jsx("div", { className: "p-6 bg-white border-t border-gray-100", children: _jsxs("div", { className: "flex flex-col justify-end gap-3 sm:flex-row sm:items-center", children: [_jsx("button", { onClick: onClose, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white/80 rounded-2xl shadow-sm hover:bg-gray-50 transition transform", title: "Cancel check-in", children: "Cancel" }), _jsxs("button", { onClick: handleCheckIn, disabled: !selectedRoom || !guestIdVerified, className: "inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5 disabled:opacity-50 disabled:cursor-not-allowed", title: "Complete this check-in", children: [_jsx(IconCheck, {}), "Complete Check-In"] })] }) })] })] }), document.body);
};
// --- Icon Components ---
const IconKey = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a3 3 0 11-6 0 3 3 0 016 0zM5.93 16.5A7 7 0 0012 21a7 7 0 006.07-4.5M12 3v7m-3 4h6" }) }));
const IconCreditCard = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }));
const IconClipboardCheck = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15z" }) }));
const IconUser = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }));
const IconCalendar = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }));
const IconCheck = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }));
