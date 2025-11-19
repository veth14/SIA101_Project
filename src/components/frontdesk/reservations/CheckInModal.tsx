import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
// --- UPDATED ---
// Import shared types and the new hook from the parent page
import {
  type BookingData,
  type IRoom,
  useRooms
} from './ReservationsPage';
// --- END UPDATED ---

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

// --- HELPER FUNCTIONS (CORRECTED) ---
const typeIdMap: Record<string, string> = {
  'standard': 'standard', 'standard room': 'standard',
  'deluxe': 'deluxe', 'deluxe room': 'deluxe',
  'suite': 'suite', 'suite room': 'suite',
  'family': 'family', 'family suite': 'family',
  'premium family suite': 'family',
  // Add all variations from your data
  'silid payapa': 'standard',
  'silid marahuyo': 'deluxe',
  'silid ginhawa': 'suite',
  'silid haraya': 'family',
  'silid payapa (standard room)': 'standard',
  'silid marahuyo (deluxe room)': 'deluxe',
  'silid ginhawa (suite room)': 'suite',
  'silid haraya (premium family suite)': 'family',
};

// --- THIS IS THE FIX ---
const normalizeTypeKey = (s: string) => {
  if (!s) return 'unknown'; // Return a non-matching key
  const key = s.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
  // Default to a non-matching key instead of 'standard'
  return typeIdMap[key] || 'unknown'; 
};
// --- END THE FIX ---

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
  
  // --- UPDATED ---
  // Get rooms from context instead of local state/fetching
  const { rooms: allRooms, loading: roomsLoading } = useRooms();
  // Local state for the filtered *available* rooms list
  const [filteredRooms, setFilteredRooms] = useState<AvailableRoom[]>([]);
  // --- END UPDATED ---

  // --- NEW ---
  // State to hold results of our single availability query
  const [overlappingBookings, setOverlappingBookings] = useState<BookingData[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  // --- END NEW ---

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // --- handleCheckIn (untouched) ---
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

  // --- checkDateOverlap (untouched, used by new logic) ---
  const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
    // Ensure inputs are valid date strings
    if (!checkIn1 || !checkOut1 || !checkIn2 || !checkOut2) {
      return false;
    }
    try {
      const start1 = new Date(checkIn1);
      const end1 = new Date(checkOut1);
      const start2 = new Date(checkIn2);
      const end2 = new Date(checkOut2);

      // Check for invalid dates
      if (isNaN(start1.getTime()) || isNaN(end1.getTime()) || isNaN(start2.getTime()) || isNaN(end2.getTime())) {
        return false;
      }
      
      // Standard overlap check: (StartA < EndB) and (StartB < EndA)
      return start1 < end2 && start2 < end1;
    } catch (e) {
      console.error("Error parsing dates for overlap check:", e);
      return false;
    }
  };

  // --- DELETED ---
  // The old, inefficient isRoomAvailableForDates function was removed.
  // --- END DELETED ---

  // --- DELETED ---
  // The old, inefficient fetchRooms useEffect was removed.
  // Rooms are now provided by the useRooms() hook.
  // --- END DELETED ---

  // --- NEW HOTFIX: Step 1 ---
  // This effect runs ONE query to get all *potentially* conflicting bookings for the
  // check-in date range.
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
        
        // This is the single-query hotfix.
        const q = query(
          collection(db, 'bookings'),
          where('status', 'in', ['confirmed', 'checked-in']),
          where('checkIn', '<', checkOut),  // Booking starts *before* this one ends
          where('checkOut', '>', checkIn) // Booking ends *after* this one starts
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
  }, [isOpen, reservation]); // Runs when modal opens or reservation changes
  // --- END NEW HOTFIX: Step 1 ---


  // --- UPDATED HOTFIX: Step 2 ---
  // This effect is now fast and runs *in-memory*.
  // It filters the `allRooms` list from context against the `overlappingBookings` list.
  useEffect(() => {
    if (!reservation) {
      setFilteredRooms([]);
      return;
    }
    
    // 1. Get the room type we care about
    const reservationTypeKey = normalizeTypeKey(reservation.roomType);
    
    // 2. Get all rooms of that type from the context
    // --- THIS IS THE FIX ---
    const candidateRooms = allRooms.filter(r => 
      normalizeTypeKey(r.roomType) === reservationTypeKey
    );
    // --- END THE FIX ---

    // 3. Get a Set of all room numbers that have a *true* conflict
    const occupiedRoomNumbers = new Set<string>();
    for (const b of overlappingBookings) {
      if (!b.roomNumber) continue;
      
      const isOverlapping = checkDateOverlap(
        reservation.checkIn, reservation.checkOut,
        b.checkIn, b.checkOut
      );
      
      if (isOverlapping) {
        occupiedRoomNumbers.add(b.roomNumber);
      }
    }

    // 4. Filter the candidate rooms in-memory
    const availableRooms = candidateRooms.filter(room => {
      // If the room is already assigned to *this* reservation, always show it.
      if (room.id === reservation.roomNumber) {
        return true;
      }
      
      // --- UPDATED LOGIC ---
      // If the room's base status isn't 'available' OR it's not 'isActive', hide it
      if (room.status !== 'available' || room.isActive === false) {
        return false;
      }
      // --- END UPDATED LOGIC ---

      // If the room is in the occupied Set, hide it.
      if (occupiedRoomNumbers.has(room.id)) {
        return false;
      }
      
      // Otherwise, it's available.
      return true;
    });

    // 5. Set the final list for the dropdown
    setFilteredRooms(availableRooms.map(r => ({
      number: r.id,
      type: r.roomType, // <-- Use roomType here
      status: r.status
    })));

  }, [allRooms, overlappingBookings, reservation]); // Depends on context rooms + query results
  // --- END UPDATED HOTFIX: Step 2 ---


  // --- Auto-select room useEffect (untouched) ---
  useEffect(() => {
    if (!isOpen || !reservation) return;
    if ((!selectedRoom || selectedRoom === '') && !reservation.roomNumber && filteredRooms.length > 0) {
      setSelectedRoom(filteredRooms[0].number);
    }
  }, [filteredRooms, isOpen, selectedRoom, reservation]);


  // Handle early exit
  if (!isOpen || !reservation) {
    return null;
  }

  // --- createPortal JSX (untouched, only one change) ---
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={onClose}
        aria-label="Close overlay"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5">
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          {/* ... (header content untouched) ... */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <IconKey />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold md:text-2xl text-emerald-700">Guest Check-In</h2>
                <p className="mt-1 text-sm text-gray-500">{reservation.bookingId}</p>
              </div>
            </div>
          </div>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* --- Left Column: Task Workflow --- */}
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1: Room Assignment */}
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
                  // --- UPDATED ---
                  // Now disabled based on context loading OR our availability check
                  disabled={roomsLoading || isCheckingAvailability}
                  // --- END UPDATED ---
                >
                  {/* --- UPDATED --- */}
                  <option value="">
                    {roomsLoading ? 'Loading rooms...' : 
                    isCheckingAvailability ? 'Checking availability...' : 
                    (filteredRooms.length > 0 ? 'Select a room' : 'No rooms available')}
                  </option>
                  {/* --- END UPDATED --- */}
                  {filteredRooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number}
                    </option>
                  ))}
                </select>
                {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
              </div>

              {/* Step 2: Payment */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* ... (payment section untouched) ... */}
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconCreditCard />
                  <span className="ml-2">2. Collect Payment</span>
                </h4>
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
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm font-semibold text-yellow-800">
                      Remaining Balance: ₱{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>

              {/* Step 3: Final Checklist */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* ... (checklist section untouched) ... */}
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
              
              {/* Guest Card */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* ... (guest card untouched) ... */}
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

              {/* Booking Card */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* ... (booking card untouched) ... */}
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
                    <label className="block text-sm font-medium text-gray-500">Check-in</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(reservation.checkIn)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Check-out</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(reservation.checkOut)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100">
          {/* ... (footer actions untouched) ... */}
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


// --- Icon Components (untouched) ---
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