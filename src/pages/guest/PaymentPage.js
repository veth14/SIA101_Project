import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, updateDoc, serverTimestamp, query, collection, where, getDocs, addDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
export const PaymentPage = () => {
    const { bookingId } = useParams();
    const { userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('gcash');
    const [gcashNumber, setGcashNumber] = useState('');
    const [gcashName, setGcashName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // When success modal is shown, blur the entire app root (including header)
    useEffect(() => {
        const rootEl = document.getElementById('root');
        if (!rootEl)
            return;
        if (showSuccessModal) {
            // apply a mild blur so the app (including header) is softly blurred but still readable
            rootEl.classList.add('filter', 'blur-sm', 'brightness-95');
        }
        else {
            rootEl.classList.remove('filter', 'blur-sm', 'brightness-95');
        }
        return () => {
            rootEl.classList.remove('filter', 'blur-sm', 'brightness-95');
        };
    }, [showSuccessModal]);
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    // Handle booking data from navigation state or fetch from Firebase
    useEffect(() => {
        const initializeBooking = async () => {
            if (!userData?.uid) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }
            // Check if booking data was passed from BookingPage
            const navigationState = location.state;
            if (navigationState?.fromBooking && navigationState?.bookingData) {
                // Use booking data from navigation state (new flow - payment required first)
                setBooking(navigationState.bookingData);
                setLoading(false);
                return;
            }
            // Check for pending booking in sessionStorage (if user navigated away and came back)
            const pendingBookingData = sessionStorage.getItem('pendingBooking');
            if (pendingBookingData) {
                try {
                    const parsedData = JSON.parse(pendingBookingData);
                    const timestamp = parsedData.timestamp;
                    const currentTime = Date.now();
                    // Check if the pending booking is less than 30 minutes old
                    if (currentTime - timestamp < 30 * 60 * 1000) { // 30 minutes
                        setBooking(parsedData.bookingData);
                        setLoading(false);
                        setError('We found your incomplete booking. Please complete your payment to confirm your reservation.');
                        return;
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
            // Fallback: Fetch existing booking from Firebase (old flow - for existing bookings)
            if (!bookingId) {
                setError('No booking data provided');
                setLoading(false);
                return;
            }
            try {
                // Query bookings collection to find the booking
                const bookingsQuery = query(collection(db, 'bookings'), where('bookingId', '==', bookingId), where('userId', '==', userData.uid));
                const querySnapshot = await getDocs(bookingsQuery);
                if (querySnapshot.empty) {
                    setError('Booking not found');
                    setLoading(false);
                    return;
                }
                const bookingDoc = querySnapshot.docs[0];
                const bookingData = bookingDoc.data();
                setBooking({ id: bookingDoc.id, ...bookingData });
                setLoading(false);
            }
            catch (err) {
                console.error('Error fetching booking:', err);
                setError('Failed to load booking details');
                setLoading(false);
            }
        };
        initializeBooking();
    }, [bookingId, userData?.uid, location.state]);
    // Email receipt function
    const sendEmailReceipt = async (bookingData, user) => {
        try {
            // For now, we'll simulate the email sending
            console.log('Sending email receipt to:', user.email);
            console.log('Booking details:', bookingData);
            // Simulate email sending delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Email receipt sent successfully');
        }
        catch (error) {
            console.error('Failed to send email receipt:', error);
            // Don't throw error - payment should still succeed even if email fails
        }
    };
    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        // Scroll to top and redirect to landing page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            navigate('/');
        }, 300);
    };
    // Check if all required fields are filled
    const isFormValid = () => {
        if (paymentMethod === 'gcash') {
            return gcashNumber.trim() !== '' && gcashName.trim() !== '';
        }
        else if (paymentMethod === 'card') {
            return cardNumber.trim() !== '' &&
                expiryDate.trim() !== '' &&
                cvv.trim() !== '' &&
                cardholderName.trim() !== '';
        }
        return false;
    };
    const handlePayment = async () => {
        if (!booking || !userData?.uid)
            return;
        // Prevent submission if form is not valid
        if (!isFormValid()) {
            setError('Please fill in all required payment details');
            return;
        }
        setProcessing(true);
        setError('');
        try {
            // Validate payment details (redundant check for safety)
            if (paymentMethod === 'gcash') {
                if (!gcashNumber || !gcashName) {
                    setError('Please fill in all GCash details');
                    setProcessing(false);
                    return;
                }
                if (!/^09\d{9}$/.test(gcashNumber)) {
                    setError('Please enter a valid GCash number (09XXXXXXXXX)');
                    setProcessing(false);
                    return;
                }
            }
            else if (paymentMethod === 'card') {
                if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
                    setError('Please fill in all credit card details');
                    setProcessing(false);
                    return;
                }
                if (cardNumber.replace(/\s/g, '').length < 13) {
                    setError('Please enter a valid card number');
                    setProcessing(false);
                    return;
                }
                if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                    setError('Please enter expiry date in MM/YY format');
                    setProcessing(false);
                    return;
                }
                if (!/^\d{3,4}$/.test(cvv)) {
                    setError('Please enter a valid CVV');
                    setProcessing(false);
                    return;
                }
            }
            // Check if this is a new booking (from BookingPage) or existing booking
            const isNewBooking = !booking.id && booking.status === 'pending_payment';
            if (isNewBooking) {
                // NEW FLOW: Create booking in Firebase only after successful payment
                const bookingDataWithPayment = {
                    ...booking,
                    status: 'confirmed', // Change from pending_payment to confirmed
                    paymentStatus: 'paid',
                    paymentMethod: paymentMethod,
                    paymentDetails: {
                        gcashNumber: paymentMethod === 'gcash' ? gcashNumber : null,
                        gcashName: paymentMethod === 'gcash' ? gcashName : null,
                        cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) : null,
                        cardholderName: paymentMethod === 'card' ? cardholderName : null,
                        paidAt: serverTimestamp()
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };
                // Create booking document in Firebase
                const bookingDocRef = await addDoc(collection(db, 'bookings'), bookingDataWithPayment);
                // Create transaction record
                const transactionData = {
                    transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                    bookingId: booking.bookingId,
                    userId: userData.uid,
                    amount: booking.totalAmount,
                    type: 'booking',
                    status: 'completed',
                    paymentMethod: paymentMethod,
                    description: `Booking for ${booking.roomName}`,
                    createdAt: serverTimestamp(),
                    completedAt: serverTimestamp()
                };
                await addDoc(collection(db, 'transactions'), transactionData);
                // Update room availability (optional - if you track room availability)
                try {
                    if (typeof booking.roomType === 'string' && booking.roomType) {
                        const roomRef = doc(db, 'rooms', String(booking.roomType));
                        const roomDoc = await getDoc(roomRef);
                        if (roomDoc.exists()) {
                            const roomData = roomDoc.data();
                            const currentBookings = Array.isArray(roomData.bookings) ? roomData.bookings : [];
                            const updatedBookings = [...currentBookings, {
                                    bookingId: booking.bookingId,
                                    checkIn: booking.checkIn,
                                    checkOut: booking.checkOut,
                                    guests: booking.guests
                                }];
                            await updateDoc(roomRef, {
                                bookings: updatedBookings,
                                lastBooked: serverTimestamp()
                            });
                        }
                    }
                }
                catch (roomError) {
                    console.warn('Room update failed:', roomError);
                    // Don't fail the entire booking if room update fails
                }
                // Update booking state with the new document ID
                setBooking({ ...bookingDataWithPayment, id: bookingDocRef.id });
            }
            else {
                // OLD FLOW: Update existing booking payment status
                if (typeof booking.id === 'string' && booking.id) {
                    const bookingRef = doc(db, 'bookings', String(booking.id));
                    await updateDoc(bookingRef, {
                        paymentStatus: 'paid',
                        paymentMethod: paymentMethod,
                        paymentDetails: {
                            gcashNumber: paymentMethod === 'gcash' ? gcashNumber : null,
                            gcashName: paymentMethod === 'gcash' ? gcashName : null,
                            cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) : null,
                            cardholderName: paymentMethod === 'card' ? cardholderName : null,
                            paidAt: serverTimestamp()
                        },
                        updatedAt: serverTimestamp()
                    });
                }
                // Update transaction status
                const transactionsQuery = query(collection(db, 'transactions'), where('bookingId', '==', booking.bookingId), where('userId', '==', userData.uid));
                const transactionSnapshot = await getDocs(transactionsQuery);
                if (!transactionSnapshot.empty) {
                    const transactionDoc = transactionSnapshot.docs[0];
                    const transactionRef = doc(db, 'transactions', transactionDoc.id);
                    await updateDoc(transactionRef, {
                        status: 'completed',
                        paymentMethod: paymentMethod,
                        completedAt: serverTimestamp()
                    });
                }
            }
            // Clear pending booking data from sessionStorage after successful payment
            sessionStorage.removeItem('pendingBooking');
            // Send email receipt
            await sendEmailReceipt(booking, userData);
            // Show success modal
            setShowSuccessModal(true);
        }
        catch (err) {
            console.error('Payment failed:', err);
            setError('Payment failed. Please try again.');
        }
        finally {
            setProcessing(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-heritage-green" }), _jsx("p", { className: "font-medium text-heritage-green", children: "Loading booking details..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "mb-4 font-medium text-red-600", children: error }), _jsx("button", { onClick: () => navigate('/'), className: "px-6 py-3 text-white transition-colors bg-heritage-green rounded-xl hover:bg-heritage-neutral", children: "Return to Home" })] }) }));
    }
    // If booking is still null (no data found), show a friendly message
    if (!booking) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "mb-4 text-lg font-medium text-slate-700", children: "No booking information available." }), _jsx("button", { onClick: () => navigate('/'), className: "px-6 py-3 text-white transition-colors bg-heritage-green rounded-xl hover:bg-heritage-neutral", children: "Return to Home" })] }) }));
    }
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 sm:pt-24", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 blur-3xl animate-pulse" }), _jsx("div", { className: "absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl animate-pulse", style: { animationDelay: '2s' } }), _jsx("div", { className: "absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-2xl animate-pulse", style: { animationDelay: '4s' } })] }), _jsxs("div", { className: "relative z-10 py-8 sm:py-12", children: [_jsxs("div", { className: "max-w-6xl px-4 mx-auto sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8 sm:mb-12 md:mb-16 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl hover:scale-110", children: _jsx("svg", { className: "w-8 h-8 sm:w-10 sm:h-10 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }) }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsx("h1", { className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-transparent bg-gradient-to-r from-slate-900 via-heritage-green to-emerald-600 bg-clip-text px-4", children: "Complete Your Payment" }), _jsxs("p", { className: "max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 px-4", children: ["Secure your luxury stay at ", _jsx("span", { className: "font-semibold text-heritage-green", children: "Balay Ginhawa" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 px-4", children: [_jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 gap-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Secure Payment" })] }), _jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 gap-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("svg", { className: "w-4 h-4 text-heritage-green flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "SSL Encrypted" })] }), _jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 gap-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("svg", { className: "w-4 h-4 text-heritage-green flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "PCI Compliant" })] })] }), _jsxs("div", { className: "mt-6 sm:mt-8", children: [_jsx("p", { className: "text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 font-medium", children: "We Accept" }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6", children: [_jsx("div", { className: "flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-lg shadow-md border border-gray-200", children: _jsx("span", { className: "text-sm sm:text-base font-bold text-blue-600", children: "GCash" }) }), _jsx("div", { className: "flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-lg shadow-md border border-gray-200", children: _jsx("span", { className: "text-sm sm:text-base font-bold text-blue-700", children: "VISA" }) }), _jsx("div", { className: "flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-lg shadow-md border border-gray-200", children: _jsx("span", { className: "text-sm sm:text-base font-bold text-red-600", children: "Mastercard" }) }), _jsx("div", { className: "flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-lg shadow-md border border-gray-200", children: _jsx("span", { className: "text-sm sm:text-base font-bold text-blue-800", children: "PayPal" }) })] })] })] }), error && error.includes('incomplete booking') && (_jsx("div", { className: "max-w-4xl mx-auto mb-8", children: _jsx("div", { className: "p-6 border shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-2xl", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "mb-2 text-lg font-bold text-amber-800", children: "Booking Recovery" }), _jsx("p", { className: "mb-3 text-amber-700", children: error }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-amber-600", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("span", { children: "This booking will expire in 30 minutes from creation" })] })] }), _jsx("button", { onClick: () => setError(''), className: "flex-shrink-0 transition-colors text-amber-400 hover:text-amber-600", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }) })), _jsx("div", { className: "max-w-4xl mx-auto", children: _jsx("div", { className: "overflow-hidden border shadow-2xl bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border-heritage-green/20", children: _jsxs("div", { className: "grid lg:grid-cols-5 gap-0 min-h-[600px]", children: [_jsx("div", { className: "flex flex-col p-4 sm:p-6 md:p-8 lg:col-span-3", children: _jsxs("div", { className: "flex-grow space-y-6 sm:space-y-8", children: [_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("h2", { className: "flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold text-gray-900", children: [_jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-heritage-green flex-shrink-0", children: "1" }), _jsx("span", { children: "Choose Payment Method" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: `block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${paymentMethod === 'gcash'
                                                                                ? 'border-heritage-green bg-heritage-green/5 shadow-md'
                                                                                : 'border-gray-200 hover:border-heritage-green/50'}`, children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'gcash'
                                                                                                ? 'border-heritage-green bg-heritage-green'
                                                                                                : 'border-gray-300'}`, children: paymentMethod === 'gcash' && (_jsx("svg", { className: "w-4 h-4 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) }), _jsxs("div", { className: "flex items-center justify-between flex-1", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "GCash" }), _jsx("p", { className: "text-sm text-gray-600", children: "Pay securely with your GCash account" })] }), _jsx("div", { className: "flex items-center justify-center w-16 h-10 bg-blue-600 rounded-lg", children: _jsx("span", { className: "text-sm font-bold text-white", children: "GCash" }) })] })] }), _jsx("input", { type: "radio", name: "paymentMethod", value: "gcash", checked: paymentMethod === 'gcash', onChange: () => setPaymentMethod('gcash'), className: "sr-only" })] }), _jsxs("label", { className: `block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${paymentMethod === 'card'
                                                                                ? 'border-heritage-green bg-heritage-green/5 shadow-md'
                                                                                : 'border-gray-200 hover:border-heritage-green/50'}`, children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card'
                                                                                                ? 'border-heritage-green bg-heritage-green'
                                                                                                : 'border-gray-300'}`, children: paymentMethod === 'card' && (_jsx("svg", { className: "w-4 h-4 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) }), _jsxs("div", { className: "flex items-center justify-between flex-1", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Credit/Debit Card" }), _jsx("p", { className: "text-sm text-gray-600", children: "Visa, Mastercard, or other major cards" })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-6 bg-blue-600 rounded", children: _jsx("span", { className: "text-xs font-bold text-white", children: "V" }) }), _jsx("div", { className: "flex items-center justify-center w-8 h-6 bg-red-600 rounded", children: _jsx("span", { className: "text-xs font-bold text-white", children: "M" }) })] })] })] }), _jsx("input", { type: "radio", name: "paymentMethod", value: "card", checked: paymentMethod === 'card', onChange: () => setPaymentMethod('card'), className: "sr-only" })] })] })] }), _jsxs("div", { className: "pt-8 space-y-6 border-t border-gray-100", children: [_jsxs("h2", { className: "flex items-center space-x-3 text-2xl font-bold text-gray-900", children: [_jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-heritage-green", children: "2" }), _jsx("span", { children: "Payment Details" })] }), paymentMethod === 'gcash' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "GCash Mobile Number" }), _jsx("input", { type: "tel", value: gcashNumber, onChange: (e) => setGcashNumber(e.target.value), placeholder: "09XXXXXXXXX", className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "Account Holder Name" }), _jsx("input", { type: "text", value: gcashName, onChange: (e) => setGcashName(e.target.value), placeholder: "Full Name as registered in GCash", className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] })] })), paymentMethod === 'card' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "Card Number" }), _jsx("input", { type: "text", value: cardNumber, onChange: (e) => {
                                                                                        // Format card number with spaces
                                                                                        const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                                                                                        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                                                        if (formattedValue.length <= 19) { // Max length for formatted card number
                                                                                            setCardNumber(formattedValue);
                                                                                        }
                                                                                    }, placeholder: "1234 5678 9012 3456", className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "Expiry Date" }), _jsx("input", { type: "text", value: expiryDate, onChange: (e) => {
                                                                                                // Format expiry date MM/YY
                                                                                                const value = e.target.value.replace(/\D/g, '');
                                                                                                if (value.length <= 4) {
                                                                                                    const formattedValue = value.length >= 2 ?
                                                                                                        `${value.slice(0, 2)}/${value.slice(2)}` : value;
                                                                                                    setExpiryDate(formattedValue);
                                                                                                }
                                                                                            }, placeholder: "MM/YY", maxLength: 5, className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "CVV" }), _jsx("input", { type: "text", value: cvv, onChange: (e) => {
                                                                                                // Only allow numbers and limit to 4 digits
                                                                                                const value = e.target.value.replace(/\D/g, '');
                                                                                                if (value.length <= 4) {
                                                                                                    setCvv(value);
                                                                                                }
                                                                                            }, placeholder: "123", maxLength: 4, className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-semibold text-heritage-green", children: "Cardholder Name" }), _jsx("input", { type: "text", value: cardholderName, onChange: (e) => setCardholderName(e.target.value), placeholder: "Full Name on Card", className: "w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", required: true })] })] }))] })] }) }), _jsx("div", { className: "flex flex-col p-8 border-l lg:col-span-2 bg-gradient-to-br from-heritage-green/5 to-heritage-light/10 border-heritage-green/10", children: _jsxs("div", { className: "flex-grow space-y-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Booking Summary" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-heritage-green/10", children: [_jsx("span", { className: "font-medium text-heritage-neutral", children: "Booking ID:" }), _jsx("span", { className: "font-semibold text-gray-900", children: booking.bookingId })] }), _jsxs("div", { className: "flex items-center justify-between py-2 border-b border-heritage-green/10", children: [_jsx("span", { className: "font-medium text-heritage-neutral", children: "Room:" }), _jsx("span", { className: "font-semibold text-gray-900", children: booking.roomName })] }), _jsxs("div", { className: "flex items-center justify-between py-2 border-b border-heritage-green/10", children: [_jsx("span", { className: "font-medium text-heritage-neutral", children: "Check-in:" }), _jsx("span", { className: "font-semibold text-gray-900", children: booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A' })] }), _jsxs("div", { className: "flex items-center justify-between py-2 border-b border-heritage-green/10", children: [_jsx("span", { className: "font-medium text-heritage-neutral", children: "Check-out:" }), _jsx("span", { className: "font-semibold text-gray-900", children: booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A' })] }), _jsxs("div", { className: "flex items-center justify-between py-2 border-b border-heritage-green/10", children: [_jsx("span", { className: "font-medium text-heritage-neutral", children: "Guests:" }), _jsx("span", { className: "font-semibold text-gray-900", children: booking.guests ?? 'N/A' })] }), _jsxs("div", { className: "flex items-center justify-between py-2 border-b border-heritage-green/10", children: [_jsx("span", { className: "font-medium text-heritage-neutral", children: "Nights:" }), _jsx("span", { className: "font-semibold text-gray-900", children: booking.nights ?? 'N/A' })] })] }), typeof booking.subtotal === 'number' && typeof booking.tax === 'number' && (_jsxs("div", { className: "p-4 border bg-white/80 rounded-xl border-heritage-green/20", children: [_jsx("h4", { className: "mb-3 font-bold text-gray-900", children: "Payment Breakdown" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "text-gray-600", children: ["Room Rate (", booking.nights ?? 0, " nights \u00D7 \u20B1", booking.roomPricePerNight?.toLocaleString() || '0', "):"] }), _jsxs("span", { children: ["\u20B1", (booking.subtotal ?? 0).toLocaleString()] })] }), (booking.guests ?? 0) > (booking.baseGuests ?? 0) && (_jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsxs("span", { children: ["\u2022 Base: \u20B1", booking.basePrice?.toLocaleString() || '0', " (", booking.baseGuests ?? 0, " guests)"] }), _jsx("span", {})] })), (booking.guests ?? 0) > (booking.baseGuests ?? 0) && (_jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsxs("span", { children: ["\u2022 Extra guests: ", (booking.guests ?? 0) - (booking.baseGuests ?? 0), " \u00D7 \u20B1", booking.additionalGuestPrice?.toLocaleString() || '0'] }), _jsx("span", {})] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Tax (12% VAT):" }), _jsxs("span", { children: ["\u20B1", booking.tax.toLocaleString()] })] }), _jsx("div", { className: "pt-2 mt-3 border-t border-heritage-green/20", children: _jsxs("div", { className: "flex justify-between font-bold", children: [_jsx("span", { children: "Total Amount:" }), _jsxs("span", { className: "text-heritage-green", children: ["\u20B1", (booking.totalAmount ?? 0).toLocaleString()] })] }) })] })] })), error && (_jsx("div", { className: "p-4 mb-4 border border-red-200 rounded-lg bg-red-50", children: _jsx("p", { className: "text-sm text-red-700", children: error }) })), _jsxs("div", { className: "pt-4 mt-6", children: [_jsxs("div", { className: "mb-4 text-center", children: [_jsxs("span", { className: "text-2xl font-bold text-heritage-green", children: ["\u20B1", (booking.totalAmount ?? 0).toLocaleString()] }), _jsx("p", { className: "text-sm text-gray-600", children: "Total Amount to Pay" })] }), _jsx("button", { onClick: handlePayment, disabled: processing || !isFormValid(), className: `w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg ${processing || !isFormValid()
                                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                        : 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white hover:from-heritage-neutral hover:to-heritage-green hover:shadow-xl transform hover:-translate-y-1'}`, children: processing ? (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("div", { className: "w-5 h-5 border-b-2 border-white rounded-full animate-spin" }), _jsx("span", { children: "Processing Payment..." })] })) : (`Pay Now • ₱${(booking.totalAmount ?? 0).toLocaleString()}`) })] }), _jsxs("div", { className: "space-y-2 text-sm text-center text-gray-600", children: [_jsx("p", { children: "\uD83D\uDD12 Your payment is secured with 256-bit SSL encryption" }), _jsx("p", { children: "\uD83D\uDCB3 We accept all major payment methods" })] })] }) })] }) }) })] }), showSuccessModal && createPortal(_jsx("div", { className: "fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-xl p-16 mx-5 text-center transition-all duration-300 ease-out transform bg-white shadow-2xl rounded-2xl ring-1 ring-black/5", children: [_jsx("button", { onClick: handleSuccessModalClose, "aria-label": "Close", className: "absolute inline-flex items-center justify-center text-gray-500 bg-white rounded-full shadow-sm top-4 right-4 w-9 h-9 hover:bg-gray-50", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }), _jsx("div", { className: "flex items-center justify-center w-20 h-20 mx-auto mb-4 -mt-10 rounded-full shadow-lg bg-emerald-500", children: _jsx("svg", { className: "w-10 h-10 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }) }) }), _jsx("h3", { className: "mb-1 text-2xl font-extrabold text-gray-900", children: "Payment Successful!" }), _jsx("p", { className: "mb-4 text-sm text-gray-600", children: "Your booking has been confirmed." }), _jsxs("p", { className: "mb-6 text-xs text-gray-500", children: ["A receipt has been sent to ", _jsx("span", { className: "font-medium", children: userData?.email })] }), _jsx("div", { className: "p-4 mb-6 text-left border border-gray-100 rounded-xl bg-gray-50", children: _jsxs("div", { className: "grid grid-cols-2 text-sm text-gray-700 gap-y-2 gap-x-4", children: [_jsx("div", { className: "col-span-1", children: "Booking ID" }), _jsx("div", { className: "col-span-1 font-medium break-all text-emerald-600", children: booking?.bookingId ?? '—' }), _jsx("div", { className: "col-span-1", children: "Room" }), _jsx("div", { className: "col-span-1 font-medium", children: booking?.roomName ?? '—' }), _jsx("div", { className: "col-span-1", children: "Total Paid" }), _jsxs("div", { className: "col-span-1 font-bold text-emerald-600", children: ["\u20B1", (booking?.totalAmount ?? 0).toLocaleString()] })] }) }), _jsx("button", { onClick: handleSuccessModalClose, className: "w-full px-6 py-3 text-sm font-semibold text-white transition-colors rounded-lg shadow-md bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700", children: "Continue to Home" })] }) }), document.body)] })] }));
};
