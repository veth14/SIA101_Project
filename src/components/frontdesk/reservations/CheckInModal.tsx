import { useState, useEffect } from 'react';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
// Rely on Firestore `rooms` collection only for runtime data. Do not use local ROOMS_DATA fallback.

interface Reservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomType: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onCheckIn: (updatedReservation: Reservation) => void;
}

interface AvailableRoom {
  number: string;
  type: string;
  status?: string;
}

// We'll load rooms from Firestore (fallback to ROOMS_DATA)
// and check bookings for availability when needed.

export const CheckInModal = ({ isOpen, onClose, reservation, onCheckIn }: CheckInModalProps) => {
  const [selectedRoom, setSelectedRoom] = useState(reservation.roomNumber || '');
  const [paymentReceived, setPaymentReceived] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [guestIdVerified, setGuestIdVerified] = useState(false);
  const [keyCardsIssued, setKeyCardsIssued] = useState(false);
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<AvailableRoom[]>([]);

  const handleCheckIn = () => {
    if (!selectedRoom) {
      alert('Please select a room');
      return;
    }

    if (!guestIdVerified) {
      alert('Please verify guest ID');
      return;
    }

    const updatedReservation: Reservation = {
      ...reservation,
      roomNumber: selectedRoom,
      status: 'checked-in',
      paymentStatus: paymentReceived >= reservation.totalAmount ? 'paid' : 'pending',
    };

    onCheckIn(updatedReservation);
  };

  const remainingBalance = reservation.totalAmount - paymentReceived;

  // Check if two date ranges overlap (including touching dates)
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
      const q = query(bookingsCol, where('roomNumber', '==', roomNumber), where('status', 'in', ['confirmed', 'checked-in']));
      const snap = await getDocs(q);
      const existing = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      for (const b of existing) {
        if (typeof b.checkIn === 'string' && typeof b.checkOut === 'string') {
          if (b.id && reservation && b.id === reservation.id) continue;
          if (checkDateOverlap(checkIn, checkOut, b.checkIn, b.checkOut)) return false;
        }
      }
      return true;
    } catch (err) {
      console.error('Error checking room availability:', err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const roomsCol = collection(db, 'rooms');
        const snap = await getDocs(roomsCol);
        const fetched = snap.docs.map(d => ({ number: d.id, ...(d.data() as any) }));
        
        if (mounted && fetched.length > 0) {
          const normalizeType = (raw: string | undefined) => {
            if (!raw) return 'standard';
            const base = raw.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
            const map: Record<string, string> = {
              'standard': 'standard', 'standard room': 'standard',
              'deluxe': 'deluxe', 'deluxe room': 'deluxe',
              'suite': 'suite', 'suite room': 'suite',
              'family': 'family', 'family suite': 'family',
              'premium family suite': 'family'
            };
            return map[base] || 'standard';
          };

          setRooms(fetched.map(r => ({
            number: r.number || r.id,
            type: normalizeType(r.type || r.roomType),
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

  useEffect(() => {
    let cancelled = false;
    const compute = async () => {
      if (!reservation) {
        setFilteredRooms([]);
        return;
      }

      const normalizeTypeKey = (s: string) => s.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
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
  }, [rooms, reservation, reservation?.checkIn, reservation?.checkOut]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guest Check-In" size="lg">
      <div className="space-y-6">
        {/* Guest Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Guest Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-sm text-gray-900">{reservation.guestName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{reservation.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="text-sm text-gray-900">{reservation.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guests</label>
              <p className="text-sm text-gray-900">{reservation.guests} guests</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking ID</label>
              <p className="text-sm text-gray-900">{reservation.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <p className="text-sm text-gray-900">{reservation.roomType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
              <p className="text-sm text-gray-900">{new Date(reservation.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
              <p className="text-sm text-gray-900">{new Date(reservation.checkOut).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Room Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Room <span className="text-red-500">*</span>
          </label>
          <select
            title="Room Assignment"
            aria-label="Room Assignment"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
          >
            <option value="">Select a room</option>
            {filteredRooms.map((room) => (
              <option key={room.number} value={room.number}>
                Room {room.number} - {room.type}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Information */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <p className="text-lg font-semibold text-gray-900">₱{reservation.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Status</label>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                reservation.paymentStatus === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Received</label>
              <input
                type="number"
                value={paymentReceived}
                onChange={(e) => setPaymentReceived(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                title="Payment Method"
                aria-label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="gcash">GCash</option>
              </select>
            </div>
          </div>
          
          {remainingBalance > 0 && (
            <div className="mt-3 p-3 bg-yellow-100 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Remaining Balance: ₱{remainingBalance.toLocaleString()}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Check-in Checklist */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Check-in Checklist</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={guestIdVerified}
                onChange={(e) => setGuestIdVerified(e.target.checked)}
                className="h-4 w-4 text-heritage-green focus:ring-heritage-green border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Guest ID verified</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={keyCardsIssued}
                onChange={(e) => setKeyCardsIssued(e.target.checked)}
                className="h-4 w-4 text-heritage-green focus:ring-heritage-green border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Key cards issued</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            placeholder="Any special requests or notes..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-heritage-green"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckIn}
            disabled={!selectedRoom || !guestIdVerified}
            className="px-4 py-2 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Check-In
          </button>
        </div>
      </div>
    </Modal>
  );
};
