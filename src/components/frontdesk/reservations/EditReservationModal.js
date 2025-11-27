import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, doc, Timestamp, writeBatch } from 'firebase/firestore';
import { useRooms } from './ReservationsContext';
// --- IMPORTED SHARED UTILS ---
import { ROOM_TYPES_CONFIG, normalizeTypeKey, checkDateOverlap } from './reservations.utils';
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
export const EditReservationModal = ({ isOpen, onClose, reservation, onSave }) => {
    const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        roomType: '',
        roomNumber: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        paymentMethod: 'cash',
        paymentReceived: 0,
        gcashName: '',
        gcashNumber: '',
        cardholderName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
    });
    const [errors, setErrors] = useState({});
    // Get rooms from context
    const { rooms: allRooms, loading: roomsLoading } = useRooms();
    // State for *available* rooms
    const [filteredRooms, setFilteredRooms] = useState([]);
    // State for our single availability query
    const [overlappingBookings, setOverlappingBookings] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    // Prevent background scroll while modal is open
    useEffect(() => {
        if (!isOpen)
            return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);
    // Populate form data from reservation
    useEffect(() => {
        if (reservation) {
            setFormData({
                guestName: reservation.userName,
                email: reservation.userEmail,
                // USED UTILITY
                roomType: normalizeTypeKey(reservation.roomType),
                roomNumber: reservation.roomNumber || '',
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                guests: reservation.guests,
                paymentMethod: reservation.paymentDetails.paymentMethod || 'cash',
                paymentReceived: 0, // Set by the effect below
                gcashName: reservation.paymentDetails.gcashName || '',
                gcashNumber: reservation.paymentDetails.gcashNumber || '',
                cardholderName: reservation.paymentDetails.cardholderName || '',
                cardNumber: '',
                cardExpiry: '',
                cardCvv: '',
            });
            // Clear errors when a new reservation is loaded
            setErrors({});
        }
    }, [reservation]);
    // Calculate balance due
    useEffect(() => {
        if (!isOpen || !reservation)
            return;
        const newPricing = calculatePricing(); // Uses formData, so must be after state is set
        const newTotalAmount = newPricing.totalAmount;
        const previouslyPaidAmount = reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0;
        let balanceDue = newTotalAmount - previouslyPaidAmount;
        if (balanceDue < 0)
            balanceDue = 0;
        setFormData(prev => ({
            ...prev,
            paymentReceived: Math.round(balanceDue * 100) / 100
        }));
    }, [formData.checkIn, formData.checkOut, formData.guests, formData.roomType, isOpen, reservation]);
    // validateForm
    const validateForm = () => {
        const newErrors = {};
        if (!formData.guestName.trim())
            newErrors.guestName = 'Guest name is required';
        if (!formData.email.trim())
            newErrors.email = 'Email is required';
        if (!formData.roomType)
            newErrors.roomType = 'Room type is required';
        if (!formData.checkIn)
            newErrors.checkIn = 'Check-in date is required';
        if (!formData.checkOut)
            newErrors.checkOut = 'Check-out date is required';
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Only check past date if it's not already checked-in
        if (reservation && reservation.status !== 'checked-in' && checkIn < today) {
            newErrors.checkIn = 'Check-in date cannot be in the past';
        }
        if (checkOut <= checkIn) {
            newErrors.checkOut = 'Check-out must be after check-in date';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        // USED UTILITY
        const selectedRoomType = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType);
        if (selectedRoomType && formData.guests > selectedRoomType.maxGuests) {
            newErrors.guests = `Max ${selectedRoomType.maxGuests} guests for this room`;
        }
        if (formData.paymentMethod === 'gcash') {
            if (!formData.gcashName.trim())
                newErrors.gcashName = 'GCash name is required';
            if (!formData.gcashNumber.trim())
                newErrors.gcashNumber = 'GCash number is required';
            else if (formData.gcashNumber.replace(/\D/g, '').length < 11)
                newErrors.gcashNumber = 'Must be a valid 11-digit number';
        }
        if (formData.paymentMethod === 'card') {
            if (!formData.cardholderName.trim())
                newErrors.cardholderName = 'Cardholder name is required';
            if (!formData.cardNumber.trim())
                newErrors.cardNumber = 'Card number is required';
            else if (formData.cardNumber.replace(/\D/g, '').length < 15)
                newErrors.cardNumber = 'Must be a valid card number';
            if (!formData.cardExpiry.trim())
                newErrors.cardExpiry = 'Expiry date is required';
            else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry))
                newErrors.cardExpiry = 'Must be MM/YY format';
            if (!formData.cardCvv.trim())
                newErrors.cardCvv = 'CVV is required';
            else if (formData.cardCvv.replace(/\D/g, '').length < 3)
                newErrors.cardCvv = 'Must be 3-4 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // calculatePricing
    const calculatePricing = () => {
        // USED UTILITY
        const rt = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType);
        if (!rt || !formData.checkOut || !formData.checkIn) {
            return {
                nights: 0, basePrice: 0, roomPricePerNight: 0,
                additionalGuestPrice: 0, baseGuests: 0,
                subtotal: 0, tax: 0, taxRate: 0.12, totalAmount: 0,
            };
        }
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
        const basePrice = rt.price;
        const additionalGuestPrice = rt.additionalGuestPrice;
        const baseGuests = rt.baseGuests;
        const extraGuests = Math.max(0, formData.guests - baseGuests);
        const roomPricePerNight = basePrice + (extraGuests * additionalGuestPrice);
        const subtotal = roomPricePerNight * nights;
        const taxRate = 0.12;
        const tax = subtotal * taxRate;
        const totalAmount = subtotal + tax;
        return {
            nights,
            basePrice: Math.round(basePrice * 100) / 100,
            roomPricePerNight: Math.round(roomPricePerNight * 100) / 100,
            additionalGuestPrice,
            baseGuests,
            subtotal: Math.round(subtotal * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            taxRate,
            totalAmount: Math.round(totalAmount * 100) / 100,
        };
    };
    // Check for conflicting bookings
    useEffect(() => {
        if (!isOpen || !reservation || !formData.checkIn || !formData.checkOut) {
            setOverlappingBookings([]);
            return;
        }
        // Validate dates before querying
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
            setOverlappingBookings([]);
            return;
        }
        let mounted = true;
        const fetchOverlappingBookings = async () => {
            setIsCheckingAvailability(true);
            setOverlappingBookings([]);
            try {
                const q = query(collection(db, 'bookings'), where('status', 'in', ['confirmed', 'checked-in']), where('checkIn', '<', formData.checkOut), where('checkOut', '>', formData.checkIn));
                const snap = await getDocs(q);
                if (!mounted)
                    return;
                // Filter out the *current* reservation we are editing
                const bookings = snap.docs
                    .map(doc => ({ ...doc.data(), bookingId: doc.id }))
                    .filter(b => b.bookingId !== reservation.bookingId);
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
    }, [isOpen, reservation, formData.checkIn, formData.checkOut]);
    // Memoized Set of occupied rooms
    const occupiedRoomNumbers = useMemo(() => {
        const occupied = new Set();
        for (const b of overlappingBookings) {
            if (!b.roomNumber)
                continue;
            // USED UTILITY
            const isOverlapping = checkDateOverlap(formData.checkIn, formData.checkOut, b.checkIn, b.checkOut);
            if (isOverlapping) {
                occupied.add(b.roomNumber);
            }
        }
        return occupied;
    }, [overlappingBookings, formData.checkIn, formData.checkOut]);
    // Filter rooms in-memory
    useEffect(() => {
        if (!formData.roomType || !reservation) {
            setFilteredRooms([]);
            return;
        }
        const reservationTypeKey = formData.roomType;
        // USED UTILITY
        const candidateRooms = allRooms.filter(r => normalizeTypeKey(r.roomType) === reservationTypeKey);
        const availableRooms = candidateRooms.filter(room => {
            // *Always* include the room currently assigned to this reservation
            if (room.id === reservation.roomNumber) {
                return true;
            }
            if (room.status !== 'available' || room.isActive === false) {
                return false;
            }
            if (!formData.checkIn || !formData.checkOut || new Date(formData.checkOut) <= new Date(formData.checkIn)) {
                return true;
            }
            if (occupiedRoomNumbers.has(room.id)) {
                return false;
            }
            return true;
        });
        setFilteredRooms(availableRooms);
    }, [formData.roomType, allRooms, occupiedRoomNumbers, reservation, formData.checkIn, formData.checkOut]);
    const handleSave = async () => {
        if (!validateForm() || !reservation)
            return;
        // 1. Check room availability (IN-MEMORY)
        const newRoom = formData.roomNumber || null;
        const prevRoom = reservation.roomNumber || null;
        // Only check if the room *changed* to a new room
        if (newRoom && newRoom !== prevRoom) {
            const selectedRoomData = allRooms.find(r => r.id === newRoom);
            if (!selectedRoomData || selectedRoomData.status !== 'available' || selectedRoomData.isActive === false) {
                setErrors(prev => ({ ...prev, roomNumber: 'Selected room is currently marked unavailable' }));
                return;
            }
            if (occupiedRoomNumbers.has(newRoom)) {
                setErrors(prev => ({ ...prev, roomNumber: 'Selected room is not available for those dates' }));
                return;
            }
        }
        // 2. Get new pricing
        const newPricing = calculatePricing();
        const newTotalAmount = newPricing.totalAmount;
        // 3. Get new room name (USED UTILITY)
        const roomTypeData = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType);
        const newRoomName = roomTypeData ? roomTypeData.name : 'Unknown Room';
        // 4. Determine new payment status
        const previouslyPaidAmount = reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0;
        const amountPaidNow = Number(formData.paymentReceived) || 0;
        const totalPaid = previouslyPaidAmount + amountPaidNow;
        const newPaymentStatus = totalPaid >= newTotalAmount ? 'paid' : 'pending';
        let newPaidAt = reservation.paymentDetails.paidAt;
        if (newPaymentStatus === 'paid' && reservation.paymentDetails.paymentStatus === 'pending') {
            newPaidAt = Timestamp.now();
        }
        if (newPaymentStatus === 'pending') {
            newPaidAt = null;
        }
        // 5. Build final object
        const updatedReservation = {
            ...reservation,
            userName: formData.guestName,
            userEmail: formData.email,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            guests: formData.guests,
            roomType: formData.roomType,
            roomName: newRoomName,
            roomNumber: newRoom,
            ...newPricing,
            paymentDetails: {
                ...reservation.paymentDetails,
                cardLast4: formData.paymentMethod === 'card' ? formData.cardNumber.slice(-4) : (formData.paymentMethod === 'gcash' ? null : reservation.paymentDetails.cardLast4),
                cardholderName: formData.paymentMethod === 'card' ? formData.cardholderName : (formData.paymentMethod === 'gcash' ? null : reservation.paymentDetails.cardholderName),
                gcashName: formData.paymentMethod === 'gcash' ? formData.gcashName : (formData.paymentMethod === 'card' ? null : reservation.paymentDetails.gcashName),
                gcashNumber: formData.paymentMethod === 'gcash' ? formData.gcashNumber : (formData.paymentMethod === 'card' ? null : reservation.paymentDetails.gcashNumber),
                paymentMethod: formData.paymentMethod,
                paymentStatus: newPaymentStatus,
                paidAt: newPaidAt,
            },
        };
        // 6. Update room documents (Atomic Batch)
        try {
            if (newRoom !== prevRoom) {
                const batch = writeBatch(db);
                if (newRoom) {
                    const newRoomRef = doc(db, 'rooms', newRoom);
                    batch.set(newRoomRef, {
                        status: 'occupied', isActive: false, currentReservation: reservation.bookingId,
                    }, { merge: true });
                }
                if (prevRoom) {
                    const prevRoomRef = doc(db, 'rooms', prevRoom);
                    batch.set(prevRoomRef, {
                        status: 'available', isActive: true, currentReservation: null,
                    }, { merge: true });
                }
                await batch.commit();
            }
        }
        catch (err) {
            console.error('Error updating room documents in batch:', err);
        }
        // 7. Pass object back
        onSave(updatedReservation);
    };
    const calculateNights = () => {
        if (!formData.checkIn || !formData.checkOut)
            return 0;
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    };
    // USED UTILITY
    const selectedRoomName = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType)?.name || "No room selected";
    const renderGcashForm = () => (_jsxs("div", { className: "grid grid-cols-2 gap-4 mt-4 border-t pt-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["GCash Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: formData.gcashName, onChange: (e) => setFormData(prev => ({ ...prev, gcashName: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.gcashName ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Juan Dela Cruz" }), errors.gcashName && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.gcashName })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["GCash Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", value: formData.gcashNumber, onChange: (e) => setFormData(prev => ({ ...prev, gcashNumber: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.gcashNumber ? 'border-red-300' : 'border-gray-300'}`, placeholder: "0917XXXXXXX" }), errors.gcashNumber && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.gcashNumber })] })] }));
    const renderCardForm = () => (_jsxs("div", { className: "space-y-4 mt-4 border-t pt-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Cardholder Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: formData.cardholderName, onChange: (e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.cardholderName ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Juan Dela Cruz" }), errors.cardholderName && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.cardholderName })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Card Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", value: formData.cardNumber, onChange: (e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'}`, placeholder: "0000 0000 0000 0000" }), errors.cardNumber && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.cardNumber })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Expiry Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: formData.cardExpiry, onChange: (e) => setFormData(prev => ({ ...prev, cardExpiry: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.cardExpiry ? 'border-red-300' : 'border-gray-300'}`, placeholder: "MM/YY" }), errors.cardExpiry && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.cardExpiry })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["CVV ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", value: formData.cardCvv, onChange: (e) => setFormData(prev => ({ ...prev, cardCvv: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.cardCvv ? 'border-red-300' : 'border-gray-300'}`, placeholder: "123" }), errors.cardCvv && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.cardCvv })] })] })] }));
    // Guard clause (Correctly placed to satisfy TS and hooks)
    if (!isOpen || !reservation) {
        return null;
    }
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: onClose, "aria-label": "Close overlay" }), _jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5", children: [_jsxs("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsx(IconCalendar, {}) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold md:text-2xl text-emerald-700", children: "Edit Reservation" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: reservation.bookingId })] })] }) }), _jsx("button", { onClick: onClose, "aria-label": "Close", className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-160px)]", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-4", children: [_jsx(IconUser, {}), _jsx("span", { className: "ml-2", children: "Guest Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Full Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", title: "Full Name", placeholder: "Enter guest full name", value: formData.guestName, onChange: (e) => setFormData(prev => ({ ...prev, guestName: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.guestName ? 'border-red-300' : 'border-gray-300'}` }), errors.guestName && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.guestName })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", title: "Email", placeholder: "guest@email.com", value: formData.email, onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-300' : 'border-gray-300'}` }), errors.email && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Number of Guests" }), _jsx("select", { title: "Number of Guests", value: formData.guests, onChange: (e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) })), className: `w-full px-3 py-2 border rounded-md ${errors.guests ? 'border-red-300' : 'border-gray-300'}`, children: Array.from({ length: formData.roomType ?
                                                                            // USED UTILITY
                                                                            (ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType)?.maxGuests || 8) : 8
                                                                    }, (_, i) => i + 1).map(num => (_jsxs("option", { value: num, children: [num, " guest", num > 1 ? 's' : ''] }, num))) }), errors.guests && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.guests })] })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-4", children: [_jsx(IconCalendar, {}), _jsx("span", { className: "ml-2", children: "Booking Details" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Room Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { title: "Room Type", value: formData.roomType, onChange: (e) => {
                                                                        setFormData(prev => ({ ...prev, roomType: e.target.value, roomNumber: '' }));
                                                                    }, className: `w-full px-3 py-2 border rounded-md ${errors.roomType ? 'border-red-300' : 'border-gray-300'}`, children: [_jsx("option", { value: "", children: "Select room type" }), ROOM_TYPES_CONFIG.map(type => (_jsx("option", { value: type.id, children: type.name }, type.id)))] }), errors.roomType && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.roomType })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Room Number" }), _jsxs("select", { title: "Room Number", "aria-label": "Room Number", value: formData.roomNumber, onChange: (e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.roomNumber ? 'border-red-300' : 'border-gray-300'}`, disabled: !formData.roomType || roomsLoading || isCheckingAvailability, children: [_jsx("option", { value: "", children: roomsLoading ? 'Loading rooms...' :
                                                                                isCheckingAvailability ? 'Checking availability...' :
                                                                                    'Select room (optional)' }), filteredRooms && filteredRooms.length > 0 ? (filteredRooms.map((room) => (_jsxs("option", { value: room.id, children: ["Room ", room.roomNumber] }, room.id)))) : (!roomsLoading && !isCheckingAvailability && formData.roomType &&
                                                                            _jsx("option", { value: "", disabled: true, children: "No rooms available for this type/date" }))] }), errors.roomNumber && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.roomNumber })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Check-in Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { title: "Check-in Date", type: "date", value: formData.checkIn, onChange: (e) => setFormData(prev => ({ ...prev, checkIn: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.checkIn ? 'border-red-300' : 'border-gray-300'}` }), errors.checkIn && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.checkIn })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Check-out Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { title: "Check-out Date", type: "date", value: formData.checkOut, onChange: (e) => setFormData(prev => ({ ...prev, checkOut: e.target.value })), className: `w-full px-3 py-2 border rounded-md ${errors.checkOut ? 'border-red-300' : 'border-gray-300'}` }), errors.checkOut && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.checkOut })] })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-4", children: [_jsx(IconCreditCard, {}), _jsx("span", { className: "ml-2", children: "Payment" })] }), _jsx("div", { className: "bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Original Total:" }), _jsxs("span", { className: "font-medium", children: ["\u20B1", reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Payment Status:" }), _jsx("span", { className: `font-medium ${reservation.paymentDetails.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`, children: reservation.paymentDetails.paymentStatus === 'paid' ? 'Paid' : 'Pending' })] }), _jsx("hr", { className: "my-2" }), _jsxs("div", { className: "flex justify-between text-base", children: [_jsx("span", { children: "New Total:" }), _jsxs("span", { className: "font-semibold", children: ["\u20B1", calculatePricing().totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] })] }), _jsxs("div", { className: "flex justify-between text-lg font-bold text-emerald-700", children: [_jsx("span", { children: "Balance Due:" }), _jsxs("span", { children: ["\u20B1", formData.paymentReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] })] })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Payment Method" }), _jsxs("select", { title: "Payment Method", value: formData.paymentMethod, onChange: (e) => {
                                                                        setErrors({});
                                                                        setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                                                                    }, className: "w-full px-3 py-2 border border-gray-300 rounded-md", children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "card", children: "Credit/Debit Card" }), _jsx("option", { value: "gcash", children: "GCash" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Payment Received Now" }), _jsx("input", { type: "number", value: formData.paymentReceived, onChange: (e) => setFormData(prev => ({ ...prev, paymentReceived: Number(e.target.value) })), className: "w-full px-3 py-2 border border-gray-300 rounded-md", placeholder: "0" })] })] }), formData.paymentMethod === 'gcash' && renderGcashForm(), formData.paymentMethod === 'card' && renderCardForm()] })] }), _jsxs("div", { className: "lg:col-span-1 lg:sticky lg:top-6 space-y-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Summary" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Room:" }), _jsx("span", { className: "font-semibold text-gray-900 ml-2", children: selectedRoomName })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Check-in:" }), _jsx("span", { className: "font-semibold text-gray-900 ml-2", children: formatDate(formData.checkIn) })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Check-out:" }), _jsx("span", { className: "font-semibold text-gray-900 ml-2", children: formatDate(formData.checkOut) })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Duration:" }), _jsxs("span", { className: "font-semibold text-gray-900 ml-2", children: [calculateNights(), " night", calculateNights() !== 1 ? 's' : ''] })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Guests:" }), _jsxs("span", { className: "font-semibold text-gray-900 ml-2", children: [formData.guests, " guest", formData.guests > 1 ? 's' : ''] })] })] })] }), _jsxs("div", { className: "p-4 rounded-xl bg-green-50 border border-green-200", children: [_jsx("p", { className: "block text-sm font-medium text-green-800", children: "Updated Total Amount" }), _jsxs("p", { className: "text-3xl font-bold text-green-900 mt-1", children: ["\u20B1", calculatePricing().totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] }), calculatePricing().totalAmount !== reservation.totalAmount && (_jsxs("p", { className: "text-sm text-orange-600 mt-2", children: ["Previous: \u20B1", reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] }))] })] })] }) }), _jsx("div", { className: "p-6 bg-white border-t border-gray-100", children: _jsxs("div", { className: "flex flex-col justify-end gap-3 sm:flex-row sm:items-center", children: [_jsx("button", { onClick: onClose, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white/80 rounded-2xl shadow-sm hover:bg-gray-50 transition transform", title: "Cancel changes", children: "Cancel" }), _jsxs("button", { onClick: handleSave, className: "inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5 disabled:opacity-50 disabled:cursor-not-allowed", title: "Save changes to reservation", children: [_jsx(IconSave, {}), "Save Changes"] })] }) })] })] }), document.body);
};
// --- Icon Components ---
const IconUser = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }));
const IconCalendar = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }));
const IconSave = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" }) }));
const IconCreditCard = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }));
