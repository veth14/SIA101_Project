import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// --- IMPORTED CONTEXT & TYPES ---
import {
  type BookingData,
  useRooms
} from './ReservationsContext';

// --- IMPORTED SHARED UTILS ---
import { 
  normalizeTypeKey, 
  checkDateOverlap 
} from './reservations.utils';

interface AvailableRoom {
  number: string;
  type: string;
  status?: string;
}

// --- PROPS ---
interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingData | null;
  onCheckIn: (updatedReservation: BookingData) => void;
}

// --- HELPER ---
const formatDate = (dateString: string) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// --- MAIN COMPONENT ---
export const CheckInModal = ({ isOpen, onClose, reservation, onCheckIn }: CheckInModalProps) => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [paymentReceived, setPaymentReceived] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [guestIdVerified, setGuestIdVerified] = useState(false);
  const [keyCardsIssued, setKeyCardsIssued] = useState(false);
  
  // Get rooms from context
  const { rooms: allRooms, loading: roomsLoading } = useRooms();
  // Local state for the filtered *available* rooms list
  const [filteredRooms, setFilteredRooms] = useState<AvailableRoom[]>([]);

  // State for our single availability query
  const [overlappingBookings, setOverlappingBookings] = useState<BookingData[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent background scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Prefill data
  useEffect(() => {
    if (!isOpen || !reservation) return;
    
    setSelectedRoom(reservation.roomNumber || '');
    setPaymentReceived(
      reservation.paymentStatus === 'paid' ? reservation.totalAmount : 0
    );
    setPaymentMethod(reservation.paymentMethod || 'cash');
    
    // Reset checklist
    setGuestIdVerified(false);
    setKeyCardsIssued(false);
    setNotes('');
    setErrors({});
    
  }, [isOpen, reservation]);

  // --- handleCheckIn ---
  const handleCheckIn = () => {
    const newErrors: Record<string, string> = {};
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

    const updatedReservation: BookingData = {
      ...reservation,
      // Ensure identifiers are preserved (do not overwrite with a new/random id)
      bookingId: reservation.bookingId,
      userId: reservation.userId,
      roomNumber: selectedRoom,
      status: 'checked-in',
      updatedAt: Timestamp.fromDate(now),
      paymentMethod: paymentMethod,
      paymentStatus: newPaymentStatus,
      paymentDetails: {
        ...reservation.paymentDetails,
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
        
        const q = query(
          collection(db, 'bookings'),
          where('status', 'in', ['confirmed', 'checked-in']),
          where('checkIn', '<', checkOut), 
          where('checkOut', '>', checkIn)
        );

        const snap = await getDocs(q);
        
        if (!mounted) return;

        const bookings = snap.docs
          .map(doc => ({ ...doc.data(), bookingId: doc.id } as BookingData))
          // Exclude the reservation we are *currently* checking in
          .filter(b => b.bookingId !== bookingId);

        setOverlappingBookings(bookings);

      } catch (err) {
        console.error("Error fetching overlapping bookings:", err);
        if (mounted) setOverlappingBookings([]);
      } finally {
        if (mounted) setIsCheckingAvailability(false);
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
    const candidateRooms = allRooms.filter(r => 
      normalizeTypeKey(r.roomType) === reservationTypeKey
    );

    const occupiedRoomNumbers = new Set<string>();
    for (const b of overlappingBookings) {
      if (!b.roomNumber) continue;
      // USED UTILITY
      const isOverlapping = checkDateOverlap(
        reservation.checkIn, reservation.checkOut,
        b.checkIn, b.checkOut
      );
      if (isOverlapping) {
        occupiedRoomNumbers.add(b.roomNumber);
      }
    }

    const availableRooms = candidateRooms.filter(room => {
      if (room.id === reservation.roomNumber) return true;
      if (room.status !== 'available' || room.isActive === false) return false;
      if (occupiedRoomNumbers.has(room.id)) return false;
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
    if (!isOpen || !reservation) return;
    if ((!selectedRoom || selectedRoom === '') && !reservation.roomNumber && filteredRooms.length > 0) {
      setSelectedRoom(filteredRooms[0].number);
    }
  }, [filteredRooms, isOpen, selectedRoom, reservation]);


  if (!isOpen || !reservation) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={onClose}
        aria-label="Close overlay"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] mx-6 overflow-hidden rounded-3xl bg-white/95 shadow-2xl border border-white/60 flex flex-col">
        
        {/* Header */}
        <div className="relative px-6 py-4 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-2xl shadow-sm bg-[#82A33D]">
                <IconKey />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">Guest Check-In</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Complete the check-in process. Booking ID: <span className="font-semibold text-gray-700">{reservation.bookingId}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 ring-1 ring-[#82A33D]/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 pb-8 overflow-y-auto flex-1 min-h-0 space-y-6 bg-gray-50/40">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* --- Left Column: Workflow --- */}
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1: Room Assignment */}
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 13l9-5" />
                  </svg>
                  Assign Room ({reservation.roomName})
                </h4>
                
                <div className="bg-blue-50/50 rounded-xl p-4 mb-4 border border-blue-100">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Select Available Room
                  </label>
                  <select
                    title="Room Assignment"
                    aria-label="Room Assignment"
                    value={selectedRoom}
                    onChange={(e) => {
                      setSelectedRoom(e.target.value);
                      setErrors(prev => ({ ...prev, room: '' }));
                    }}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] transition-all cursor-pointer ${errors.room ? 'border-red-300' : 'border-blue-200 hover:border-blue-300'}`}
                    disabled={roomsLoading || isCheckingAvailability}
                  >
                    <option value="">
                      {roomsLoading ? 'Loading rooms...' : 
                      isCheckingAvailability ? 'Checking availability...' : 
                      (filteredRooms.length > 0 ? 'Select a room...' : 'No rooms available')}
                    </option>
                    {filteredRooms.map((room) => (
                      <option key={room.number} value={room.number}>
                        Room {room.number}
                      </option>
                    ))}
                  </select>
                  {errors.room && <p className="text-red-500 text-xs mt-2 font-medium flex items-center"><span className="mr-1">⚠️</span> {errors.room}</p>}
                </div>
              </div>

              {/* Step 2: Payment */}
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Details
                </h4>
                
                <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl mb-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-500 mb-1">Total Amount</label>
                    <p className="text-2xl font-black text-gray-900">
                      ₱{reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-500 mb-1">Current Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      reservation.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${reservation.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Received Now</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                      <input
                        type="number"
                        value={paymentReceived}
                        onChange={(e) => setPaymentReceived(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm font-medium transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Method</label>
                    <select
                      title="Payment Method"
                      aria-label="Payment Method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm font-medium transition-all"
                    >
                      <option value="cash">Cash Payment</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="gcash">GCash / E-Wallet</option>
                    </select>
                  </div>
                </div>
                
                {remainingBalance > 0 && (
                  <div className="mt-5 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800">Remaining Balance:</span>
                    <span className="text-sm font-bold text-amber-900">₱{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              {/* Step 3: Final Checklist */}
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Final Checklist
                </h4>
                
                <div className="space-y-3">
                  <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${guestIdVerified ? 'bg-[#82A33D]/5 border-[#82A33D]/30' : 'bg-white border-gray-200 hover:border-[#82A33D]/30'}`}>
                    <input
                      type="checkbox"
                      checked={guestIdVerified}
                      onChange={(e) => {
                        setGuestIdVerified(e.target.checked);
                        setErrors(prev => ({ ...prev, checklist: '' }));
                      }}
                      className="h-5 w-5 text-[#82A33D] focus:ring-[#82A33D]/20 border-gray-300 rounded transition-all"
                    />
                    <div className="ml-3 flex flex-col">
                      <span className="text-sm font-bold text-gray-800">Guest ID Verified <span className="text-red-500">*</span></span>
                      <span className="text-xs text-gray-500">Confirm guest identity matches booking details</span>
                    </div>
                  </label>
                  {errors.checklist && <p className="text-red-500 text-xs ml-2 font-medium">{errors.checklist}</p>}
                  
                  <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${keyCardsIssued ? 'bg-[#82A33D]/5 border-[#82A33D]/30' : 'bg-white border-gray-200 hover:border-[#82A33D]/30'}`}>
                    <input
                      type="checkbox"
                      checked={keyCardsIssued}
                      onChange={(e) => setKeyCardsIssued(e.target.checked)}
                      className="h-5 w-5 text-[#82A33D] focus:ring-[#82A33D]/20 border-gray-300 rounded transition-all"
                    />
                    <span className="ml-3 text-sm font-bold text-gray-800">Key Cards Issued</span>
                  </label>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Staff Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all placeholder:text-gray-400"
                      placeholder="Add any special requests or notes here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Column: Summary --- */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Guest Summary */}
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="ml-2">Guest Profile</span>
                </h4>
                
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-lg bg-[#82A33D]/10 flex items-center justify-center text-xl font-bold text-[#82A33D] mb-2 shadow-inner">
                    {reservation.userName?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <p className="text-lg font-bold text-gray-900 text-center">{reservation.userName}</p>
                  <p className="text-sm text-gray-500 text-center truncate w-full" title={reservation.userEmail}>{reservation.userEmail}</p>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2">Booking Summary</span>
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase">Check-in</label>
                    <p className="text-sm font-bold text-gray-900">{formatDate(reservation.checkIn)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase">Check-out</label>
                    <p className="text-sm font-bold text-gray-900">{formatDate(reservation.checkOut)}</p>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Guests</span>
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{reservation.guests}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100 rounded-b-3xl">
          <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white/80 rounded-2xl shadow-sm hover:bg-gray-50 transition transform"
              title="Cancel check-in"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckIn}
              disabled={!selectedRoom || !guestIdVerified}
              className="inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Complete this check-in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Confirm Check-In</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};


// --- Icon Components ---
const IconKey = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM5.93 16.5A7 7 0 0012 21a7 7 0 006.07-4.5M12 3v7m-3 4h6" /></svg>
);
const IconCreditCard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);
const IconClipboardCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15z" /></svg>
);
const IconUser = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);  