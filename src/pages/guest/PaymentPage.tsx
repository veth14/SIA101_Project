import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, updateDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export const PaymentPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [gcashNumber, setGcashNumber] = useState('');
  const [gcashName, setGcashName] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch booking data from Firebase
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !userData?.uid) {
        setError('Invalid booking or user not authenticated');
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

    fetchBooking();
  }, [bookingId, userData?.uid]);

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
    }
    return true; // For other payment methods, add validation as needed
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
      }

      // Update booking payment status
      const bookingRef = doc(db, 'bookings', booking.id);
      await updateDoc(bookingRef, {
        paymentStatus: 'paid',
        paymentMethod: paymentMethod,
        paymentDetails: {
          gcashNumber: paymentMethod === 'gcash' ? gcashNumber : null,
          gcashName: paymentMethod === 'gcash' ? gcashName : null,
          paidAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      });

      // Update transaction status
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('bookingId', '==', bookingId),
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
    <div className="min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-heritage-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-heritage-light/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-6xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-heritage-green/10 text-heritage-green text-lg font-medium rounded-full border border-heritage-green/20 shadow-lg backdrop-blur-sm">
              Secure Payment
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Complete Your
            <span className="bg-gradient-to-r from-heritage-green via-heritage-neutral to-heritage-green bg-clip-text text-transparent block mt-2"> Payment</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Secure your reservation at <span className="text-heritage-green font-semibold">Balay Ginhawa</span>
          </p>
        </div>

        {/* Payment Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-heritage-green/20 overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              
              {/* Left: Payment Form */}
              <div className="lg:col-span-3 p-8">
                <div className="space-y-8">
                  
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
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-heritage-green mb-2">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-heritage-green mb-2">Cardholder Name</label>
                          <input
                            type="text"
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
              <div className="lg:col-span-2 bg-gradient-to-br from-heritage-green/5 to-heritage-light/10 p-8 border-l border-heritage-green/10">
                <div className="space-y-6">
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

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="pt-4 mt-6 bg-heritage-green/5 rounded-xl p-4 border border-heritage-green/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                      <span className="text-3xl font-bold text-heritage-green">₱{booking.totalAmount.toLocaleString()}</span>
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
  );
};
