import { useState, useEffect } from 'react';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
// --- UPDATED ---
// Import Timestamp for updatedAt field
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';

// --- Icon Components (remain the same) ---
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

// --- UPDATED ---
// This interface now matches our target data structure
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

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  // --- UPDATED --- Prop now uses the correct interface
  reservation: BookingData;
  // --- UPDATED --- Callback now expects the correct interface
  onCheckIn: (updatedReservation: BookingData) => void;
}
// --- END UPDATED ---

interface AvailableRoom {
  number: string;
  type: string;
  status?: string;
}

// Map verbose room type names to short ids (remains the same)
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

// --- Helper Functions (remain the same) ---
const normalizeTypeKey = (s: string) => {
  if (!s) return 'standard';
  // --- UPDATED --- We now normalize based on the 'roomName' (e.g. "Silid Payapa")
  // The 'roomType' field is already normalized (e.g. "standard")
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

  // When modal opens or reservation changes, prefill
  useEffect(() => {
    if (!isOpen || !reservation) return;
    
    // --- UPDATED --- Reading from new data structure
    setSelectedRoom(reservation.roomNumber || '');
    setPaymentReceived(
      reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0
    );
    setPaymentMethod(reservation.paymentDetails.paymentMethod || 'cash');
    // --- END UPDATED ---
    
    // Reset checklist
    setGuestIdVerified(false);
    setKeyCardsIssued(false);
    setNotes('');
    setErrors({});
    
  }, [isOpen, reservation]);

  // --- UPDATED ---
  // This function now builds the complete, correct BookingData object
  const handleCheckIn = () => {
    // Validation (remains the same)
    const newErrors: Record<string, string> = {};
    if (!selectedRoom) {
      newErrors.room = 'Please select a room to assign';
    }
    if (!guestIdVerified) {
      newErrors.checklist = 'Please verify guest ID before completing check-in';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Stop if there are errors
    }

    const now = new Date();
    const newPaymentStatus = paymentReceived >= reservation.totalAmount ? 'paid' : 'pending';

    // Build the updated object by spreading the original reservation
    // and overwriting the fields that have changed.
    const updatedReservation: BookingData = {
      ...reservation, // Keep all old data (like userId, createdAt, prices, etc.)

      // --- Update top-level fields ---
      roomNumber: selectedRoom,
      status: 'checked-in',
      updatedAt: Timestamp.fromDate(now), // Set the 'updatedAt' timestamp

      // --- Update the nested paymentDetails map ---
      paymentDetails: {
        ...reservation.paymentDetails, // Keep old details (like cardLast4, gcashName)
        
        paymentMethod: paymentMethod, // Update payment method from state
        paymentStatus: newPaymentStatus, // Update payment status
        
        // If it just became 'paid', set the 'paidAt' timestamp.
        // If it was already 'paid', keep the original 'paidAt' timestamp.
        // If it's 'pending', set 'paidAt' to null.
        paidAt: newPaymentStatus === 'paid' 
          ? (reservation.paymentDetails.paidAt || Timestamp.fromDate(now)) 
          : null,
      },
    };
    
    // Note: 'specialRequests' is not in the target data structure,
    // so we are no longer appending notes to it.

    onCheckIn(updatedReservation);
  };
  // --- END UPDATED ---

  const remainingBalance = Math.max(0, reservation.totalAmount - paymentReceived);

  // --- Data Fetching Logic (No Change, but one clarification) ---
  const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    const start2 = new Date(checkIn2);
    const end2 = new Date(checkOut2);
    return start1 < end2 && start2 < end1;
  };

  const isRoomAvailableForDates = async (roomNumber: string, checkIn: string, checkOut: string) => {
    if (!roomNumber || !checkIn || !checkOut) return false;
    try {
      const bookingsCol = collection(db, 'bookings');
      // --- UPDATED --- Using 'bookingId' which is the correct field name
      const q = query(bookingsCol, where('roomNumber', '==', roomNumber), where('status', 'in', ['confirmed', 'checked-in']));
      const snap = await getDocs(q);
      const existing = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      
      for (const b of existing) {
        if (typeof b.checkIn === 'string' && typeof b.checkOut === 'string') {
          // Don't conflict with itself
          if (b.bookingId && reservation && b.bookingId === reservation.bookingId) continue;
          
          if (checkDateOverlap(checkIn, checkOut, b.checkIn, b.checkOut)) return false;
        }
      }
      return true;
    } catch (err) {
      console.error('Error checking room availability:', err);
      return false;
    }
  };

  // useEffect to fetch all rooms (remains the same)
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
            type: normalizeTypeKey(r.type || r.roomType), // Normalize Firestore room data
            status: r.status || 'available'
          })));
        } else if (mounted) {
          console.warn('No rooms found in Firestore.');
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

  // useEffect to filter rooms (logic is updated to use new prop structure)
  useEffect(() => {
    let cancelled = false;
    const compute = async () => {
      if (!reservation) {
        setFilteredRooms([]);
        return;
      }

      // --- UPDATED ---
      // We filter rooms based on the 'roomType' (e.g., "standard"),
      // which is correct. The 'roomName' (e.g., "Silid Payapa") is just for display.
      const reservationTypeKey = reservation.roomType; 
      const candidates = rooms.filter(r => r.type === reservationTypeKey);
      // --- END UPDATED ---
      
      try {
        const roomsSnap = await getDocs(collection(db, 'rooms'));
        const roomMap = Object.fromEntries(roomsSnap.docs.map(d => [d.id, d.data()]));
        
        const results = await Promise.all(candidates.map(async r => {
          // Always include the room already assigned (if any)
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
  }, [rooms, reservation]); // `isRoomAvailableForDates` is now stable

  // Auto-select room (remains the same)
  useEffect(() => {
    if (!isOpen) return;
    if ((!selectedRoom || selectedRoom === '') && !reservation.roomNumber && filteredRooms.length > 0) {
      setSelectedRoom(filteredRooms[0].number);
    }
  }, [filteredRooms, isOpen, selectedRoom, reservation.roomNumber]);

  
  // --- [!] REVISED JSX LAYOUT [!] ---
  // All fields in the JSX are now updated to read from the new data structure.
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guest Check-In" size="xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Left Column: Task Workflow --- */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Room Assignment */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <IconKey />
              {/* --- UPDATED --- Displaying roomName */}
              <span className="ml-2">1. Assign Room ({reservation.roomName})</span>
            </label>
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

          {/* Step 2: Payment */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <IconCreditCard />
              <span className="ml-2">2. Collect Payment</span>
            </label>
            
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <p className="text-2xl font-bold text-gray-900">
                  ₱{reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-right">Payment Status</label>
                {/* --- UPDATED --- Reading from nested paymentDetails */}
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  reservation.paymentDetails.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reservation.paymentDetails.paymentStatus.charAt(0).toUpperCase() + reservation.paymentDetails.paymentStatus.slice(1)}
                </span>
                {/* --- END UPDATED --- */}
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
                  {/* --- UPDATED --- Bank Transfer removed for consistency */}
                  <option value="gcash">GCash</option>
                </select>
              </div>
            </div>
            
            {remainingBalance > 0 && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-md">
                <p className="text-sm font-semibold text-yellow-800">
                  Remaining Balance: ₱{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Final Checklist (remains the same) */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <IconClipboardCheck />
              <span className="ml-2">3. Final Checklist</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={guestIdVerified}
                  onChange={(e) => {
                    setGuestIdVerified(e.target.checked);
                    setErrors(prev => ({ ...prev, checklist: '' })); // Clear error
                  }}
                  className="h-5 w-5 text-heritage-green focus:ring-heritage-green border-gray-300 rounded"
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
                  className="h-5 w-5 text-heritage-green focus:ring-heritage-green border-gray-300 rounded"
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
                  placeholder="e.g., Guest requested extra towels, late check-out inquiry..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Right Column: Summary & Actions (Sticky) --- */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
          
          {/* Guest Card --- UPDATED --- */}
          <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <IconUser />
              <span className="ml-2">Guest</span>
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                {/* Using userName */}
                <p className="text-sm font-semibold text-gray-900">{reservation.userName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                {/* Using userEmail */}
                <p className="text-sm text-gray-900">{reservation.userEmail}</p>
              </div>
              {/* Phone field removed as it's not in the target structure */}
            </div>
          </div>

          {/* Booking Card --- UPDATED --- */}
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <label className="flex items-center text-lg font-semibold text-blue-900 mb-3">
              <IconCalendar />
              <span className="ml-2">Booking</span>
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">Booking ID</label>
                {/* Using bookingId */}
                <p className="text-sm font-semibold text-gray-900">{reservation.bookingId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Guests</label>
                <p className="text-sm font-semibold text-gray-900">{reservation.guests} guest{reservation.guests > 1 ? 's' : ''}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Check-in</label>
                <p className="text-sm font-semibold text-gray-900">{formatDate(reservation.checkIn)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Check-out</label>
                <p className="text-sm font-semibold text-gray-900">{formatDate(reservation.checkOut)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons (remains the same) */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleCheckIn}
              disabled={!selectedRoom || !guestIdVerified}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconCheck />
              <span className="ml-2">Complete Check-In</span>
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-heritage-green"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};