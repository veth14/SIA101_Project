import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// --- TYPE DEFINITIONS ---
// It's good practice to move these to a shared types file (e.g., types.ts)
// I've assumed they are moved, but you can keep them here if you prefer.

interface BookingData {
  additionalGuestPrice: number;
  baseGuests: number;
  basePrice: number;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  createdAt: Timestamp;
  guests: number;
  nights: number;
  paymentDetails: {
    cardLast4: string | null;
    cardholderName: string | null;
    gcashName: string | null;
    gcashNumber: string | null;
    paidAt: Timestamp | null;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending' | 'refunded';
  };
  roomName: string;
  roomNumber: string | null;
  roomPricePerNight: number;
  roomType: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  subtotal: number;
  tax: number;
  taxRate: number;
  totalAmount: number;
  updatedAt: Timestamp;
  userEmail: string;
  userId: string;
  userName: string;
}

interface AvailableRoom {
  number: string;
  type: string;
  status?: string;
}

// --- PROPS ---
interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingData | null; // Allow null to match base code pattern
  onCheckIn: (updatedReservation: BookingData) => void;
}

// --- HELPER FUNCTIONS ---
const typeIdMap: Record<string, string> = {
  'standard': 'standard', 'standard room': 'standard',
  'deluxe': 'deluxe', 'deluxe room': 'deluxe',
  'suite': 'suite', 'suite room': 'suite',
  'family': 'family', 'family suite': 'family',
  'premium family suite': 'family',
  'silid payapa (standard room)': 'standard',
  'silid marahuyo (deluxe room)': 'deluxe',
  'silid ginhawa (suite room)': 'suite',
  'silid haraya (premium family suite)': 'family',
};

