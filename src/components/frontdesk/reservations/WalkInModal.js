import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
// --- UPDATED IMPORTS ---
import { useRooms } from './ReservationsContext';
import { ROOM_TYPES_CONFIG, normalizeTypeKey, checkDateOverlap } from './reservations.utils';
// --- Icon Components ---
const IconUserPlus = () => (_jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" }) }));
const IconUser = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }));
const IconBed = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7v4a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h2a1 1 0 011 1zm8 0v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V7a1 1 0 011-1h2a1 1 0 011 1zM3 15h18v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4z" }) }));
const IconCalendar = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }));
const IconUsers = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6m6 3v-1a6 6 0 00-6-6h-1.5m-1.5-9a4 4 0 00-4-4h-1a4 4 0 100 8h1" }) }));
const IconDollar = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.657 0-3-.895-3-2s1.343-2 3-2 3-.895 3-2-1.343-2-3-2m-3.5 7.039a5.002 5.002 0 01-2.599-1M15.5 11.039a5.002 5.002 0 012.599-1" }) }));
const InfoItem = ({ icon, label, children }) => (_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 w-6 h-6 text-gray-400 pt-1", children: icon }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: label }), _jsx("div", { className: "text-sm text-gray-900 mt-1 font-medium", children: children })] })] }));
const FormItem = ({ label, required, error, children }) => (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: [label, " ", required && _jsx("span", { className: "text-red-500", children: "*" })] }), children, error && _jsx("p", { className: "text-red-600 text-xs mt-1.5", children: error })] }));
const inputBaseStyles = "w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition disabled:bg-gray-50 disabled:cursor-not-allowed";
const errorStyles = "border-red-400 ring-1 ring-red-200 focus:border-red-500 focus:ring-red-200";
const FormInput = (props) => {
    const { hasError, className, ...rest } = props;
    return _jsx("input", { ...rest, className: `${inputBaseStyles} ${hasError ? errorStyles : ''} ${className || ''}` });
};
const FormSelect = (props) => {
    const { hasError, className, ...rest } = props;
    return _jsx("select", { ...rest, className: `${inputBaseStyles} ${hasError ? errorStyles : ''} ${className || ''}` });
};
const FormTextarea = (props) => {
    const { hasError, className, ...rest } = props;
    return _jsx("textarea", { ...rest, className: `${inputBaseStyles} ${hasError ? errorStyles : ''} ${className || ''}` });
};
// --- Helper Functions ---
const formatDate = (dateString, options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}) => {
    if (!dateString)
        return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', options);
};
// --- CONSTANTS ---
const stepTitles = ["Guest Information", "Booking Details", "Payment & Confirmation"];
// --- MAIN COMPONENT ---
export const WalkInModal = ({ isOpen, onClose, onBooking }) => {
    const [step, setStep] = useState(1);
    // Note: Removed local roomTypes state, using ROOM_TYPES_CONFIG directly
    // Get rooms from context
    const { rooms: allRooms, loading: roomsLoading } = useRooms();
    // State for *available* rooms
    const [filteredRooms, setFilteredRooms] = useState([]);
    // State for our single availability query
    const [overlappingBookings, setOverlappingBookings] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [formData, setFormData] = useState({
        guestName: '', email: '', phone: '', idType: 'passport', idNumber: '', address: '',
        roomType: '', roomNumber: '', guests: 1,
        checkIn: new Date().toISOString().split('T')[0], checkOut: '', nights: 1,
        totalAmount: 0, paymentMethod: 'cash', paymentReceived: 0,
        gcashName: '', gcashNumber: '', cardholderName: '',
        cardNumber: '', cardExpiry: '', cardCvv: '', specialRequests: '',
    });
    const [errors, setErrors] = useState({});
    // --- Availability Query ---
    useEffect(() => {
        if (!isOpen || !formData.checkIn || !formData.checkOut) {
            setOverlappingBookings([]);
            return;
        }
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
                const bookings = snap.docs.map(doc => ({ ...doc.data(), bookingId: doc.id }));
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
    }, [isOpen, formData.checkIn, formData.checkOut]);
    // --- Occupied Rooms Calculation ---
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
    // --- Filter Available Rooms ---
    useEffect(() => {
        if (!formData.roomType) {
            setFilteredRooms([]);
            return;
        }
        const reservationTypeKey = formData.roomType;
        // USED UTILITY
        const candidateRooms = allRooms.filter(r => normalizeTypeKey(r.roomType) === reservationTypeKey);
        const availableRooms = candidateRooms.filter(room => {
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
    }, [formData.roomType, allRooms, occupiedRoomNumbers, formData.checkIn, formData.checkOut]);
    // Auto-select room
    useEffect(() => {
        if (!isOpen)
            return;
        if (filteredRooms.length > 0 && !formData.roomNumber) {
            setFormData(prev => ({ ...prev, roomNumber: filteredRooms[0].id }));
        }
        else if (filteredRooms.length === 0) {
            setFormData(prev => ({ ...prev, roomNumber: '' }));
        }
    }, [filteredRooms, isOpen, formData.roomNumber]);
    // Body scroll lock
    useEffect(() => {
        if (!isOpen)
            return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);
    // --- Validation ---
    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.guestName.trim())
            newErrors.guestName = 'Guest name is required';
        if (!formData.email.trim())
            newErrors.email = 'Email is required';
        if (!formData.phone.trim())
            newErrors.phone = 'Phone number is required';
        if (!formData.idNumber.trim())
            newErrors.idNumber = 'ID number is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            newErrors.phone = 'Phone number must have at least 11 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.roomType)
            newErrors.roomType = 'Room type is required';
        if (!formData.checkOut)
            newErrors.checkOut = 'Check-out date is required';
        if (!formData.roomNumber) {
            newErrors.roomNumber = 'Room selection is required';
        }
        else if (filteredRooms.length === 0 || !filteredRooms.find(r => r.id === formData.roomNumber)) {
            newErrors.roomNumber = 'Selected room is not available for these dates';
        }
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (checkIn < today) {
            newErrors.checkIn = 'Check-in date cannot be in the past';
        }
        if (checkOut <= checkIn) {
            newErrors.checkOut = 'Check-out must be after check-in date';
        }
        if (formData.roomNumber && occupiedRoomNumbers.has(formData.roomNumber)) {
            newErrors.roomNumber = 'Selected room is not available for those dates';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateStep3 = () => {
        const newErrors = {};
        if (formData.paymentMethod === 'gcash') {
            if (!formData.gcashName.trim())
                newErrors.gcashName = 'GCash name is required';
            if (!formData.gcashNumber.trim()) {
                newErrors.gcashNumber = 'GCash number is required';
            }
            else if (formData.gcashNumber.replace(/\D/g, '').length < 11) {
                newErrors.gcashNumber = 'Must be a valid 11-digit number';
            }
        }
        if (formData.paymentMethod === 'card') {
            if (!formData.cardholderName.trim())
                newErrors.cardholderName = 'Cardholder name is required';
            if (!formData.cardNumber.trim()) {
                newErrors.cardNumber = 'Card number is required';
            }
            else if (formData.cardNumber.replace(/\D/g, '').length < 15) {
                newErrors.cardNumber = 'Must be a valid card number';
            }
            if (!formData.cardExpiry.trim()) {
                newErrors.cardExpiry = 'Expiry date is required';
            }
            else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
                newErrors.cardExpiry = 'Must be MM/YY format';
            }
            if (!formData.cardCvv.trim()) {
                newErrors.cardCvv = 'CVV is required';
            }
            else if (formData.cardCvv.replace(/\D/g, '').length < 3) {
                newErrors.cardCvv = 'Must be 3-4 digits';
            }
        }
        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };
    const calculatePricing = () => {
        // USED UTILITY
        const rt = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType);
        if (!rt || !formData.checkOut || !formData.checkIn) {
            return { nights: 0, basePrice: 0, roomPricePerNight: 0, additionalGuestPrice: 0, baseGuests: 0, subtotal: 0, tax: 0, taxRate: 0.12, totalAmount: 0 };
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
            nights, basePrice: basePrice, roomPricePerNight: Math.round(roomPricePerNight * 100) / 100,
            additionalGuestPrice, baseGuests, subtotal: Math.round(subtotal * 100) / 100,
            tax: Math.round(tax * 100) / 100, taxRate, totalAmount: Math.round(totalAmount * 100) / 100,
        };
    };
    const handleNext = async () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
        else if (step === 2) {
            const ok = validateStep2();
            if (ok) {
                const { totalAmount } = calculatePricing();
                setFormData(prev => ({ ...prev, totalAmount: totalAmount, paymentReceived: totalAmount }));
                setStep(3);
            }
        }
    };
    const handleBack = () => {
        setErrors({});
        setStep(step - 1);
    };
    const internalOnClose = () => {
        setStep(1);
        setFormData({
            guestName: '', email: '', phone: '', idType: 'passport', idNumber: '', address: '',
            roomType: '', roomNumber: '', guests: 1,
            checkIn: new Date().toISOString().split('T')[0], checkOut: '', nights: 1,
            totalAmount: 0, paymentMethod: 'cash', paymentReceived: 0, specialRequests: '',
            gcashName: '', gcashNumber: '', cardholderName: '',
            cardNumber: '', cardExpiry: '', cardCvv: '',
        });
        setErrors({});
        onClose();
    };
    const handleSubmit = async () => {
        const step2Ok = validateStep2();
        if (!step2Ok) {
            setStep(2);
            return;
        }
        const step3Ok = validateStep3();
        if (!step3Ok)
            return;
        const pricingDetails = calculatePricing();
        const { nights, basePrice, roomPricePerNight, additionalGuestPrice, baseGuests, subtotal, tax, taxRate, totalAmount } = pricingDetails;
        const paymentReceived = typeof formData.paymentReceived === 'number' ? formData.paymentReceived : 0;
        const paymentStatus = paymentReceived >= totalAmount ? 'paid' : 'pending';
        const now = new Date();
        const firestoreTimestamp = Timestamp.fromDate(now);
        const todayString = now.toISOString().split('T')[0];
        const bookingStatus = (formData.checkIn === todayString) ? 'checked-in' : 'confirmed';
        // USED UTILITY
        const selectedRoomType = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType);
        const roomName = selectedRoomType?.name || 'Unknown Room';
        const roomType = selectedRoomType?.id || formData.roomType;
        const roomNumber = formData.roomNumber;
        const bookingId = `BK${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
        const userId = `U${Date.now()}${Math.random().toString(36).substring(2, 7)}`;
        const newBooking = {
            additionalGuestPrice, baseGuests, basePrice, bookingId,
            checkIn: formData.checkIn, checkOut: formData.checkOut,
            createdAt: firestoreTimestamp,
            guests: Number(formData.guests),
            nights,
            paymentDetails: {
                cardLast4: formData.paymentMethod === 'card' ? formData.cardNumber.slice(-4) : null,
                cardholderName: formData.paymentMethod === 'card' ? formData.cardholderName : null,
                gcashName: formData.paymentMethod === 'gcash' ? formData.gcashName : null,
                gcashNumber: formData.paymentMethod === 'gcash' ? formData.gcashNumber : null,
                paidAt: paymentStatus === 'paid' ? firestoreTimestamp : null,
                paymentMethod: formData.paymentMethod,
                paymentStatus,
            },
            roomName, roomPricePerNight, roomType, roomNumber,
            status: bookingStatus,
            subtotal, tax, taxRate, totalAmount,
            updatedAt: firestoreTimestamp,
            userEmail: formData.email,
            userId,
            userName: formData.guestName,
        };
        onBooking(newBooking);
        internalOnClose();
    };
    // --- RENDER FUNCTIONS ---
    const renderStep1 = () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(FormItem, { label: "Full Name", required: true, error: errors.guestName, children: _jsx(FormInput, { type: "text", value: formData.guestName, onChange: (e) => setFormData(prev => ({ ...prev, guestName: e.target.value })), placeholder: "Enter guest name", hasError: !!errors.guestName }) }), _jsx(FormItem, { label: "Email", required: true, error: errors.email, children: _jsx(FormInput, { type: "email", value: formData.email, onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })), placeholder: "guest@email.com", hasError: !!errors.email }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(FormItem, { label: "Phone Number", required: true, error: errors.phone, children: _jsx(FormInput, { type: "tel", value: formData.phone, onChange: (e) => setFormData(prev => ({ ...prev, phone: e.target.value })), placeholder: "+63 9XX XXX XXXX", hasError: !!errors.phone }) }), _jsx(FormItem, { label: "ID Type", children: _jsxs(FormSelect, { value: formData.idType, onChange: (e) => setFormData(prev => ({ ...prev, idType: e.target.value })), title: "ID Type", children: [_jsx("option", { value: "passport", children: "Passport" }), _jsx("option", { value: "drivers-license", children: "Driver's License" }), _jsx("option", { value: "national-id", children: "National ID" }), _jsx("option", { value: "sss", children: "SSS ID" })] }) })] }), _jsx(FormItem, { label: "ID Number", required: true, error: errors.idNumber, children: _jsx(FormInput, { type: "text", value: formData.idNumber, onChange: (e) => setFormData(prev => ({ ...prev, idNumber: e.target.value })), placeholder: "Enter ID number", hasError: !!errors.idNumber }) }), _jsx(FormItem, { label: "Address", children: _jsx(FormTextarea, { value: formData.address, onChange: (e) => setFormData(prev => ({ ...prev, address: e.target.value })), rows: 2, placeholder: "Complete address" }) })] }));
    const renderStep2 = () => (_jsxs("div", { className: "space-y-4", children: [_jsx(FormItem, { label: "Room Type", required: true, error: errors.roomType, children: _jsxs(FormSelect, { value: formData.roomType, onChange: (e) => {
                        setFormData(prev => ({ ...prev, roomType: e.target.value, roomNumber: '' }));
                    }, title: "Room Type", hasError: !!errors.roomType, children: [_jsx("option", { value: "", children: "Select room type" }), ROOM_TYPES_CONFIG.map(type => (_jsxs("option", { value: type.id, children: [type.name, " - \u20B1", type.price.toLocaleString(), "/night"] }, type.id)))] }) }), formData.roomType && (_jsx(FormItem, { label: "Available Rooms", required: true, error: errors.roomNumber, children: _jsxs(FormSelect, { value: formData.roomNumber, onChange: (e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value })), title: "Available Rooms", hasError: !!errors.roomNumber, disabled: roomsLoading || isCheckingAvailability || filteredRooms.length === 0, children: [_jsx("option", { value: "", children: roomsLoading
                                ? 'Loading...'
                                : isCheckingAvailability
                                    ? 'Checking availability...'
                                    : (filteredRooms.length > 0 ? 'Select room' : 'No rooms available for selected dates') }), filteredRooms.map((room) => (_jsxs("option", { value: room.id, children: ["Room ", room.roomNumber] }, room.id)))] }) })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(FormItem, { label: "Check-in Date", error: errors.checkIn, children: _jsx(FormInput, { type: "date", value: formData.checkIn, title: "Check-in Date", onChange: (e) => setFormData(prev => ({ ...prev, checkIn: e.target.value })), hasError: !!errors.checkIn }) }), _jsx(FormItem, { label: "Check-out Date", required: true, error: errors.checkOut, children: _jsx(FormInput, { type: "date", value: formData.checkOut, title: "Check-out Date", onChange: (e) => setFormData(prev => ({ ...prev, checkOut: e.target.value })), hasError: !!errors.checkOut }) }), _jsx(FormItem, { label: "Guests", children: _jsx(FormSelect, { title: "Number of Guests", value: formData.guests, onChange: (e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) })), children: Array.from({ length: formData.roomType ? (ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType)?.maxGuests || 4) : 4 }, (_, i) => i + 1).map(num => (_jsxs("option", { value: num, children: [num, " guest", num > 1 ? 's' : ''] }, num))) }) })] }), _jsx(FormItem, { label: "Special Requests", children: _jsx(FormTextarea, { value: formData.specialRequests, onChange: (e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value })), rows: 3, placeholder: "Any special requests or preferences..." }) })] }));
    const renderGcashForm = () => (_jsxs("div", { className: "grid grid-cols-2 gap-4 mt-4 border-t border-gray-200 pt-4", children: [_jsx(FormItem, { label: "GCash Name", required: true, error: errors.gcashName, children: _jsx(FormInput, { type: "text", value: formData.gcashName, onChange: (e) => setFormData(prev => ({ ...prev, gcashName: e.target.value })), placeholder: "Juan Dela Cruz", hasError: !!errors.gcashName }) }), _jsx(FormItem, { label: "GCash Number", required: true, error: errors.gcashNumber, children: _jsx(FormInput, { type: "tel", value: formData.gcashNumber, onChange: (e) => setFormData(prev => ({ ...prev, gcashNumber: e.target.value })), placeholder: "0917XXXXXXX", hasError: !!errors.gcashNumber }) })] }));
    const renderCardForm = () => (_jsxs("div", { className: "space-y-4 mt-4 border-t border-gray-200 pt-4", children: [_jsx(FormItem, { label: "Cardholder Name", required: true, error: errors.cardholderName, children: _jsx(FormInput, { type: "text", value: formData.cardholderName, onChange: (e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value })), placeholder: "Juan Dela Cruz", hasError: !!errors.cardholderName }) }), _jsx(FormItem, { label: "Card Number", required: true, error: errors.cardNumber, children: _jsx(FormInput, { type: "tel", value: formData.cardNumber, onChange: (e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value })), placeholder: "0000 0000 0000 0000", hasError: !!errors.cardNumber }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(FormItem, { label: "Expiry Date", required: true, error: errors.cardExpiry, children: _jsx(FormInput, { type: "text", value: formData.cardExpiry, onChange: (e) => setFormData(prev => ({ ...prev, cardExpiry: e.target.value })), placeholder: "MM/YY", hasError: !!errors.cardExpiry }) }), _jsx(FormItem, { label: "CVV", required: true, error: errors.cardCvv, children: _jsx(FormInput, { type: "tel", value: formData.cardCvv, onChange: (e) => setFormData(prev => ({ ...prev, cardCvv: e.target.value })), placeholder: "123", hasError: !!errors.cardCvv }) })] })] }));
    const renderStep3 = () => {
        const { totalAmount } = calculatePricing();
        const remainingBalance = totalAmount - formData.paymentReceived;
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Booking Summary" }), _jsxs("div", { className: "space-y-4", children: [_jsx(InfoItem, { icon: _jsx(IconUser, {}), label: "Guest Name", children: formData.guestName }), _jsxs(InfoItem, { icon: _jsx(IconBed, {}), label: "Room", children: [ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType)?.name || formData.roomType, formData.roomNumber && ` - Room ${formData.roomNumber}`] }), _jsxs(InfoItem, { icon: _jsx(IconCalendar, {}), label: "Stay Dates", children: [formatDate(formData.checkIn), " - ", formatDate(formData.checkOut)] }), _jsxs(InfoItem, { icon: _jsx(IconUsers, {}), label: "Guests", children: [formData.guests, " guest", formData.guests > 1 ? 's' : ''] }), _jsx("div", { className: "border-t border-gray-200 my-4" }), _jsx(InfoItem, { icon: _jsx(IconDollar, {}), label: "Total Amount", children: _jsxs("span", { className: "text-xl font-bold text-gray-900", children: ["\u20B1", totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })] }) })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Payment" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(FormItem, { label: "Payment Method", children: _jsxs(FormSelect, { title: "Payment Method", value: formData.paymentMethod, onChange: (e) => {
                                            setErrors({});
                                            setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                                        }, children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "card", children: "Credit/Debit Card" }), _jsx("option", { value: "gcash", children: "GCash" })] }) }), _jsx(FormItem, { label: "Payment Received", children: _jsx(FormInput, { type: "number", value: formData.paymentReceived, onChange: (e) => setFormData(prev => ({ ...prev, paymentReceived: Number(e.target.value) })), placeholder: "0.00" }) })] }), formData.paymentMethod === 'gcash' && renderGcashForm(), formData.paymentMethod === 'card' && renderCardForm(), remainingBalance > 0 && (_jsx("div", { className: "bg-yellow-50 p-3 rounded-md mt-4 border border-yellow-200", children: _jsx("p", { className: "text-sm text-yellow-800", children: _jsxs("strong", { children: ["Remaining Balance: \u20B1", remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })] }) }) })), remainingBalance < 0 && (_jsx("div", { className: "bg-blue-50 p-3 rounded-md mt-4 border border-blue-200", children: _jsx("p", { className: "text-sm text-blue-800", children: _jsxs("strong", { children: ["Change Due: \u20B1", (-remainingBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })] }) }) }))] })] }));
    };
    const renderProgressBar = () => (_jsx("div", { className: "flex items-center mb-6", children: stepTitles.map((title, index) => {
            const stepNum = index + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (_jsxs(React.Fragment, { children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isCompleted ? 'bg-emerald-600 text-white' :
                                    isCurrent ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300' : 'bg-gray-200 text-gray-500'}`, children: isCompleted ? '✓' : stepNum }), _jsx("span", { className: `mt-2 text-xs font-medium ${isCurrent ? 'text-emerald-700' : 'text-gray-500'}`, children: title })] }), stepNum < stepTitles.length && (_jsx("div", { className: `flex-1 h-1 mx-4 ${isCompleted ? 'bg-emerald-600' : 'bg-gray-200'}` }))] }, stepNum));
        }) }));
    if (!isOpen)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: internalOnClose, "aria-label": "Close overlay" }), _jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-gray-50/95 shadow-2xl ring-1 ring-black/5", children: [_jsx("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsx(IconUserPlus, {}) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold md:text-2xl text-emerald-700", children: "Add Walk-In Reservation" }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["Step ", step, " of ", stepTitles.length, ": ", stepTitles[step - 1]] })] })] }), _jsx("button", { onClick: internalOnClose, "aria-label": "Close", className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), _jsxs("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-6", children: [renderProgressBar(), _jsxs("div", { className: "p-6 bg-white rounded-2xl ring-1 ring-black/5 shadow-inner", children: [step === 1 && renderStep1(), step === 2 && renderStep2(), step === 3 && renderStep3()] })] }), _jsx("div", { className: "p-6 bg-white border-t border-gray-100", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("button", { onClick: internalOnClose, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5", children: "Cancel" }), _jsxs("div", { className: "flex items-center space-x-3", children: [step > 1 && (_jsx("button", { onClick: handleBack, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5", children: "Back" })), step < 3 ? (_jsxs("button", { onClick: handleNext, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-2xl shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5", children: ["Next", _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })] })) : (_jsxs("button", { onClick: handleSubmit, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-2xl shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5", children: ["Complete Booking", _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })] }))] })] }) })] })] }), document.body);
};
