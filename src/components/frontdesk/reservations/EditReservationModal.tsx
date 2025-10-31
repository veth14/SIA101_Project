import { useState, useEffect } from 'react';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
// NOTE: Do NOT rely on local ROOMS_DATA for runtime logic. Use Firestore `rooms` collection only.

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
  paymentMethod?: string;
  specialRequests?: string;
}

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onSave: (updatedReservation: Reservation) => void;
}

const roomTypes = [
  { id: 'standard', name: 'Standard Room (Silid Payapa)', price: 2500 },
  { id: 'deluxe', name: 'Deluxe Room (Silid Marahuyo)', price: 3800 },
  { id: 'suite', name: 'Suite Room (Silid Ginhawa)', price: 5500 },
  { id: 'family', name: 'Family Suite (Silid Haraya)', price: 8000 },
];

// Map verbose room type names to short ids used across the UI
const typeIdMap: Record<string, string> = {
  'Standard Room': 'standard',
  'Deluxe Room': 'deluxe',
  'Suite Room': 'suite',
  'Premium Family Suite': 'family',
  // include display names as well
  'Standard Room (Silid Payapa)': 'standard',
  'Deluxe Room (Silid Marahuyo)': 'deluxe',
  'Suite Room (Silid Ginhawa)': 'suite',
  'Family Suite (Silid Haraya)': 'family',
};

// rooms will be loaded from Firestore (fallback to ROOMS_DATA)
// each room shape: { number: string, type: string, status: 'available'|'occupied'|'cleaning'|... }

