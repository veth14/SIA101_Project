import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

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

  // Room type mapping for pre-selection
  const roomTypeMapping: { [key: string]: string } = {
    'deluxe-suite': 'deluxe',
    'family-room': 'family',
    'standard-room': 'standard'
  };

  // Scroll to top and handle room pre-selection when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check for roomId in URL parameters
    const urlParams = new URLSearchParams(location.search);
    const roomId = urlParams.get('roomId');
    
    if (roomId && roomTypeMapping[roomId]) {
      setFormData(prev => ({
        ...prev,
        roomType: roomTypeMapping[roomId]
      }));
    }
  }, [location.search]);

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Check if dates overlap with existing bookings
  const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    const start2 = new Date(checkIn2);
    const end2 = new Date(checkOut2);

    // Check if dates overlap (including touching dates)
    return start1 < end2 && start2 < end1;
  };

  // Check room availability for selected dates
  const checkRoomAvailability = async (roomType: string, checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return;

    setAvailabilityChecking(true);
    setAvailabilityMessage('');

    try {
      // Query bookings for the selected room type
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('roomType', '==', roomType),
        where('status', 'in', ['confirmed', 'checked-in'])
      );

      const querySnapshot = await getDocs(bookingsQuery);
      const existingBookings = querySnapshot.docs.map(doc => doc.data());

      // Check for date conflicts
      for (const booking of existingBookings) {
        if (checkDateOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)) {
          const conflictStart = new Date(booking.checkIn).toLocaleDateString();
          const conflictEnd = new Date(booking.checkOut).toLocaleDateString();
          setAvailabilityMessage(`Room is already reserved from ${conflictStart} to ${conflictEnd}. Please select different dates.`);
          setAvailabilityChecking(false);
          return false;
        }
      }

      setAvailabilityMessage('✓ Room is available for selected dates');
      setAvailabilityChecking(false);
      return true;
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityMessage('Error checking availability. Please try again.');
      setAvailabilityChecking(false);
      return false;
    }
  };

  // Handle date changes and trigger availability check
  const handleDateChange = (field: 'checkIn' | 'checkOut', value: string) => {
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
  const handleRoomTypeChange = (roomType: string) => {
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
  }, [formData.checkIn, formData.checkOut, formData.roomType]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const totalAmount = calculateTotal(formData.roomType, formData.checkIn, formData.checkOut);
      const nights = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      
      // Generate unique booking ID
      const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

      // Create booking document
      const bookingData = {
        bookingId,
        userId: userData.uid,
        userEmail: userData.email,
        userName: userData.displayName || userData.email,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        roomType: formData.roomType,
        roomName: roomDetails[formData.roomType as keyof typeof roomDetails].name,
        guests: formData.guests,
        nights,
        totalAmount,
        status: 'confirmed',
        paymentStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add to bookings collection
      await addDoc(collection(db, 'bookings'), bookingData);

      // Create transaction record
      const transactionData = {
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        bookingId,
        userId: userData.uid,
        amount: totalAmount,
        type: 'booking',
        status: 'pending',
        paymentMethod: 'pending',
        description: `Booking for ${roomDetails[formData.roomType as keyof typeof roomDetails].name}`,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'transactions'), transactionData);

      // Update room availability (optional - if you track room availability)
      try {
        const roomRef = doc(db, 'rooms', formData.roomType);
        const roomDoc = await getDoc(roomRef);
        
        if (roomDoc.exists()) {
          const currentBookings = roomDoc.data().bookings || [];
          currentBookings.push({
            bookingId,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            guests: formData.guests
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

      // Success - scroll to top and redirect to payment page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigate(`/payment/${bookingId}`);
      }, 300);
      
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (roomType: string, checkIn: string, checkOut: string) => {
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const rates = {
      standard: 2500,
      deluxe: 3800,
      suite: 5500,
      family: 8000
    };

    return nights * (rates[roomType as keyof typeof rates] || rates.standard);
  };

  const roomDetails = {
    standard: {
      name: 'Silid Payapa – Standard Room',
      price: 2500,
      description: 'Cozy and simple, perfect for solo travelers or couples.',
      features: ['Free WiFi', 'Air Conditioning', 'Private Bathroom', 'Cable TV'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    deluxe: {
      name: 'Silid Marahuyo – Deluxe Room',
      price: 3800,
      description: 'Spacious with modern amenities, designed for comfort and relaxation.',
      features: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'City View', 'Work Desk'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    suite: {
      name: 'Silid Ginhawa – Suite Room',
      price: 5500,
      description: 'Features a living area, elegant interiors, and added privacy.',
      features: ['Free WiFi', 'Living Area', 'Kitchenette', 'Balcony', 'Premium Amenities'],
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
    },
    family: {
      name: 'Silid Haraya – Premium Family Suite',
      price: 8000,
      description: 'Large room with multiple beds, ideal for families or groups seeking both luxury and togetherness.',
      features: ['Free WiFi', 'Multiple Beds', 'Living Area', 'Family Amenities', 'Premium Service'],
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  };

  const selectedRoom = roomDetails[formData.roomType as keyof typeof roomDetails];
  const totalAmount = formData.checkIn && formData.checkOut ? 
    calculateTotal(formData.roomType, formData.checkIn, formData.checkOut) : 0;
  const nights = formData.checkIn && formData.checkOut ? 
    Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-heritage-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-heritage-light/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-heritage-green/10 text-heritage-green text-lg font-medium rounded-full border border-heritage-green/20 shadow-lg backdrop-blur-sm">
              Reserve Your Experience
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Book Your Stay at
            <span className="bg-gradient-to-r from-heritage-green via-heritage-neutral to-heritage-green bg-clip-text text-transparent block mt-2"> Balay Ginhawa</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Where <span className="text-heritage-green font-semibold">timeless Filipino traditions</span> embrace <span className="text-gray-900 font-semibold">modern luxury</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Unified Booking Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-heritage-green/20 overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Progress Steps */}
              <div className="bg-gradient-to-r from-heritage-green/10 via-heritage-neutral/10 to-heritage-green/10 px-8 py-6 border-b border-heritage-green/10">
                <div className="flex items-center justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <span className="font-semibold text-heritage-green">Dates</span>
                  </div>
                  <div className="w-16 h-0.5 bg-heritage-green/30"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <span className="font-semibold text-heritage-green">Room</span>
                  </div>
                  <div className="w-16 h-0.5 bg-heritage-green/30"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <span className="font-semibold text-heritage-green">Guests</span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-0">
                {/* Left: Form Sections */}
                <div className="lg:col-span-2 p-8 space-y-8">
                  {/* Dates Section */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-6 h-6 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                      <span>Select Your Dates</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-heritage-green mb-2">Check-in Date</label>
                        <input
                          type="date"
                          value={formData.checkIn}
                          min={getTodayDate()}
                          onChange={(e) => handleDateChange('checkIn', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-heritage-green mb-2">Check-out Date</label>
                        <input
                          type="date"
                          value={formData.checkOut}
                          min={formData.checkIn || getTodayDate()}
                          onChange={(e) => handleDateChange('checkOut', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-heritage-green/20 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300 font-medium"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Availability Message */}
                    {(availabilityChecking || availabilityMessage) && (
                      <div className={`p-4 rounded-xl border ${
                        availabilityMessage.includes('✓') 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : availabilityMessage.includes('reserved') || availabilityMessage.includes('Error')
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        {availabilityChecking ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            <span>Checking availability...</span>
                          </div>
                        ) : (
                          <span>{availabilityMessage}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Room Selection */}
                  <div className="space-y-6 border-t border-gray-100 pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-6 h-6 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                      <span>Choose Your Room</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(roomDetails).map(([key, room]) => (
                        <label
                          key={key}
                          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                            formData.roomType === key
                              ? 'border-heritage-green bg-heritage-green/5 shadow-md'
                              : 'border-gray-200 hover:border-heritage-green/50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                              formData.roomType === key
                                ? 'border-heritage-green bg-heritage-green'
                                : 'border-gray-300'
                            }`}>
                              {formData.roomType === key && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 leading-tight">{room.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                              <p className="text-xl font-bold text-heritage-green mt-2">₱{room.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span></p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="roomType"
                            value={key}
                            checked={formData.roomType === key}
                            onChange={() => handleRoomTypeChange(key)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Guests Section */}
                  <div className="space-y-6 border-t border-gray-100 pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-6 h-6 bg-heritage-green rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                      <span>Number of Guests</span>
                    </h2>
                    <div className="flex items-center justify-center space-x-6">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                        className="w-12 h-12 border-2 border-heritage-green/30 rounded-lg flex items-center justify-center hover:border-heritage-green hover:bg-heritage-green hover:text-white transition-all duration-300 text-heritage-green font-bold"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="text-center px-8">
                        <div className="text-3xl font-bold text-heritage-green">{formData.guests}</div>
                        <div className="text-sm text-gray-600">guests</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, guests: Math.min(8, prev.guests + 1) }))}
                        className="w-12 h-12 border-2 border-heritage-green/30 rounded-lg flex items-center justify-center hover:border-heritage-green hover:bg-heritage-green hover:text-white transition-all duration-300 text-heritage-green font-bold"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Booking Summary */}
                <div className="lg:col-span-1 bg-heritage-green/5 border-l border-heritage-green/10 p-8">
                  {selectedRoom ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedRoom.name}</h3>
                        <p className="text-heritage-green text-2xl font-bold">₱{selectedRoom.price.toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">per night</p>
                      </div>

                      <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                        <img 
                          src={selectedRoom.image} 
                          alt={selectedRoom.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Amenities</h4>
                        <div className="space-y-2">
                          {selectedRoom.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-heritage-green rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {formData.checkIn && formData.checkOut && (
                        <div className="bg-white/80 rounded-xl p-4 border border-heritage-green/20">
                          <h4 className="font-bold text-gray-900 mb-3">Booking Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Check-in:</span>
                              <span className="font-medium">{new Date(formData.checkIn).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Check-out:</span>
                              <span className="font-medium">{new Date(formData.checkOut).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Nights:</span>
                              <span className="font-medium">{nights}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Guests:</span>
                              <span className="font-medium">{formData.guests}</span>
                            </div>
                            <div className="border-t border-heritage-green/20 pt-2 mt-3">
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span className="text-heritage-green">₱{totalAmount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>Select a room to see details</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-heritage-green/5 px-8 py-6 border-t border-heritage-green/10">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-heritage-green text-white hover:bg-heritage-green/90 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Complete Booking • ₱${totalAmount.toLocaleString()}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
