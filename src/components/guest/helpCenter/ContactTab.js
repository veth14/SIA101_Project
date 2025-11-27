import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Phone, MapPin, Clock, MessageSquare, AlertCircle, XCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { db } from '../../../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
export const ContactTab = ({ onNavigateToTab }) => {
    const { user } = useAuth();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [countdown, setCountdown] = useState(10);
    const [bookingRefError, setBookingRefError] = useState('');
    const [isValidatingBooking, setIsValidatingBooking] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        bookingReference: '',
        subject: '',
        message: ''
    });
    // Auto-fill form with user data if logged in
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.email) {
                const displayName = user.displayName || '';
                const nameParts = displayName.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                // Try to fetch phone number from Firestore user profile
                let phoneNumber = '';
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        phoneNumber = userData.phone || userData.phoneNumber || '';
                    }
                }
                catch (error) {
                    console.log('Could not fetch phone number:', error);
                }
                setFormData(prev => ({
                    ...prev,
                    firstName: firstName,
                    lastName: lastName,
                    email: user.email,
                    phone: phoneNumber
                }));
            }
        };
        fetchUserProfile();
    }, [user]);
    // Validate booking reference format (e.g., BK1761629662783i7bw7dtsz)
    const validateBookingReferenceFormat = (ref) => {
        if (!ref)
            return true; // Empty is okay if not required yet
        // Pattern: BK followed by timestamp and random string
        // Examples: BK1761629662783i7bw7dtsz, BK1234567890abcdefgh
        // Format: BK + numbers + alphanumeric characters (at least 10 chars total)
        const pattern = /^BK[0-9a-z]{10,}$/i;
        return pattern.test(ref);
    };
    // Check if booking reference exists in Firebase AND belongs to current user
    const checkBookingInFirebase = async (bookingRef) => {
        try {
            setIsValidatingBooking(true);
            if (!user?.uid) {
                return { exists: false, belongsToUser: false };
            }
            // Try to find booking in 'bookings' collection
            const bookingsRef = collection(db, 'bookings');
            const q = query(bookingsRef, where('bookingId', '==', bookingRef));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const bookingDoc = querySnapshot.docs[0];
                const bookingData = bookingDoc.data();
                // Check if booking belongs to current user
                const belongsToUser = bookingData.guestId === user.uid || bookingData.userId === user.uid;
                return { exists: true, belongsToUser };
            }
            // Also check 'reservations' collection if it exists
            const reservationsRef = collection(db, 'reservations');
            const q2 = query(reservationsRef, where('bookingReference', '==', bookingRef));
            const querySnapshot2 = await getDocs(q2);
            if (!querySnapshot2.empty) {
                const reservationDoc = querySnapshot2.docs[0];
                const reservationData = reservationDoc.data();
                // Check if reservation belongs to current user
                const belongsToUser = reservationData.guestId === user.uid || reservationData.userId === user.uid;
                return { exists: true, belongsToUser };
            }
            return { exists: false, belongsToUser: false };
        }
        catch (error) {
            console.error('Error checking booking reference:', error);
            return { exists: false, belongsToUser: false };
        }
        finally {
            setIsValidatingBooking(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Validate booking reference format on change
        if (name === 'bookingReference') {
            if (value && !validateBookingReferenceFormat(value)) {
                setBookingRefError('Invalid format. Expected: BK followed by alphanumeric characters');
            }
            else {
                setBookingRefError('');
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate booking reference for cancellation or modification requests
        if (formData.inquiryType === 'cancellation' || formData.inquiryType === 'modification') {
            // Booking reference is REQUIRED for these request types
            if (!formData.bookingReference || formData.bookingReference.trim() === '') {
                setBookingRefError('Booking reference is required for cancellation and modification requests.');
                return;
            }
            // First check format
            if (!validateBookingReferenceFormat(formData.bookingReference)) {
                setBookingRefError('Please enter a valid booking reference format (e.g., BK1761629662783i7bw7dtsz)');
                return;
            }
            // Then check if it exists in Firebase AND belongs to user
            const bookingCheck = await checkBookingInFirebase(formData.bookingReference);
            if (!bookingCheck.exists) {
                setBookingRefError('Booking reference not found. Please check your booking confirmation email.');
                return;
            }
            if (!bookingCheck.belongsToUser) {
                setBookingRefError('This booking does not belong to your account. You can only cancel your own bookings.');
                return;
            }
        }
        // Generate reference number
        const referenceNumber = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        try {
            // Save to Firebase contactRequests collection
            const contactRequestData = {
                userId: user?.uid || 'guest',
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                inquiryType: formData.inquiryType,
                bookingReference: formData.bookingReference || null,
                subject: formData.subject,
                message: formData.message,
                referenceNumber: referenceNumber,
                status: 'pending', // pending, in-progress, resolved, cancelled
                createdAt: serverTimestamp(),
                submittedAt: serverTimestamp() // Use serverTimestamp for consistency
            };
            console.log('Saving contact request to Firebase...', contactRequestData);
            const docRef = await addDoc(collection(db, 'contactRequests'), contactRequestData);
            console.log('✅ Contact request saved successfully! Document ID:', docRef.id);
            console.log('Reference Number:', referenceNumber);
            console.log('User ID:', user?.uid);
            // Store submitted data for modal display
            setSubmittedData({
                ...formData,
                submittedAt: new Date().toLocaleString(),
                referenceNumber: referenceNumber
            });
            // Reset countdown and show success modal
            setCountdown(10);
            setShowSuccessModal(true);
            setBookingRefError(''); // Clear any errors
            // Reset form (except auto-filled fields)
            setFormData(prev => ({
                ...prev,
                inquiryType: 'general',
                bookingReference: '',
                subject: '',
                message: ''
            }));
        }
        catch (error) {
            console.error('Error saving contact request:', error);
            alert('Failed to submit request. Please try again.');
        }
    };
    const closeModal = () => {
        setShowSuccessModal(false);
        setSubmittedData(null);
        setCountdown(10); // Reset countdown
        // Re-enable body scroll
        document.body.style.overflow = 'unset';
    };
    // Lock body scroll when modal is open
    useEffect(() => {
        if (showSuccessModal) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showSuccessModal]);
    // Auto-close timer with countdown
    useEffect(() => {
        if (showSuccessModal && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
        else if (showSuccessModal && countdown === 0) {
            closeModal();
        }
    }, [showSuccessModal, countdown]);
    return (_jsxs("div", { className: "space-y-8 animate-fade-in", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10", children: _jsx(Mail, { className: "w-6 h-6 text-heritage-green" }) }), _jsxs("div", { children: [_jsx("h2", { className: "mb-2 text-3xl font-black text-heritage-green", children: "Contact Us" }), _jsx("p", { className: "text-sm text-gray-600", children: "We're here to help 24/7" })] })] }), _jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [_jsxs("div", { className: "p-6 transition-all duration-300 border shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl border-white/60 hover:shadow-2xl hover:-translate-y-1", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-heritage-green/10", children: _jsx(MapPin, { className: "w-6 h-6 text-heritage-green" }) }), _jsx("h3", { className: "mb-3 text-lg font-bold text-heritage-green", children: "Hotel Address" }), _jsxs("div", { className: "space-y-1 text-sm text-gray-700", children: [_jsx("p", { className: "font-semibold", children: "Balay Ginhawa Hotel" }), _jsx("p", { children: "123 Heritage Street" }), _jsx("p", { children: "Manila, Philippines 1000" })] })] }), _jsxs("div", { className: "p-6 transition-all duration-300 border shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl border-white/60 hover:shadow-2xl hover:-translate-y-1", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-heritage-green/10", children: _jsx(Phone, { className: "w-6 h-6 text-heritage-green" }) }), _jsx("h3", { className: "mb-3 text-lg font-bold text-heritage-green", children: "Contact Information" }), _jsxs("div", { className: "space-y-1 text-sm text-gray-700", children: [_jsxs("p", { children: [_jsx("strong", { children: "Phone:" }), " +63 912 345 6789"] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " info@balayginhawa.com"] }), _jsxs("p", { children: [_jsx("strong", { children: "Cancellations:" }), " cancel@balayginhawa.com"] })] })] }), _jsxs("div", { className: "p-6 transition-all duration-300 border shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl border-white/60 hover:shadow-2xl hover:-translate-y-1", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-heritage-green/10", children: _jsx(Clock, { className: "w-6 h-6 text-heritage-green" }) }), _jsx("h3", { className: "mb-3 text-lg font-bold text-heritage-green", children: "Operating Hours" }), _jsxs("div", { className: "space-y-1 text-sm text-gray-700", children: [_jsxs("p", { children: [_jsx("strong", { children: "Front Desk:" }), " 24/7"] }), _jsxs("p", { children: [_jsx("strong", { children: "Support:" }), " 24/7"] }), _jsxs("p", { children: [_jsx("strong", { children: "Response Time:" }), " Within 24hrs"] })] })] })] }), _jsx("div", { className: "p-6 border-l-4 shadow-lg bg-red-50 border-red-500 rounded-xl", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx(XCircle, { className: "flex-shrink-0 w-6 h-6 text-red-500" }), _jsxs("div", { children: [_jsx("h3", { className: "mb-2 text-lg font-bold text-red-700", children: "Need to Cancel Your Booking?" }), _jsxs("p", { className: "mb-3 text-sm text-gray-700", children: ["Please review our ", _jsx("button", { onClick: () => onNavigateToTab?.('terms'), className: "font-semibold underline text-heritage-green hover:text-heritage-neutral", children: "cancellation policy" }), " before submitting a request. Select \"Cancellation Request\" below and provide your booking reference number."] }), _jsx("p", { className: "text-sm font-semibold text-red-600", children: "\u26A0\uFE0F Free cancellation available up to 48 hours before check-in" })] })] }) }), _jsxs("div", { className: "p-8 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60", children: [_jsxs("div", { className: "flex items-start gap-4 mb-6", children: [_jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10", children: _jsx(MessageSquare, { className: "w-6 h-6 text-heritage-green" }) }), _jsxs("div", { children: [_jsx("h2", { className: "mb-2 text-2xl font-black text-heritage-green", children: "Send Us a Message" }), _jsx("p", { className: "text-sm text-gray-600", children: "Fill out the form below and we'll get back to you within 24 hours" })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "inquiryType", className: "block mb-2 text-sm font-bold text-gray-700", children: "Inquiry Type *" }), _jsxs("select", { id: "inquiryType", name: "inquiryType", value: formData.inquiryType, onChange: handleInputChange, required: true, className: "w-full px-4 py-3 transition-all duration-300 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10", children: [_jsx("option", { value: "general", children: "General Inquiry" }), _jsx("option", { value: "cancellation", children: "Cancellation Request" }), _jsx("option", { value: "modification", children: "Booking Modification" }), _jsx("option", { value: "complaint", children: "Complaint" }), _jsx("option", { value: "feedback", children: "Feedback" }), _jsx("option", { value: "other", children: "Other" })] })] }), (formData.inquiryType === 'cancellation' || formData.inquiryType === 'modification') && (_jsxs("div", { className: "p-4 border-2 rounded-xl border-heritage-green/30 bg-heritage-green/5", children: [_jsx("label", { htmlFor: "bookingReference", className: "block mb-2 text-sm font-bold text-gray-700", children: "Booking Reference Number *" }), _jsx("input", { type: "text", id: "bookingReference", name: "bookingReference", value: formData.bookingReference, onChange: handleInputChange, required: true, placeholder: "e.g., BK1761629662783i7bw7dtsz", className: `w-full px-4 py-3 transition-all duration-300 border-2 rounded-xl focus:outline-none focus:ring-4 ${bookingRefError
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                                            : 'border-gray-200 focus:border-heritage-green focus:ring-heritage-green/10'}` }), bookingRefError ? (_jsxs("p", { className: "mt-2 text-xs font-semibold text-red-600", children: [_jsx(XCircle, { className: "inline w-4 h-4 mr-1" }), bookingRefError] })) : (_jsxs("p", { className: "mt-2 text-xs text-gray-600", children: [_jsx(AlertCircle, { className: "inline w-4 h-4 mr-1" }), "Enter your booking ID (starts with BK, found in your confirmation email)"] }))] })), _jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "firstName", className: "block mb-2 text-sm font-bold text-gray-700", children: ["First Name *", user && _jsx("span", { className: "ml-2 text-xs font-normal text-heritage-green", children: "(From your account)" })] }), _jsx("input", { type: "text", id: "firstName", name: "firstName", value: formData.firstName, onChange: handleInputChange, required: true, readOnly: !!user, placeholder: "John", className: `w-full px-4 py-3 transition-all duration-300 border-2 rounded-xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10 ${user ? 'bg-gray-50 border-gray-300 cursor-not-allowed' : 'border-gray-200'}` })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "lastName", className: "block mb-2 text-sm font-bold text-gray-700", children: ["Last Name *", user && _jsx("span", { className: "ml-2 text-xs font-normal text-heritage-green", children: "(From your account)" })] }), _jsx("input", { type: "text", id: "lastName", name: "lastName", value: formData.lastName, onChange: handleInputChange, required: true, readOnly: !!user, placeholder: "Doe", className: `w-full px-4 py-3 transition-all duration-300 border-2 rounded-xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10 ${user ? 'bg-gray-50 border-gray-300 cursor-not-allowed' : 'border-gray-200'}` })] })] }), _jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "email", className: "block mb-2 text-sm font-bold text-gray-700", children: ["Email Address *", user && _jsx("span", { className: "ml-2 text-xs font-normal text-heritage-green", children: "(From your account)" })] }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true, readOnly: !!user, placeholder: "john.doe@example.com", className: `w-full px-4 py-3 transition-all duration-300 border-2 rounded-xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10 ${user ? 'bg-gray-50 border-gray-300 cursor-not-allowed' : 'border-gray-200'}` })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "phone", className: "block mb-2 text-sm font-bold text-gray-700", children: ["Phone Number", user && formData.phone && _jsx("span", { className: "ml-2 text-xs font-normal text-heritage-green", children: "(From your account)" })] }), _jsx("input", { type: "tel", id: "phone", name: "phone", value: formData.phone, onChange: handleInputChange, readOnly: !!(user && formData.phone), placeholder: "+63 912 345 6789", className: `w-full px-4 py-3 transition-all duration-300 border-2 rounded-xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10 ${user && formData.phone ? 'bg-gray-50 border-gray-300 cursor-not-allowed' : 'border-gray-200'}` })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "subject", className: "block mb-2 text-sm font-bold text-gray-700", children: "Subject *" }), _jsx("input", { type: "text", id: "subject", name: "subject", value: formData.subject, onChange: handleInputChange, required: true, placeholder: formData.inquiryType === 'cancellation' ? 'Cancellation Request - [Your Booking Reference]' : 'How can we help you?', className: "w-full px-4 py-3 transition-all duration-300 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block mb-2 text-sm font-bold text-gray-700", children: "Message *" }), _jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: handleInputChange, required: true, rows: 6, placeholder: formData.inquiryType === 'cancellation'
                                            ? 'Please provide details about your cancellation request, including your check-in date and reason for cancellation...'
                                            : 'Tell us more about your inquiry...', className: "w-full px-4 py-3 transition-all duration-300 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10 resize-none" })] }), _jsx("button", { type: "submit", disabled: isValidatingBooking, className: `w-full px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg rounded-xl ${isValidatingBooking
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-heritage-green to-heritage-neutral hover:shadow-xl hover:scale-105'}`, children: isValidatingBooking ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 animate-spin" }), "Validating Booking..."] })) : (formData.inquiryType === 'cancellation' ? 'Submit Cancellation Request' : 'Send Message') })] })] }), _jsxs("div", { className: "p-6 text-center border shadow-xl bg-gradient-to-br from-heritage-green/5 via-white to-heritage-light/10 rounded-3xl border-heritage-green/20", children: [_jsx("h3", { className: "mb-3 text-xl font-bold text-heritage-green", children: "Need Immediate Assistance?" }), _jsx("p", { className: "mb-6 text-gray-700", children: "Our team is available 24/7 for urgent matters" }), _jsxs("div", { className: "flex flex-wrap justify-center gap-4", children: [_jsxs("a", { href: "tel:+639123456789", className: "px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-xl hover:shadow-xl hover:scale-105", children: [_jsx(Phone, { className: "inline w-5 h-5 mr-2" }), "Call Now: +63 912 345 6789"] }), _jsxs("a", { href: "mailto:info@balayginhawa.com", className: "px-6 py-3 font-bold transition-all duration-300 border-2 bg-white text-heritage-green border-heritage-green rounded-xl hover:bg-heritage-green hover:text-white", children: [_jsx(Mail, { className: "inline w-5 h-5 mr-2" }), "Email: info@balayginhawa.com"] })] })] }), showSuccessModal && submittedData && createPortal(_jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn", style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }, children: _jsxs("div", { className: "relative w-full max-w-xl overflow-hidden transition-all duration-300 transform bg-white shadow-2xl rounded-3xl animate-slideUp", children: [_jsxs("div", { className: "relative px-6 py-5 text-white bg-gradient-to-r from-heritage-green to-heritage-neutral", children: [_jsx("button", { onClick: closeModal, className: "absolute p-2 transition-all duration-200 rounded-full top-3 right-3 hover:bg-white/20 hover:scale-110", children: _jsx(X, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg", children: _jsx(CheckCircle, { className: "w-8 h-8 text-heritage-green" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: submittedData.inquiryType === 'cancellation' ? 'Cancellation Request Submitted!' : 'Message Sent Successfully!' }), _jsx("p", { className: "text-xs text-white/90", children: "We've received your request" })] })] })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "p-5 border-2 border-dashed rounded-2xl bg-heritage-green/5 border-heritage-green/30", children: [_jsx("p", { className: "mb-1 text-sm font-semibold text-gray-600", children: "Reference Number" }), _jsx("p", { className: "text-2xl font-bold tracking-wider text-heritage-green", children: submittedData.referenceNumber }), _jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Please save this reference number for tracking your request" })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("div", { className: "p-3 rounded-2xl bg-gray-50", children: [_jsx("p", { className: "mb-1 text-xs font-semibold text-gray-500", children: "Type" }), _jsx("p", { className: "text-sm font-semibold text-gray-800 capitalize", children: submittedData.inquiryType.replace('_', ' ') })] }), _jsxs("div", { className: "p-3 rounded-2xl bg-gray-50", children: [_jsx("p", { className: "mb-1 text-xs font-semibold text-gray-500", children: "Submitted" }), _jsx("p", { className: "text-sm font-semibold text-gray-800", children: submittedData.submittedAt })] }), submittedData.bookingReference && (_jsxs("div", { className: "p-3 border-l-4 rounded-r-2xl md:col-span-2 bg-amber-50 border-amber-500", children: [_jsx("p", { className: "mb-1 text-xs font-semibold text-amber-700", children: "Booking Ref" }), _jsx("p", { className: "text-sm font-bold text-amber-900", children: submittedData.bookingReference })] })), _jsxs("div", { className: "p-3 rounded-2xl md:col-span-2 bg-gray-50", children: [_jsx("p", { className: "mb-1 text-xs font-semibold text-gray-500", children: "Contact" }), _jsxs("p", { className: "text-sm text-gray-800", children: [submittedData.firstName, " ", submittedData.lastName, " \u2022 ", submittedData.email] })] })] }), _jsxs("div", { className: "p-4 border-2 rounded-2xl bg-gradient-to-br from-heritage-green/5 to-heritage-light/10 border-heritage-green/20", children: [_jsx("h3", { className: "mb-2 text-sm font-bold text-heritage-green", children: "What Happens Next?" }), _jsxs("ul", { className: "space-y-1.5 text-xs text-gray-700", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "flex-shrink-0 w-4 h-4 mt-0.5 text-heritage-green" }), _jsxs("span", { children: ["Confirmation email sent to ", _jsx("strong", { children: submittedData.email })] })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "flex-shrink-0 w-4 h-4 mt-0.5 text-heritage-green" }), _jsx("span", { children: "Response within 24 hours" })] }), submittedData.inquiryType === 'cancellation' && (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "flex-shrink-0 w-4 h-4 mt-0.5 text-amber-600" }), _jsx("span", { className: "font-semibold text-amber-700", children: "Free cancellation up to 48 hours before check-in" })] }))] })] }), _jsxs("button", { onClick: closeModal, className: "w-full px-6 py-3 text-sm font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-2xl hover:shadow-xl hover:scale-105", children: ["Close (Auto-closing in ", countdown, "s)"] })] })] }) }), document.body)] }));
};
