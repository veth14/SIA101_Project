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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-heritage-green"></div>
          <p className="font-medium text-heritage-green">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20">
        <div className="text-center">
          <p className="mb-4 font-medium text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 text-white transition-colors bg-heritage-green rounded-xl hover:bg-heritage-neutral"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 pt-32 pb-12">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          {/* Hero Header Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl hover:scale-110">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-tight text-transparent md:text-6xl bg-gradient-to-r from-slate-900 via-heritage-green to-emerald-600 bg-clip-text">
                Complete Your Payment
              </h1>
              <p className="max-w-2xl mx-auto text-xl leading-relaxed text-slate-600">
                Secure your luxury stay at <span className="font-semibold text-heritage-green">Balay Ginhawa</span>
              </p>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center mt-8 space-x-8">
              <div className="flex items-center px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700">Secure Payment</span>
              </div>
              <div className="flex items-center px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20">
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
              <div className="p-6 border shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold text-amber-800">Booking Recovery</h3>
                    <p className="mb-3 text-amber-700">{error}</p>
                    <div className="flex items-center space-x-2 text-sm text-amber-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>This booking will expire in 30 minutes from creation</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="flex-shrink-0 transition-colors text-amber-400 hover:text-amber-600"
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
          <div className="overflow-hidden border shadow-2xl bg-white/90 backdrop-blur-md rounded-3xl border-heritage-green/20">
            <div className="grid lg:grid-cols-5 gap-0 min-h-[600px]">
              
              {/* Left: Payment Form */}
              <div className="flex flex-col p-8 lg:col-span-3">
                <div className="flex-grow space-y-8">
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-6">
                    <h2 className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-heritage-green">1</div>
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
                          <div className="flex items-center justify-between flex-1">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">GCash</h3>
                              <p className="text-sm text-gray-600">Pay securely with your GCash account</p>
                            </div>
                            <div className="flex items-center justify-center w-16 h-10 bg-blue-600 rounded-lg">
                              <span className="text-sm font-bold text-white">GCash</span>
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
                          <div className="flex items-center justify-between flex-1">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Credit/Debit Card</h3>
                              <p className="text-sm text-gray-600">Visa, Mastercard, or other major cards</p>
                            </div>
                            <div className="flex space-x-2">
                              <div className="flex items-center justify-center w-8 h-6 bg-blue-600 rounded">
                                <span className="text-xs font-bold text-white">V</span>
                              </div>
                              <div className="flex items-center justify-center w-8 h-6 bg-red-600 rounded">
                                <span className="text-xs font-bold text-white">M</span>
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
                  <div className="pt-8 space-y-6 border-t border-gray-100">
                    <h2 className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-heritage-green">2</div>
                      <span>Payment Details</span>
                    </h2>

                    {paymentMethod === 'gcash' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-semibold text-heritage-green">GCash Mobile Number</label>
                          <input
                            type="tel"
                            value={gcashNumber}
                            onChange={(e) => setGcashNumber(e.target.value)}
                            placeholder="09XXXXXXXXX"
                            className="w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-semibold text-heritage-green">Account Holder Name</label>
                          <input
                            type="text"
                            value={gcashName}
                            onChange={(e) => setGcashName(e.target.value)}
                            placeholder="Full Name as registered in GCash"
                            className="w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-semibold text-heritage-green">Card Number</label>
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
                            className="w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-heritage-green">Expiry Date</label>
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
                              className="w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-heritage-green">CVV</label>
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
                              className="w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-semibold text-heritage-green">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Full Name on Card"
                            className="w-full px-4 py-3 font-medium transition-all duration-300 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Booking Summary */}
              <div className="flex flex-col p-8 border-l lg:col-span-2 bg-gradient-to-br from-heritage-green/5 to-heritage-light/10 border-heritage-green/10">
                <div className="flex-grow space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Booking Summary</h3>
                                    <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-heritage-green/10">
                      <span className="font-medium text-heritage-neutral">Booking ID:</span>
                      <span className="font-semibold text-gray-900">{booking.bookingId}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-heritage-green/10">
                      <span className="font-medium text-heritage-neutral">Room:</span>
                      <span className="font-semibold text-gray-900">{booking.roomName}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-heritage-green/10">
                      <span className="font-medium text-heritage-neutral">Check-in:</span>
                      <span className="font-semibold text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-heritage-green/10">
                      <span className="font-medium text-heritage-neutral">Check-out:</span>
                      <span className="font-semibold text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-heritage-green/10">
                      <span className="font-medium text-heritage-neutral">Guests:</span>
                      <span className="font-semibold text-gray-900">{booking.guests}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-heritage-green/10">
                      <span className="font-medium text-heritage-neutral">Nights:</span>
                      <span className="font-semibold text-gray-900">{booking.nights}</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  {booking.subtotal && booking.tax && (
                    <div className="p-4 border bg-white/80 rounded-xl border-heritage-green/20">
                      <h4 className="mb-3 font-bold text-gray-900">Payment Breakdown</h4>
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
                        <div className="pt-2 mt-3 border-t border-heritage-green/20">
                          <div className="flex justify-between font-bold">
                            <span>Total Amount:</span>
                            <span className="text-heritage-green">₱{booking.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 mb-4 border border-red-200 rounded-lg bg-red-50">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="pt-4 mt-6">
                    <div className="mb-4 text-center">
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
                          <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        `Pay Now • ₱${booking.totalAmount.toLocaleString()}`
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-center text-gray-600">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 mx-4 text-center bg-white rounded-2xl">
            {/* Success Icon */}
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-heritage-green">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Success Message */}
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="mb-2 text-gray-600">Your booking has been confirmed.</p>
            <p className="mb-6 text-sm text-gray-500">
              A receipt has been sent to <span className="font-medium">{userData?.email}</span>
            </p>
            
            {/* Booking Details */}
            <div className="p-4 mb-6 text-left rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Booking ID:</span>
                <span className="font-medium text-heritage-green">{booking?.bookingId}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Room:</span>
                <span className="font-medium">{booking?.roomName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Paid:</span>
                <span className="font-bold text-heritage-green">₱{booking?.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={handleSuccessModalClose}
              className="w-full px-6 py-3 font-medium text-white transition-colors rounded-lg bg-heritage-green hover:bg-heritage-dark"
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