export const EditReservationModal = ({ isOpen, onClose, reservation, onSave }: EditReservationModalProps) => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomType: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
    paymentMethod: 'cash',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (reservation) {
      // First try exact match in typeIdMap, then try matching without Silid part
      const normalizeRoomType = (fullName: string) => {
        // Try exact match first
        if (typeIdMap[fullName]) return typeIdMap[fullName];
        
        // Try matching without the Silid part
        const baseName = fullName.replace(/\s*\([^)]*\)/, '').trim();
        if (typeIdMap[baseName]) return typeIdMap[baseName];
        
        // If it's already a type id, keep it
        if (roomTypes.some(rt => rt.id === fullName)) return fullName;
        
        // Fallback to original
        return fullName;
      };

      setFormData({
        guestName: reservation.guestName,
        email: reservation.email,
        phone: reservation.phone,
        roomType: normalizeRoomType(reservation.roomType),
        roomNumber: reservation.roomNumber || '',
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        specialRequests: reservation.specialRequests || '',
        paymentMethod: reservation.paymentMethod || 'cash',
      });
    }
  }, [reservation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';

    // Validate dates
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    if (checkOut <= checkIn) {
      newErrors.checkOut = 'Check-out must be after check-in date';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate subtotal + taxes/charges (assumptions: service charge and VAT)
  // Assumptions:
  // - Service charge: 10% of room subtotal
  // - VAT: 12% applied on (subtotal + service charge)
  const calculateTotal = () => {
    const roomTypeData = roomTypes.find(rt => rt.id === formData.roomType);
    if (!roomTypeData) return reservation.totalAmount;

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = roomTypeData.price * nights;

    const vatRate = 0.12; // 12% VAT only
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    return Math.round(total * 100) / 100;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // If a room number is selected and it's different from the current reservation's room,
    // double-check availability to prevent assigning an occupied/checked-in room.
    if (formData.roomNumber && reservation && formData.roomNumber !== reservation.roomNumber) {
      // Check room doc status
      try {
        const roomDoc = await getDoc(doc(db, 'rooms', formData.roomNumber));
        const roomData = roomDoc.exists() ? roomDoc.data() : null;
        const status = roomData?.status || 'available';
        if (status !== 'available') {
          setErrors(prev => ({ ...prev, roomNumber: 'Selected room is currently marked unavailable' }));
          return;
        }
      } catch (e) {
        console.warn('Could not read room doc before save:', e);
        // proceed to booking check as fallback
      }

      const ok = await isRoomAvailableForDates(formData.roomNumber, formData.checkIn, formData.checkOut);
      if (!ok) {
        setErrors(prev => ({ ...prev, roomNumber: 'Selected room is not available for those dates' }));
        return;
      }
    }

    // Get the display name for the room type to preserve Silid names
    const roomTypeData = roomTypes.find(rt => rt.id === formData.roomType);
    const fullRoomTypeName = roomTypeData ? roomTypeData.name : formData.roomType;

    const updatedReservation: Reservation = {
      ...reservation,
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      roomType: fullRoomTypeName, // Use full display name with Silid
      roomNumber: formData.roomNumber || undefined,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      specialRequests: formData.specialRequests,
      paymentMethod: formData.paymentMethod,
      totalAmount: calculateTotal(),
    };

    // Update rooms collection: set the new room's currentReservation and status to occupied,
    // and free the previous room (if different) by setting status to available and clearing currentReservation.
    try {
      const prevRoom = reservation?.roomNumber;
      const newRoom = formData.roomNumber;

      // If assigned a new room (not empty) and different from previous, mark it occupied
      if (newRoom && newRoom !== prevRoom) {
        try {
          await updateDoc(doc(db, 'rooms', newRoom), {
            currentReservation: reservation?.id || updatedReservation.id,
            status: 'occupied'
          });
        } catch (e) {
          // if update fails, log but continue — caller may handle consistency
          console.warn('Failed to mark new room as occupied:', e);
        }
      }

      // If there was a previous room and it's different, free it
      if (prevRoom && prevRoom !== newRoom) {
        try {
          await updateDoc(doc(db, 'rooms', prevRoom), {
            currentReservation: null,
            status: 'available'
          });
        } catch (e) {
          console.warn('Failed to free previous room:', e);
        }
      }
    } catch (err) {
      console.error('Error updating room documents:', err);
    }

    onSave(updatedReservation);
  };

  // Dynamic rooms state and availability checks (load from Firestore, fallback to local ROOMS_DATA)
  const [rooms, setRooms] = useState<Array<any>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<Array<any>>([]);

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
          // allow the room if the existing booking is the same reservation being edited
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
        const roomsSnap = await getDocs(roomsCol);
        const fetched = roomsSnap.docs.map(d => ({ number: d.id, ...(d.data() as any) }));
        if (mounted) {
          if (fetched.length > 0) {
            // Helper to normalize room types consistently
            const normalizeType = (raw: any) => {
              const s = (raw || '').toString();
              
              // If it's already a known type id, return it
              if (roomTypes.some(rt => rt.id === s)) return s;
              
              // Try exact match in typeIdMap first
              if (typeIdMap[s]) return typeIdMap[s];
              
              // Try matching without Silid part
              const baseName = s.replace(/\s*\([^)]*\)/, '').trim();
              if (typeIdMap[baseName]) return typeIdMap[baseName];
              
              // Fallback: clean up the string to a valid type id
              return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            };

            setRooms(fetched.map((r: any) => {
              const normalizedType = normalizeType(r.type || r.roomType);
              return {
                number: r.number || r.id || r.roomNumber,
                type: normalizedType,
                status: r.status || 'available',
                // Store original type name if available
                typeName: r.typeName || r.type || r.roomType
              };
            }));
          } else {
            // No rooms found in Firestore - set empty list and warn. Do NOT fall back to local ROOMS_DATA.
            console.warn('No rooms found in Firestore `rooms` collection. Please populate the collection.');
            setRooms([]);
          }
        }
        } catch (err) {
        console.warn('Could not fetch rooms from Firestore. Rooms list will be empty.', err);
        if (mounted) setRooms([]);
      } finally {
        if (mounted) setLoadingRooms(false);
      }
    };
    fetchRooms();
    return () => { mounted = false; };
  }, []);

  // Recompute the filtered available rooms whenever type or dates change
  useEffect(() => {
    let cancelled = false;
    const compute = async () => {
      if (!formData.roomType) {
        setFilteredRooms([]);
        return;
      }

      // filter rooms by exact type id match (we normalize types to ids when loading)
      const candidates = rooms.filter(r => r.type === formData.roomType);
      const results: Array<any> = [];
      // Bulk fetch authoritative room docs once to avoid per-room network calls
      try {
        const roomsSnap = await getDocs(collection(db, 'rooms'));
        const roomDocMap: Record<string, any> = {};
        roomsSnap.docs.forEach(d => { roomDocMap[d.id] = d.data(); });

        for (const r of candidates) {
          // Always allow the room currently assigned to this reservation
          if (reservation && r.number === reservation.roomNumber) {
            results.push(r);
            continue;
          }

          const roomData = roomDocMap[r.number] || null;
          const status = roomData?.status || r.status || 'available';

          // If no dates specified, include only rooms marked available
          if (!formData.checkIn || !formData.checkOut) {
            if (status === 'available') results.push(r);
            continue;
          }

          // If dates provided, skip if room status not available
          if (status !== 'available') continue;

          const ok = await isRoomAvailableForDates(r.number, formData.checkIn, formData.checkOut);
          if (ok) results.push(r);
        }
      } catch (e) {
        console.warn('Failed to fetch rooms collection for availability checks', e);
      }
      if (!cancelled) setFilteredRooms(results);
    };
    compute();
    return () => { cancelled = true; };
  }, [formData.roomType, formData.checkIn, formData.checkOut, rooms, reservation]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Reservation" size="lg">
      <div className="space-y-6">
        {/* Guest Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                title="Full Name"
                placeholder="Enter guest full name"
                value={formData.guestName}
                onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors.guestName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                title="Email"
                placeholder="guest@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                title="Phone Number"
                placeholder="+63 9XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
              <select
                title="Number of Guests"
                value={formData.guests}
                onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type <span className="text-red-500">*</span>
              </label>
              <select
                title="Room Type"
                value={formData.roomType}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, roomType: e.target.value, roomNumber: '' }));
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors.roomType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select room type</option>
                {roomTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} - ₱{type.price.toLocaleString()}/night
                  </option>
                ))}
              </select>
              {errors.roomType && <p className="text-red-500 text-xs mt-1">{errors.roomType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <select
                title="Room Number"
                aria-label="Room Number"
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
                disabled={!formData.roomType}
              >
                <option value="">{loadingRooms ? 'Loading rooms...' : 'Select room (optional)'}</option>
                {filteredRooms && filteredRooms.length > 0 ? (
                  filteredRooms.map((room: any) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number}
                    </option>
                  ))
                ) : (
                  !loadingRooms && <option value="" disabled>No rooms available</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date <span className="text-red-500">*</span>
              </label>
              <input
                title="Check-in Date"
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors.checkIn ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date <span className="text-red-500">*</span>
              </label>
              <input
                title="Check-out Date"
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors.checkOut ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                title="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="gcash">GCash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Updated Total Amount</label>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                ₱{calculateTotal().toLocaleString()}
              </p>
              {calculateTotal() !== reservation.totalAmount && (
                <p className="text-sm text-orange-600 mt-1">
                  Previous: ₱{reservation.totalAmount.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            placeholder="Any special requests or preferences..."
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
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};