const normalizeTypeKey = (s: string) => {
  if (!s) return 'standard';
  const key = s.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
  return typeIdMap[key] || 'standard';
};

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
  
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<AvailableRoom[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- NEW ---
  // Prevent background scroll while modal is open (from base code)
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // When modal opens or reservation changes, prefill
  useEffect(() => {
    if (!isOpen || !reservation) return;
    
    setSelectedRoom(reservation.roomNumber || '');
    setPaymentReceived(
      reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0
    );
    setPaymentMethod(reservation.paymentDetails.paymentMethod || 'cash');
    
    // Reset checklist
    setGuestIdVerified(false);
    setKeyCardsIssued(false);
    setNotes('');
    setErrors({});
    
  }, [isOpen, reservation]);

  // --- All business logic (handlers, data fetching) remains unchanged ---
  // --- handleCheckIn ---
  const handleCheckIn = () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!selectedRoom) {
      newErrors.room = 'Please select a room to assign';
    }
    if (!guestIdVerified) {
      newErrors.checklist = 'Please verify guest ID before completing check-in';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || !reservation) {
      return; // Stop if there are errors or no reservation
    }

    const now = new Date();
    const newPaymentStatus = paymentReceived >= reservation.totalAmount ? 'paid' : 'pending';

    const updatedReservation: BookingData = {
      ...reservation,
      roomNumber: selectedRoom,
      status: 'checked-in',
      updatedAt: Timestamp.fromDate(now),
      paymentDetails: {
        ...reservation.paymentDetails,
        paymentMethod: paymentMethod,
        paymentStatus: newPaymentStatus,
        paidAt: newPaymentStatus === 'paid' 
          ? (reservation.paymentDetails.paidAt || Timestamp.fromDate(now)) 
          : null,
      },
    };
    
    onCheckIn(updatedReservation);
  };

  const remainingBalance = reservation ? Math.max(0, reservation.totalAmount - paymentReceived) : 0;

  // --- checkDateOverlap ---
  const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    const start2 = new Date(checkIn2);
    const end2 = new Date(checkOut2);
    return start1 < end2 && start2 < end1;
  };

  // --- isRoomAvailableForDates ---
  const isRoomAvailableForDates = async (roomNumber: string, checkIn: string, checkOut: string) => {
    if (!roomNumber || !checkIn || !checkOut || !reservation) return false; // Added reservation check
    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(bookingsCol, where('roomNumber', '==', roomNumber), where('status', 'in', ['confirmed', 'checked-in']));
      const snap = await getDocs(q);
      const existing = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

      for (const b of existing) {
        const bCheckIn = b.checkIn && typeof b.checkIn.toDate === 'function' ? b.checkIn.toDate().toISOString().split('T')[0] : b.checkIn;
        const bCheckOut = b.checkOut && typeof b.checkOut.toDate === 'function' ? b.checkOut.toDate().toISOString().split('T')[0] : b.checkOut;
        if (!bCheckIn || !bCheckOut) continue;
        if (b.bookingId && reservation && b.bookingId === reservation.bookingId) continue;
        if (checkDateOverlap(checkIn, checkOut, bCheckIn, bCheckOut)) return false;
      }
      return true;
    } catch (err) {
      console.error('Error checking room availability:', err);
      return false;
    }
  };

  // --- fetchRooms useEffect ---
  useEffect(() => {
    let mounted = true;
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const roomsCol = collection(db, 'rooms');
        const snap = await getDocs(roomsCol);
        const fetched = snap.docs.map(d => ({ number: d.id, ...(d.data() as any) }));
        
        if (mounted && fetched.length > 0) {
          setRooms(fetched.map(r => ({
            number: r.number || r.id,
            type: normalizeTypeKey(r.type || r.roomType),
            status: r.status || 'available'
          })));
        } else if (mounted) {
          setRooms([]);
        }
      } catch (err) {
        console.error('Error loading rooms:', err);
        if (mounted) setRooms([]);
      } finally {
        if (mounted) setLoadingRooms(false);
      }
    };
    fetchRooms();
    return () => { mounted = false; };
  }, []);

  // --- filterRooms useEffect ---
  useEffect(() => {
    let cancelled = false;
    const compute = async () => {
      if (!reservation) {
        setFilteredRooms([]);
        return;
      }

      const reservationTypeKey = normalizeTypeKey(reservation.roomType);
      const candidates = rooms.filter(r => r.type === reservationTypeKey);
      
      try {
        const roomsSnap = await getDocs(collection(db, 'rooms'));
        const roomMap = Object.fromEntries(roomsSnap.docs.map(d => [d.id, d.data()]));
        
        const results = await Promise.all(candidates.map(async r => {
          if (r.number === reservation.roomNumber) return r;
          
          const roomData = roomMap[r.number];
          const status = roomData?.status || r.status || 'available';
          
          if (status !== 'available') return null;
          if (!reservation.checkIn || !reservation.checkOut) return null;
          
          const isAvailable = await isRoomAvailableForDates(r.number, reservation.checkIn, reservation.checkOut);
          return isAvailable ? r : null;
        }));
        
        if (!cancelled) setFilteredRooms(results.filter((r): r is AvailableRoom => r !== null));
      } catch (e) {
        console.error('Failed to check room availability:', e);
        if (!cancelled) setFilteredRooms([]);
      }
    };
    compute();
    return () => { cancelled = true; };
  }, [rooms, reservation]); // `isRoomAvailableForDates` is stable

  // --- Auto-select room useEffect ---
  useEffect(() => {
    if (!isOpen || !reservation) return;
    if ((!selectedRoom || selectedRoom === '') && !reservation.roomNumber && filteredRooms.length > 0) {
      setSelectedRoom(filteredRooms[0].number);
    }
  }, [filteredRooms, isOpen, selectedRoom, reservation]);


  // --- NEW ---
  // Handle early exit if modal is not open or no reservation is provided
  if (!isOpen || !reservation) {
    return null;
  }

  // --- NEW ---
  // Return the new modal structure using createPortal
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Full-screen overlay from base code */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={onClose}
        aria-label="Close overlay"
      />

      {/* Modal Card from base code (using max-w-4xl for "xl" size) */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5">
        
        {/* Header (branded) - from base code */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                {/* Using IconKey, but could be any icon */}
                <IconKey />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold md:text-2xl text-emerald-700">Guest Check-In</h2>
                <p className="mt-1 text-sm text-gray-500">{reservation.bookingId}</p>
              </div>
            </div>
          </div>

          {/* Close button (small subtle) - from base code */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - from base code */}
        {/* Using 160px for header/footer height, same as base code */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Your original 3-column grid layout is preserved,
            but the "sub-cards" are restyled to match the base code.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* --- Left Column: Task Workflow --- */}
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1: Room Assignment - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconKey />
                  <span className="ml-2">1. Assign Room ({reservation.roomName})</span>
                </h4>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Rooms
                  <span className="text-red-500">*</span>
                </label>
                <select
                  title="Room Assignment"
                  aria-label="Room Assignment"
                  value={selectedRoom}
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    setErrors(prev => ({ ...prev, room: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md ${errors.room ? 'border-red-300' : 'border-gray-300'}`}
                  disabled={loadingRooms}
                >
                  <option value="">{loadingRooms ? 'Loading rooms...' : 'Select a room'}</option>
                  {filteredRooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number}
                    </option>
                  ))}
                </select>
                {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
              </div>

              {/* Step 2: Payment - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconCreditCard />
                  <span className="ml-2">2. Collect Payment</span>
                </h4>
                
                {/* UPDATED STYLING for this banner */}
                <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-2xl font-bold text-gray-900">
                      ₱{reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">Payment Status</label>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      reservation.paymentDetails.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.paymentDetails.paymentStatus.charAt(0).toUpperCase() + reservation.paymentDetails.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Received Now</label>
                    <input
                      type="number"
                      value={paymentReceived}
                      onChange={(e) => setPaymentReceived(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      title="Payment Method"
                      aria-label="Payment Method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="gcash">GCash</option>
                    </select>
                  </div>
                </div>
                
                {remainingBalance > 0 && (
                  /* UPDATED STYLING for this banner */
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm font-semibold text-yellow-800">
                      Remaining Balance: ₱{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>

              {/* Step 3: Final Checklist - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconClipboardCheck />
                  <span className="ml-2">3. Final Checklist</span>
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestIdVerified}
                      onChange={(e) => {
                        setGuestIdVerified(e.target.checked);
                        setErrors(prev => ({ ...prev, checklist: '' }));
                      }}
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Guest ID Verified</span>
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  {errors.checklist && <p className="text-red-500 text-xs -mt-2 ml-3">{errors.checklist}</p>}
                  
                  <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keyCardsIssued}
                      onChange={(e) => setKeyCardsIssued(e.target.checked)}
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Key Cards Issued</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                      placeholder="e.g., Guest requested extra towels..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Column: Summary & Actions (Sticky) --- */}
            <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
              
              {/* Guest Card - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <IconUser />
                  <span className="ml-2">Guest</span>
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Name</label>
                    <p className="text-sm font-semibold text-gray-900">{reservation.userName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{reservation.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Booking Card - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <IconCalendar />
                  <span className="ml-2">Booking</span>
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Guests</label>
                    <p className="text-sm font-semibold text-gray-900">{reservation.guests} guest{reservation.guests > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Check-in</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(reservation.checkIn)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Check-out</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(reservation.checkOut)}</p>
                  </div>
                </div>
              </div>

              {/* NOTE: The action buttons are MOVED
                from this column to the new Modal Footer.
              */}

            </div>
          </div>
        </div>
        
        {/* Footer Actions - from base code */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
            
            {/* Secondary Action */}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white/80 rounded-2xl shadow-sm hover:bg-gray-50 transition transform"
              title="Cancel check-in"
            >
              Cancel
            </button>
            
            {/* Primary Action - Styled like "Send Receipt" button */}
            <button
              onClick={handleCheckIn}
              disabled={!selectedRoom || !guestIdVerified}
              className="inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Complete this check-in"
            >
              <IconCheck />
              Complete Check-In
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};


// --- Icon Components (Moved to bottom for readability) ---
const IconKey = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM5.93 16.5A7 7 0 0012 21a7 7 0 006.07-4.5M12 3v7m-3 4h6" /></svg>
);
const IconCreditCard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);
const IconClipboardCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15z" /></svg>
);
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);