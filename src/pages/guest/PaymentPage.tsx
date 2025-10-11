import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, updateDoc, serverTimestamp, query, collection, where, getDocs, addDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export const PaymentPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
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
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      const navigationState = location.state as any;
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
          } else {
            // Remove expired booking data
            sessionStorage.removeItem('pendingBooking');
          }
        } catch (err) {
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
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('bookingId', '==', bookingId),
          where('userId', '==', userData.uid)
        );
        
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
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
        setLoading(false);
      }
    };

    initializeBooking();
  }, [bookingId, userData?.uid, location.state]);

  // Email receipt function
  const sendEmailReceipt = async (bookingData: any, user: any) => {
    try {
      // In a real implementation, you would use a service like EmailJS, SendGrid, or Firebase Functions
      // For now, we'll simulate the email sending
      console.log('Sending email receipt to:', user.email);
      console.log('Booking details:', bookingData);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would make an API call to your email service
      // Example with EmailJS or similar service:
      // await emailService.send({
      //   to: user.email,
      //   subject: `Booking Confirmation - ${bookingData.bookingId}`,
      //   template: 'booking-receipt',
      //   data: bookingData
      // });
      
      console.log('Email receipt sent successfully');
    } catch (error) {
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
    } else if (paymentMethod === 'card') {
      return cardNumber.trim() !== '' && 
             expiryDate.trim() !== '' && 
             cvv.trim() !== '' && 
             cardholderName.trim() !== '';
    }
    return false;
  };

  const handlePayment = async () => {
    if (!booking || !userData?.uid) return;

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
      } else if (paymentMethod === 'card') {
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
          const roomRef = doc(db, 'rooms', booking.roomType);
          const roomDoc = await getDoc(roomRef);
          
          if (roomDoc.exists()) {
            const currentBookings = roomDoc.data().bookings || [];
            currentBookings.push({
              bookingId: booking.bookingId,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              guests: booking.guests
            });
            
            await updateDoc(roomRef, {
              bookings: currentBookings,
              lastBooked: serverTimestamp()
            });
          }
        } catch (roomError) {
          console.warn('Room update failed:', roomError);
          // Don't fail the entire booking if room update fails
        }

        // Update booking state with the new document ID
        setBooking({ ...bookingDataWithPayment, id: bookingDocRef.id });

      } else {
        // OLD FLOW: Update existing booking payment status
        const bookingRef = doc(db, 'bookings', booking.id);
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

        // Update transaction status
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('bookingId', '==', booking.bookingId),
          where('userId', '==', userData.uid)
        );
        
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
      
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green mx-auto mb-4"></div>
          <p className="text-heritage-green font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-neutral transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-900 via-heritage-green to-emerald-600 bg-clip-text text-transparent leading-tight">
                Complete Your Payment
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Secure your luxury stay at <span className="font-semibold text-heritage-green">Balay Ginhawa</span>
              </p>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-semibold text-slate-700">SSL Encrypted</span>
              </div>
            </div>
          </div>

          {/* Pending Booking Notification */}
          {error && error.includes('incomplete booking') && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-800 mb-2">Booking Recovery</h3>
                    <p className="text-amber-700 mb-3">{error}</p>
                    <div className="flex items-center space-x-2 text-sm text-amber-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>This booking will expire in 30 minutes from creation</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Payment Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-heritage-green/20 overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0 min-h-[600px]">
              
              {/* Left: Payment Form */}
              <div className="lg:col-span-3 p-8 flex flex-col">
                <div className="space-y-8 flex-grow">
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-6 h-6 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                      <span>Choose Payment Method</span>
                    </h2>
                    
                    <div className="space-y-4">
                      {/* GCash Option */}
                      <label className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                        paymentMethod === 'gcash'
                          ? 'border-heritage-green bg-heritage-green/5 shadow-md'
                          : 'border-gray-200 hover:border-heritage-green/50'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'gcash'
                              ? 'border-heritage-green bg-heritage-green'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'gcash' && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">GCash</h3>
                              <p className="text-sm text-gray-600">Pay securely with your GCash account</p>
                            </div>
                            <div className="w-16 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">GCash</span>
                            </div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="gcash"
                          checked={paymentMethod === 'gcash'}
                          onChange={() => setPaymentMethod('gcash')}
                          className="sr-only"
                        />
                      </label>

                      {/* Credit Card Option */}
                      <label className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                        paymentMethod === 'card'
                          ? 'border-heritage-green bg-heritage-green/5 shadow-md'
                          : 'border-gray-200 hover:border-heritage-green/50'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'card'
                              ? 'border-heritage-green bg-heritage-green'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'card' && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">Credit/Debit Card</h3>
                              <p className="text-sm text-gray-600">Visa, Mastercard, or other major cards</p>
                            </div>
                            <div className="flex space-x-2">
                              <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">V</span>
                              </div>
                              <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">M</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-6 border-t border-gray-100 pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-6 h-6 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                      <span>Payment Details</span>
                    </h2>

                    {paymentMethod === 'gcash' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-heritage-green mb-2">GCash Mobile Number</label>
                          <input
                            type="tel"
                            value={gcashNumber}
                            onChange={(e) => setGcashNumber(e.target.value)}
                            placeholder="09XXXXXXXXX"
                            className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-heritage-green mb-2">Account Holder Name</label>
                          <input
                            type="text"
                            value={gcashName}
                            onChange={(e) => setGcashName(e.target.value)}
                            placeholder="Full Name as registered in GCash"
                            className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-heritage-green mb-2">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => {
                              // Format card number with spaces
                              const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                              const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                              if (formattedValue.length <= 19) { // Max length for formatted card number
                                setCardNumber(formattedValue);
                              }
                            }}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-heritage-green mb-2">Expiry Date</label>
                            <input
                              type="text"
                              value={expiryDate}
                              onChange={(e) => {
                                // Format expiry date MM/YY
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) {
                                  const formattedValue = value.length >= 2 ? 
                                    `${value.slice(0, 2)}/${value.slice(2)}` : value;
                                  setExpiryDate(formattedValue);
                                }
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-heritage-green mb-2">CVV</label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => {
                                // Only allow numbers and limit to 4 digits
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) {
                                  setCvv(value);
                                }
                              }}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-heritage-green mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Full Name on Card"
                            className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Booking Summary */}
              <div className="lg:col-span-2 bg-gradient-to-br from-heritage-green/5 to-heritage-light/10 p-8 border-l border-heritage-green/10 flex flex-col">
                <div className="space-y-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900">Booking Summary</h3>
                                    <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-heritage-green/10">
                      <span className="text-heritage-neutral font-medium">Booking ID:</span>
                      <span className="font-semibold text-gray-900">{booking.bookingId}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-heritage-green/10">
                      <span className="text-heritage-neutral font-medium">Room:</span>
                      <span className="font-semibold text-gray-900">{booking.roomName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-heritage-green/10">
                      <span className="text-heritage-neutral font-medium">Check-in:</span>
                      <span className="font-semibold text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-heritage-green/10">
                      <span className="text-heritage-neutral font-medium">Check-out:</span>
                      <span className="font-semibold text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-heritage-green/10">
                      <span className="text-heritage-neutral font-medium">Guests:</span>
                      <span className="font-semibold text-gray-900">{booking.guests}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-heritage-green/10">
                      <span className="text-heritage-neutral font-medium">Nights:</span>
                      <span className="font-semibold text-gray-900">{booking.nights}</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  {booking.subtotal && booking.tax && (
                    <div className="bg-white/80 rounded-xl p-4 border border-heritage-green/20">
                      <h4 className="font-bold text-gray-900 mb-3">Payment Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Rate ({booking.nights} nights × ₱{booking.roomPricePerNight?.toLocaleString() || '0'}):</span>
                          <span>₱{booking.subtotal.toLocaleString()}</span>
                        </div>
                        {booking.guests > booking.baseGuests && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>• Base: ₱{booking.basePrice?.toLocaleString() || '0'} ({booking.baseGuests} guests)</span>
                            <span></span>
                          </div>
                        )}
                        {booking.guests > booking.baseGuests && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>• Extra guests: {booking.guests - booking.baseGuests} × ₱{booking.additionalGuestPrice?.toLocaleString() || '0'}</span>
                            <span></span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax (12% VAT):</span>
                          <span>₱{booking.tax.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-heritage-green/20 pt-2 mt-3">
                          <div className="flex justify-between font-bold">
                            <span>Total Amount:</span>
                            <span className="text-heritage-green">₱{booking.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="pt-4 mt-6">
                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-heritage-green">₱{booking.totalAmount.toLocaleString()}</span>
                      <p className="text-sm text-gray-600">Total Amount to Pay</p>
                    </div>
                    
                    <button 
                      onClick={handlePayment}
                      disabled={processing || !isFormValid()}
                      className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg ${
                        processing || !isFormValid()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white hover:from-heritage-neutral hover:to-heritage-green hover:shadow-xl transform hover:-translate-y-1'
                      }`}
                    >
                      {processing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        `Pay Now • ₱${booking.totalAmount.toLocaleString()}`
                      )}
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-600 space-y-2">
                    <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
                    <p>💳 We accept all major payment methods</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-heritage-green rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Success Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h3>
            <p className="text-gray-600 mb-2">Your booking has been confirmed.</p>
            <p className="text-sm text-gray-500 mb-6">
              A receipt has been sent to <span className="font-medium">{userData?.email}</span>
            </p>
            
            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Booking ID:</span>
                <span className="font-medium text-heritage-green">{booking?.bookingId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Room:</span>
                <span className="font-medium">{booking?.roomName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Paid:</span>
                <span className="font-bold text-heritage-green">₱{booking?.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={handleSuccessModalClose}
              className="w-full bg-heritage-green text-white py-3 px-6 rounded-lg font-medium hover:bg-heritage-dark transition-colors"
            >
              Continue to Home
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
