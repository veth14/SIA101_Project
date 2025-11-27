import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
// Room ID to room type mapping for pre-selection
const roomIdToTypeMapping = {
    '1': 'standard',
    '2': 'deluxe',
    '3': 'suite',
    '4': 'family'
};
// Check if two date ranges overlap (including touching dates)
const checkDateOverlap = (checkIn1, checkOut1, checkIn2, checkOut2) => {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    const start2 = new Date(checkIn2);
    const end2 = new Date(checkOut2);
    return start1 < end2 && start2 < end1;
};
export const BookingPage = () => {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        roomType: 'standard',
        guests: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [availabilityChecking, setAvailabilityChecking] = useState(false);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [pendingBooking, setPendingBooking] = useState(null);
    // Scroll to top and handle room pre-selection when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Check for roomId in URL parameters
        const urlParams = new URLSearchParams(location.search);
        const roomId = urlParams.get('roomId');
        if (roomId && roomIdToTypeMapping[roomId]) {
            setFormData(prev => ({
                ...prev,
                roomType: roomIdToTypeMapping[roomId]
            }));
        }
        // Check for pending booking in sessionStorage
        checkForPendingBooking();
    }, [location.search]);
    // Check for pending booking
    const checkForPendingBooking = () => {
        const pendingBookingData = sessionStorage.getItem('pendingBooking');
        if (pendingBookingData) {
            try {
                const parsedData = JSON.parse(pendingBookingData);
                const timestamp = parsedData.timestamp;
                const currentTime = Date.now();
                // Check if the pending booking is less than 30 minutes old
                if (currentTime - timestamp < 30 * 60 * 1000) { // 30 minutes
                    setPendingBooking(parsedData);
                }
                else {
                    // Remove expired booking data
                    sessionStorage.removeItem('pendingBooking');
                }
            }
            catch (err) {
                console.error('Error parsing pending booking data:', err);
                sessionStorage.removeItem('pendingBooking');
            }
        }
    };
    // Continue with pending booking
    const continuePendingBooking = () => {
        if (pendingBooking) {
            navigate('/payment', {
                state: {
                    bookingData: pendingBooking.bookingData,
                    fromBooking: true
                }
            });
        }
    };
    // Dismiss pending booking notification
    const dismissPendingBooking = () => {
        sessionStorage.removeItem('pendingBooking');
        setPendingBooking(null);
    };
    // Get today's date in YYYY-MM-DD format for min date validation
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    // Check room availability for selected dates
    const checkRoomAvailability = useCallback(async (roomType, checkIn, checkOut) => {
        if (!checkIn || !checkOut)
            return;
        setAvailabilityChecking(true);
        setAvailabilityMessage('');
        try {
            // Map room types to room names in Firebase
            const roomTypeToNameMap = {
                'standard': 'Silid Payapa',
                'deluxe': 'Silid Marahuyo',
                'suite': 'Silid Ginhawa',
                'family': 'Silid Haraya'
            };
            const roomName = roomTypeToNameMap[roomType];
            // 1. Get total count of rooms of this type
            const roomsQuery = query(collection(db, 'rooms'), where('roomName', '==', roomName), where('isActive', '==', true));
            const roomsSnapshot = await getDocs(roomsQuery);
            const totalRooms = roomsSnapshot.size;
            if (totalRooms === 0) {
                setAvailabilityMessage('No rooms of this type are currently available.');
                setAvailabilityChecking(false);
                return false;
            }
            // 2. Get bookings that overlap with the selected dates
            const bookingsQuery = query(collection(db, 'bookings'), where('roomType', '==', roomType), where('status', 'in', ['confirmed', 'checked-in', 'pending']));
            const bookingsSnapshot = await getDocs(bookingsQuery);
            const existingBookings = bookingsSnapshot.docs.map(doc => doc.data());
            // 3. Count how many rooms are booked during the selected dates
            let bookedRoomsCount = 0;
            const conflictingBookings = [];
            for (const booking of existingBookings) {
                if (checkDateOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)) {
                    bookedRoomsCount++;
                    conflictingBookings.push(booking);
                }
            }
            // 4. Check if there are available rooms
            const availableRooms = totalRooms - bookedRoomsCount;
            if (availableRooms <= 0) {
                setAvailabilityMessage(`All ${roomName} rooms are reserved for the selected dates. Please choose different dates.`);
                setAvailabilityChecking(false);
                return false;
            }
            setAvailabilityMessage(`✓ ${availableRooms} ${roomName} room${availableRooms > 1 ? 's' : ''} available for selected dates`);
            setAvailabilityChecking(false);
            return true;
        }
        catch (error) {
            console.error('Error checking availability:', error);
            setAvailabilityMessage('Error checking availability. Please try again.');
            setAvailabilityChecking(false);
            return false;
        }
    }, []);
    // Handle date changes and trigger availability check
    const handleDateChange = (field, value) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);
        // Clear previous availability message
        setAvailabilityMessage('');
        // Check availability if both dates are selected
        if (newFormData.checkIn && newFormData.checkOut && newFormData.checkIn < newFormData.checkOut) {
            checkRoomAvailability(newFormData.roomType, newFormData.checkIn, newFormData.checkOut);
        }
    };
    // Handle room type change and recheck availability
    const handleRoomTypeChange = (roomType) => {
        setFormData({ ...formData, roomType });
        setAvailabilityMessage('');
        // Recheck availability if dates are selected
        if (formData.checkIn && formData.checkOut && formData.checkIn < formData.checkOut) {
            checkRoomAvailability(roomType, formData.checkIn, formData.checkOut);
        }
    };
    // Use effect to check availability when component mounts or dates change
    useEffect(() => {
        if (formData.checkIn && formData.checkOut && formData.checkIn < formData.checkOut) {
            checkRoomAvailability(formData.roomType, formData.checkIn, formData.checkOut);
        }
    }, [formData.checkIn, formData.checkOut, formData.roomType, checkRoomAvailability]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData?.uid) {
            setError('Please log in to make a booking');
            return;
        }
        setLoading(true);
        setError('');
        // Check room availability before proceeding
        const isAvailable = await checkRoomAvailability(formData.roomType, formData.checkIn, formData.checkOut);
        if (!isAvailable) {
            setError('Selected dates are not available. Please choose different dates.');
            setLoading(false);
            return;
        }
        try {
            const totalAmount = calculateTotal(formData.roomType, formData.guests, formData.checkIn, formData.checkOut);
            const nights = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24));
            // Generate unique booking ID
            const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
            // Calculate pricing breakdown for booking record
            const selectedRoomData = roomDetails[formData.roomType];
            const roomPricePerNightForBooking = calculateRoomPrice(formData.roomType, formData.guests);
            const subtotalForBooking = calculateSubtotal(formData.roomType, formData.guests, formData.checkIn, formData.checkOut);
            const taxForBooking = calculateTax(subtotalForBooking);
            // Prepare booking data but DON'T save to Firebase yet
            const bookingData = {
                bookingId,
                userId: userData.uid,
                userEmail: userData.email,
                userName: userData.displayName || userData.email,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                roomType: formData.roomType,
                roomName: selectedRoomData.name,
                guests: formData.guests,
                nights,
                // Pricing breakdown
                basePrice: selectedRoomData.basePrice,
                baseGuests: selectedRoomData.baseGuests,
                additionalGuestPrice: selectedRoomData.additionalGuestPrice,
                roomPricePerNight: roomPricePerNightForBooking,
                subtotal: subtotalForBooking,
                tax: taxForBooking,
                taxRate: TAX_RATE,
                totalAmount,
                status: 'pending_payment', // Changed status to indicate payment is required
                paymentStatus: 'pending'
            };
            // Store booking data in sessionStorage as backup
            sessionStorage.setItem('pendingBooking', JSON.stringify({
                bookingData: bookingData,
                timestamp: Date.now(),
                fromBooking: true
            }));
            // Pass booking data to payment page via state instead of saving to Firebase
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                navigate('/payment', {
                    state: {
                        bookingData: bookingData,
                        fromBooking: true
                    }
                });
            }, 300);
        }
        catch (err) {
            console.error('Booking preparation failed:', err);
            setError('Booking preparation failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    // Tax rate (12% VAT in Philippines)
    const TAX_RATE = 0.12;
    const calculateRoomPrice = (roomType, guests) => {
        const room = roomDetails[roomType];
        if (!room)
            return 0;
        let totalPrice = room.basePrice;
        // Add additional guest charges if guests exceed base capacity
        if (guests > room.baseGuests) {
            const additionalGuests = guests - room.baseGuests;
            const guestsUpToMax = Math.min(additionalGuests, room.maxGuests - room.baseGuests);
            const excessGuests = Math.max(0, guests - room.maxGuests);
            // Charge normal rate for guests up to maxGuests
            totalPrice += guestsUpToMax * room.additionalGuestPrice;
            // Charge excess rate for guests beyond maxGuests (if any)
            if (excessGuests > 0 && room.excessGuestPrice) {
                totalPrice += excessGuests * room.excessGuestPrice;
            }
        }
        return totalPrice;
    };
    const calculateSubtotal = (roomType, guests, checkIn, checkOut) => {
        const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
        const roomPricePerNight = calculateRoomPrice(roomType, guests);
        return nights * roomPricePerNight;
    };
    const calculateTax = (subtotal) => {
        return subtotal * TAX_RATE;
    };
    const calculateTotal = (roomType, guests, checkIn, checkOut) => {
        const subtotal = calculateSubtotal(roomType, guests, checkIn, checkOut);
        const tax = calculateTax(subtotal);
        return subtotal + tax;
    };
    const roomDetails = {
        standard: {
            name: 'Silid Payapa',
            type: 'Standard Room',
            basePrice: 2500,
            baseGuests: 2,
            maxGuests: 4,
            maxCapacity: 4, // Hard limit - cannot exceed
            additionalGuestPrice: 500, // Price for guests 3-4
            excessGuestPrice: 800, // Price for guests beyond max (if allowed)
            description: 'A cozy sanctuary that embodies tranquility and comfort. Perfect for solo travelers or couples seeking an intimate retreat with authentic Filipino hospitality.',
            features: ['Queen-size bed', 'City view', 'Air conditioning', 'Private bathroom', 'Work desk'],
            amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee maker', 'Daily housekeeping'],
            roomSize: '25 sqm',
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        deluxe: {
            name: 'Silid Marahuyo',
            type: 'Deluxe Room',
            basePrice: 3800,
            baseGuests: 2,
            maxGuests: 5,
            maxCapacity: 5, // Hard limit - cannot exceed
            additionalGuestPrice: 750, // Price for guests 3-5
            excessGuestPrice: 1200, // Price for guests beyond max (if allowed)
            description: 'Spacious elegance meets modern comfort in this beautifully appointed room. Designed with premium amenities and Filipino-inspired décor for the discerning traveler.',
            features: ['King-size bed', 'Ocean view', 'Premium amenities', 'Marble bathroom', 'Seating area'],
            amenities: ['Free Wi-Fi', 'Smart TV', 'Mini bar', 'Coffee & tea station', 'Bathrobes', 'Room service'],
            roomSize: '35 sqm',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        suite: {
            name: 'Silid Ginhawa',
            type: 'Suite Room',
            basePrice: 5500,
            baseGuests: 4,
            maxGuests: 6,
            maxCapacity: 6, // Hard limit - cannot exceed
            additionalGuestPrice: 1000, // Price for guests 5-6
            excessGuestPrice: 1500, // Price for guests beyond max (if allowed)
            description: 'Experience ultimate comfort in this sophisticated suite featuring a separate living area, elegant interiors, and enhanced privacy for an unforgettable stay.',
            features: ['Separate living area', 'Premium furnishing', 'City & ocean view', 'Luxury bathroom', 'Dining area'],
            amenities: ['Free Wi-Fi', 'Smart TV', 'Full mini bar', 'Coffee machine', 'Premium toiletries', 'Concierge service'],
            roomSize: '50 sqm',
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
        },
        family: {
            name: 'Silid Haraya',
            type: 'Premium Family Suite',
            basePrice: 8000,
            baseGuests: 4,
            maxGuests: 8,
            maxCapacity: 8, // Hard limit - cannot exceed
            additionalGuestPrice: 1200, // Price for guests 5-8
            excessGuestPrice: 2000, // Price for guests beyond max (if allowed)
            description: 'Our grandest accommodation designed for families and groups. Featuring multiple bedrooms, spacious living areas, and panoramic views in a heritage-inspired setting.',
            features: ['Multiple bedrooms', 'Family-friendly layout', 'Panoramic views', 'Premium amenities', 'Private balcony'],
            amenities: ['Free Wi-Fi', 'Multiple TVs', 'Full kitchen', 'Dining area', 'Premium toiletries', '24/7 room service'],
            roomSize: '75 sqm',
            image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }
    };
    const selectedRoom = roomDetails[formData.roomType];
    // Calculate pricing breakdown
    const nights = formData.checkIn && formData.checkOut ?
        Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const roomPricePerNight = selectedRoom ? calculateRoomPrice(formData.roomType, formData.guests) : 0;
    const subtotal = formData.checkIn && formData.checkOut ?
        calculateSubtotal(formData.roomType, formData.guests, formData.checkIn, formData.checkOut) : 0;
    const tax = calculateTax(subtotal);
    const totalAmount = subtotal + tax;
    return (_jsxs("div", { className: "relative min-h-screen pt-20 sm:pt-24 overflow-hidden bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20", children: [_jsx("div", { className: "absolute top-0 right-0 rounded-full w-96 h-96 bg-heritage-green/5 blur-3xl" }), _jsx("div", { className: "absolute bottom-0 left-0 rounded-full w-80 h-80 bg-heritage-light/10 blur-2xl" }), _jsxs("div", { className: "relative z-10 p-4 sm:p-6 md:p-8 mx-auto max-w-7xl", children: [_jsxs("div", { className: "mb-8 sm:mb-12 md:mb-16 text-center", children: [_jsx("div", { className: "inline-block mb-4 sm:mb-6", children: _jsx("span", { className: "px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-medium border rounded-full shadow-lg bg-heritage-green/10 text-heritage-green border-heritage-green/20 backdrop-blur-sm", children: "Reserve Your Experience" }) }), _jsxs("h1", { className: "mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 px-4", children: ["Book Your Stay at", _jsx("span", { className: "block mt-1 sm:mt-2 text-transparent bg-gradient-to-r from-heritage-green via-heritage-neutral to-heritage-green bg-clip-text", children: " Balay Ginhawa" })] }), _jsxs("p", { className: "max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 px-4", children: ["Where ", _jsx("span", { className: "font-semibold text-heritage-green", children: "timeless Filipino traditions" }), " embrace ", _jsx("span", { className: "font-semibold text-gray-900", children: "modern luxury" })] })] }), pendingBooking && (_jsx("div", { className: "max-w-4xl mx-auto mb-6 sm:mb-8", children: _jsx("div", { className: "p-4 sm:p-6 border border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl", children: _jsxs("div", { className: "flex items-start gap-3 sm:gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "mb-2 text-base sm:text-lg font-bold text-blue-800", children: "Incomplete Booking Found" }), _jsxs("p", { className: "mb-3 sm:mb-4 text-sm sm:text-base text-blue-700", children: ["You have an incomplete booking for ", _jsx("span", { className: "font-semibold", children: pendingBooking.bookingData?.roomName }), pendingBooking.bookingData?.checkIn && (_jsxs("span", { children: [" from ", new Date(pendingBooking.bookingData.checkIn).toLocaleDateString()] })), ". Would you like to continue with payment?"] }), _jsxs("div", { className: "flex flex-col gap-2 sm:gap-3 sm:flex-row", children: [_jsxs("button", { onClick: continuePendingBooking, className: "px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold text-white transition-all duration-200 transform rounded-lg bg-gradient-to-r from-heritage-green to-emerald-600 hover:shadow-lg active:scale-95 sm:hover:scale-105", children: ["Continue Payment (\u20B1", pendingBooking.bookingData?.totalAmount?.toLocaleString(), ")"] }), _jsx("button", { onClick: dismissPendingBooking, className: "px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold text-gray-600 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50", children: "Start New Booking" })] })] }), _jsx("button", { onClick: dismissPendingBooking, className: "flex-shrink-0 text-blue-400 transition-colors hover:text-blue-600", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }) })), error && (_jsx("div", { className: "max-w-4xl p-4 mx-auto mb-8 border border-red-200 rounded-lg bg-red-50", children: _jsx("p", { className: "text-sm text-red-700", children: error }) })), _jsx("div", { className: "max-w-5xl mx-auto", children: _jsx("div", { className: "overflow-hidden border shadow-2xl bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border-heritage-green/20", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: "px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b bg-gradient-to-r from-heritage-green/10 via-heritage-neutral/10 to-heritage-green/10 border-heritage-green/10", children: _jsxs("div", { className: "flex items-center justify-center gap-3 sm:gap-6 md:gap-8", children: [_jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx("div", { className: "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold text-white rounded-full bg-heritage-green flex-shrink-0", children: "1" }), _jsx("span", { className: "text-xs sm:text-sm md:text-base font-semibold text-heritage-green", children: "Dates" })] }), _jsx("div", { className: "w-8 sm:w-12 md:w-16 h-0.5 bg-heritage-green/30" }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx("div", { className: "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold text-white rounded-full bg-heritage-green flex-shrink-0", children: "2" }), _jsx("span", { className: "text-xs sm:text-sm md:text-base font-semibold text-heritage-green", children: "Room" })] }), _jsx("div", { className: "w-8 sm:w-12 md:w-16 h-0.5 bg-heritage-green/30" }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx("div", { className: "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold text-white rounded-full bg-heritage-green flex-shrink-0", children: "3" }), _jsx("span", { className: "text-xs sm:text-sm md:text-base font-semibold text-heritage-green", children: "Guests" })] })] }) }), _jsxs("div", { className: "grid gap-0 lg:grid-cols-3", children: [_jsxs("div", { className: "p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 lg:col-span-2", children: [_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("h2", { className: "flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold text-gray-900", children: [_jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-heritage-green flex-shrink-0", children: "1" }), _jsx("span", { children: "Select Your Dates" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "Check-in Date" }), _jsx("input", { type: "date", value: formData.checkIn, min: getTodayDate(), onChange: (e) => handleDateChange('checkIn', e.target.value), className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "Check-out Date" }), _jsx("input", { type: "date", value: formData.checkOut, min: formData.checkIn || getTodayDate(), onChange: (e) => handleDateChange('checkOut', e.target.value), className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] })] }), (availabilityChecking || availabilityMessage) && (_jsx("div", { className: `p-4 rounded-xl border ${availabilityMessage.includes('✓')
                                                                    ? 'bg-green-50 border-green-200 text-green-700'
                                                                    : availabilityMessage.includes('reserved') || availabilityMessage.includes('Error')
                                                                        ? 'bg-red-50 border-red-200 text-red-700'
                                                                        : 'bg-blue-50 border-blue-200 text-blue-700'}`, children: availabilityChecking ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 border-b-2 border-current rounded-full animate-spin" }), _jsx("span", { children: "Checking availability..." })] })) : (_jsx("span", { children: availabilityMessage })) }))] }), _jsxs("div", { className: "pt-6 sm:pt-8 space-y-4 sm:space-y-6 border-t border-gray-100", children: [_jsxs("h2", { className: "flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold text-gray-900", children: [_jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-heritage-green flex-shrink-0", children: "2" }), _jsx("span", { children: "Choose Your Room" })] }), _jsx("div", { className: "grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2", children: Object.entries(roomDetails).map(([key, room]) => (_jsxs("label", { className: `block p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${formData.roomType === key
                                                                        ? 'border-heritage-green bg-heritage-green/5 shadow-md'
                                                                        : 'border-gray-200 hover:border-heritage-green/50'}`, children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${formData.roomType === key
                                                                                        ? 'border-heritage-green bg-heritage-green'
                                                                                        : 'border-gray-300'}`, children: formData.roomType === key && (_jsx("svg", { className: "w-3 h-3 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold leading-tight text-gray-900", children: room.name }), _jsx("p", { className: "text-xs font-medium tracking-wider uppercase text-heritage-green", children: room.type }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: room.description }), _jsxs("div", { className: "mt-2", children: [_jsxs("p", { className: "text-xl font-bold text-heritage-green", children: ["\u20B1", room.basePrice.toLocaleString(), _jsx("span", { className: "text-sm font-normal text-gray-500", children: "/night" })] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Base: ", room.baseGuests, " guests | Max: ", room.maxGuests, " guests"] }), room.additionalGuestPrice > 0 && (_jsxs("p", { className: "text-xs text-gray-500", children: ["+\u20B1", room.additionalGuestPrice, "/extra guest"] }))] })] })] }), _jsx("input", { type: "radio", name: "roomType", value: key, checked: formData.roomType === key, onChange: () => handleRoomTypeChange(key), className: "sr-only" })] }, key))) })] }), _jsxs("div", { className: "pt-8 space-y-6 border-t border-gray-100", children: [_jsxs("h2", { className: "flex items-center space-x-3 text-2xl font-bold text-gray-900", children: [_jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-heritage-green", children: "3" }), _jsx("span", { children: "Number of Guests" })] }), _jsxs("div", { className: "flex items-center justify-center space-x-6", children: [_jsx("button", { type: "button", onClick: () => setFormData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) })), className: "flex items-center justify-center w-12 h-12 font-bold transition-all duration-300 border-2 rounded-lg border-heritage-green/30 hover:border-heritage-green hover:bg-heritage-green hover:text-white text-heritage-green", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }) }) }), _jsxs("div", { className: "px-8 text-center", children: [_jsx("div", { className: "text-3xl font-bold text-heritage-green", children: formData.guests }), _jsx("div", { className: "text-sm text-gray-600", children: "guests" })] }), _jsx("button", { type: "button", onClick: () => setFormData(prev => ({ ...prev, guests: Math.min(selectedRoom?.maxGuests || 8, prev.guests + 1) })), disabled: formData.guests >= (selectedRoom?.maxGuests || 8), className: `w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all duration-300 font-bold ${formData.guests >= (selectedRoom?.maxGuests || 8)
                                                                            ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                                                                            : 'border-heritage-green/30 hover:border-heritage-green hover:bg-heritage-green hover:text-white text-heritage-green'}`, children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) })] })] })] }), _jsx("div", { className: "p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l lg:col-span-1 bg-heritage-green/5 border-heritage-green/10", children: _jsx("div", { className: "lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2", children: selectedRoom ? (_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "mb-1 text-lg sm:text-xl font-bold text-gray-900", children: selectedRoom.name }), _jsx("p", { className: "mb-2 text-xs sm:text-sm font-medium tracking-wider uppercase text-heritage-green", children: selectedRoom.type }), _jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-xl sm:text-2xl font-bold text-heritage-green", children: ["\u20B1", roomPricePerNight.toLocaleString()] }), _jsxs("p", { className: "text-xs sm:text-sm text-gray-600", children: ["per night (", formData.guests, " guests)"] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Base: \u20B1", selectedRoom.basePrice.toLocaleString(), " (", selectedRoom.baseGuests, " guests)"] }), formData.guests > selectedRoom.baseGuests && (_jsxs("p", { className: "text-xs text-gray-500", children: ["Extra: +\u20B1", ((formData.guests - selectedRoom.baseGuests) * selectedRoom.additionalGuestPrice).toLocaleString()] }))] })] }), _jsx("div", { className: "overflow-hidden shadow-md aspect-video rounded-xl", children: _jsx("img", { src: selectedRoom.image, alt: selectedRoom.name, className: "object-cover w-full h-full" }) }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "mb-2 sm:mb-3 text-sm sm:text-base font-bold text-gray-900", children: "Room Features" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2", children: selectedRoom.features.slice(0, 3).map((feature, index) => (_jsxs("div", { className: "flex items-center space-x-2 text-xs sm:text-sm text-gray-700", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-heritage-green rounded-full flex-shrink-0" }), _jsx("span", { children: feature })] }, index))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "mb-2 sm:mb-3 text-sm sm:text-base font-bold text-gray-900", children: "Amenities" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2", children: selectedRoom.amenities.slice(0, 3).map((amenity, index) => (_jsxs("div", { className: "flex items-center space-x-2 text-xs sm:text-sm text-gray-700", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-heritage-neutral rounded-full flex-shrink-0" }), _jsx("span", { children: amenity })] }, index))) })] })] }), formData.checkIn && formData.checkOut && (_jsxs("div", { className: "p-4 border bg-white/80 rounded-xl border-heritage-green/20", children: [_jsx("h4", { className: "mb-3 font-bold text-gray-900", children: "Booking Summary" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Check-in:" }), _jsx("span", { className: "font-medium", children: new Date(formData.checkIn).toLocaleDateString() })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Check-out:" }), _jsx("span", { className: "font-medium", children: new Date(formData.checkOut).toLocaleDateString() })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Nights:" }), _jsx("span", { className: "font-medium", children: nights })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Guests:" }), _jsx("span", { className: "font-medium", children: formData.guests })] }), _jsxs("div", { className: "pt-2 mt-3 space-y-1 border-t border-gray-200", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsxs("span", { className: "text-gray-600", children: ["Room (", nights, " nights \u00D7 \u20B1", roomPricePerNight.toLocaleString(), "):"] }), _jsxs("span", { children: ["\u20B1", subtotal.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-gray-600", children: "Tax (12% VAT):" }), _jsxs("span", { children: ["\u20B1", tax.toLocaleString()] })] })] }), _jsx("div", { className: "pt-2 mt-3 border-t border-heritage-green/20", children: _jsxs("div", { className: "flex justify-between font-bold", children: [_jsx("span", { children: "Total:" }), _jsxs("span", { className: "text-heritage-green", children: ["\u20B1", totalAmount.toLocaleString()] })] }) })] })] }))] })) : (_jsx("div", { className: "py-8 text-center text-gray-500", children: _jsx("p", { children: "Select a room to see details" }) })) }) })] }), _jsx("div", { className: "px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t bg-heritage-green/5 border-heritage-green/10", children: _jsx("button", { type: "submit", disabled: loading, className: `w-full py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${loading
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-lg hover:shadow-xl active:scale-95'}`, children: loading ? (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("div", { className: "w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" }), _jsx("span", { children: "Processing..." })] })) : (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { className: "hidden sm:inline", children: "Complete Booking \u2022" }), _jsx("span", { className: "sm:hidden", children: "Book Now \u2022" }), _jsxs("span", { children: ["\u20B1", totalAmount.toLocaleString()] })] })) }) })] }) }) })] })] }));
};
