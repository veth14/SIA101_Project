import { useState, useEffect } from 'react';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
// Use Firestore `rooms` and `roomTypes` as the source of truth. Do NOT rely on local ROOMS_DATA at runtime.
interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooking: (booking: any) => void;
}

// Default room types used when Firestore roomTypes collection is empty
const defaultRoomTypes = [
  { id: 'standard', name: 'Standard Room', price: 2500, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 500 },
  { id: 'deluxe', name: 'Deluxe Room', price: 3800, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 750 },
  { id: 'suite', name: 'Suite Room', price: 5500, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 1000 },
  { id: 'family', name: 'Family Suite', price: 8000, baseGuests: 4, maxGuests: 8, additionalGuestPrice: 1200 },
];

// Check if two date ranges overlap (including touching dates)
const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
  const start1 = new Date(checkIn1);
  const end1 = new Date(checkOut1);
  const start2 = new Date(checkIn2);
  const end2 = new Date(checkOut2);
  return start1 < end2 && start2 < end1;
};

export const WalkInModal = ({ isOpen, onClose, onBooking }: WalkInModalProps) => {
  // ...existing code...
  const [step, setStep] = useState(1);
  const [roomTypes, setRoomTypes] = useState<Array<any>>([]);
  const [rooms, setRooms] = useState<Array<any>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [formData, setFormData] = useState({
    // Guest Information
    guestName: '',
    email: '',
    phone: '',
    idType: 'passport',
    idNumber: '',
    address: '',
    
    // Booking Details
    roomType: '',
    roomNumber: '',
    guests: 1,
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: '',
    nights: 1,
    
    // Payment
    totalAmount: 0,
    paymentMethod: 'cash',
    paymentReceived: 0,
    
    // Special Requests
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define interfaces for type safety
  interface RoomType {
    id: string;
    name: string;
    price: number;
    maxGuests: number;
  }

  // Fetch room types and rooms from Firestore
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoadingRooms(true);
      try {
        // room types
        const rtCol = collection(db, 'roomTypes');
        const rtSnap = await getDocs(rtCol);
        const fetchedTypes = rtSnap.docs.map(d => ({ id: d.id, ...d.data() } as RoomType));
        
        if (mounted) {
          if (fetchedTypes.length > 0) {
            // normalize price and maxGuests if stored differently
            setRoomTypes(fetchedTypes.map(t => ({
              id: t.id,
              name: t.name || t.id,
              price: typeof t.price === 'number' ? t.price : Number(t.price || 0),
              maxGuests: t.maxGuests || 4
            })));
          } else {
            console.warn('No roomTypes found in Firestore `roomTypes` collection, using default room types.');
            setRoomTypes(defaultRoomTypes);
          }

          // rooms (individual room inventory)
          const roomsCol = collection(db, 'rooms');
          const roomsSnap = await getDocs(roomsCol);
          const fetchedRooms = roomsSnap.docs.map(d => ({ number: d.id, ...d.data() }));
          
          if (fetchedRooms.length > 0) {
            // Use types from either Firestore or defaults
            const validTypes = fetchedTypes.length > 0 ? fetchedTypes : defaultRoomTypes;
            const typeMap: Record<string, string> = {};
            validTypes.forEach((t: RoomType) => {
              typeMap[t.id] = t.id;
              typeMap[t.name.toLowerCase()] = t.id;
              // Handle Silid variants
              const baseName = t.name.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
              typeMap[baseName] = t.id;
            });

            const normalizeType = (raw: any) => {
              if (!raw) return 'standard';
              const input = raw.toString().toLowerCase();
              
              // Direct type id match
              if (validTypes.some(t => t.id === input)) return input;
              
              // Try with and without Silid part
              const withoutSilid = input.replace(/\s*\([^)]*\)/, '').trim();
              if (typeMap[input]) return typeMap[input];
              if (typeMap[withoutSilid]) return typeMap[withoutSilid];
              
              // Fallback mappings
              const fallbackMap: Record<string, string> = {
                'standard': 'standard',
                'standard room': 'standard',
                'deluxe': 'deluxe',
                'deluxe room': 'deluxe',
                'suite': 'suite',
                'suite room': 'suite',
                'family': 'family',
                'family suite': 'family',
                'premium family suite': 'family'
              };
              return fallbackMap[withoutSilid.toLowerCase()] || 'standard';
            };

            setRooms(fetchedRooms.map((r: any) => ({
              number: r.number || r.id || r.roomNumber,
              type: normalizeType(r.type || r.roomType),
              status: r.status || 'available',
              // Keep original display name if available
              typeName: r.typeName || r.type || r.roomType
            })));
          } else {
            console.warn('No rooms found in Firestore `rooms` collection.');
            setRooms([]);
          }
        }
      } catch (err) {
        console.warn('Could not fetch rooms or room types from Firestore, using defaults.', err);
        if (mounted) {
          setRoomTypes(defaultRoomTypes);
          setRooms([]);
        }
      } finally {
        if (mounted) setLoadingRooms(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  // Validate helpers
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate phone number (must be at least 10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      newErrors.phone = 'Phone number must have at least 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.roomNumber) newErrors.roomNumber = 'Room selection is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    
    // Validate dates
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      newErrors.checkIn = 'Check-in date cannot be in the past';
    }
    if (checkOut <= checkIn) {
      newErrors.checkOut = 'Check-out must be after check-in date';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;

    // Check availability for the selected room number against bookings in Firestore
    // Check room doc status first
    try {
      const roomDoc = await getDoc(doc(db, 'rooms', formData.roomNumber));
      const roomData = roomDoc.exists() ? roomDoc.data() : null;
      const status = roomData?.status || 'available';
      if (status !== 'available') {
        setErrors({ roomNumber: 'Selected room is currently marked unavailable' });
        return false;
      }
    } catch (e) {
      console.warn('Could not read room doc before walk-in booking validation:', e);
    }

    const isAvailable = await isRoomAvailableForDates(formData.roomNumber, formData.checkIn, formData.checkOut);
    if (!isAvailable) {
      setErrors({ roomNumber: 'Selected room is not available for those dates' });
      return false;
    }

    return true;
  };

  // Query bookings for a specific room number to check conflicts
  const isRoomAvailableForDates = async (roomNumber: string, checkIn: string, checkOut: string) => {
    if (!roomNumber || !checkIn || !checkOut) return false;

    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(bookingsCol, where('roomNumber', '==', roomNumber), where('status', 'in', ['confirmed', 'checked-in']));
      const snap = await getDocs(q);
      const existing = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      for (const b of existing) {
        if (typeof b.checkIn === 'string' && typeof b.checkOut === 'string') {
          if (checkDateOverlap(checkIn, checkOut, b.checkIn, b.checkOut)) {
            return false;
          }
        }
      }
      return true;
    } catch (err) {
      console.error('Error checking room availability:', err);
      // fail-safe: consider unavailable if error occurred
      return false;
    }
  };

  const calculateTotal = () => {
    const rt = roomTypes.find(rt => rt.id === formData.roomType);
    if (!rt || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate base room price
    let roomPricePerNight = rt.price;
    
    // Add additional guest charges if guests exceed base capacity
    const extraGuests = Math.max(0, formData.guests - rt.baseGuests);
    if (extraGuests > 0) {
      roomPricePerNight += extraGuests * rt.additionalGuestPrice;
    }
    
    const subtotal = roomPricePerNight * nights;
    const vatRate = 0.12; // 12% VAT only
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    return Math.round(total * 100) / 100;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      const ok = await validateStep2();
      if (ok) {
        const total = calculateTotal();
        setFormData(prev => ({ ...prev, totalAmount: total }));
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    // final validation
    const ok = await validateStep2();
    if (!ok) return;

    const bookingId = `WI${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const roomTypeName = roomTypes.find(rt => rt.id === formData.roomType)?.name || formData.roomType;
    const newBooking = {
      id: bookingId,
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      roomType: formData.roomType,
      roomTypeName,
      roomNumber: formData.roomNumber,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      status: 'checked-in' as const,
      totalAmount: formData.totalAmount,
      paymentStatus: formData.paymentReceived >= formData.totalAmount ? 'paid' as const : 'pending' as const,
      paymentMethod: formData.paymentMethod,
      specialRequests: formData.specialRequests,
      bookingType: 'walk-in',
      createdAt: new Date().toISOString(),
    };

    // callback to parent - parent can save to Firestore if desired
    onBooking(newBooking);
    onClose();

    // Reset form
    setStep(1);
    setFormData({
      guestName: '', email: '', phone: '', idType: 'passport', idNumber: '', address: '',
      roomType: '', roomNumber: '', guests: 1, 
      checkIn: new Date().toISOString().split('T')[0], checkOut: '', nights: 1,
      totalAmount: 0, paymentMethod: 'cash', paymentReceived: 0, specialRequests: '',
    });
  };

  const getAvailableRoomsForType = async (roomTypeId: string) => {
    // Return rooms of a type that are currently marked available and not booked for chosen dates.
    const candidates = rooms.filter(r => r.type === roomTypeId);
    const results: Array<any> = [];
    try {
      const roomsSnap = await getDocs(collection(db, 'rooms'));
      const roomDocMap: Record<string, any> = {};
      roomsSnap.docs.forEach(d => { roomDocMap[d.id] = d.data(); });

      for (const r of candidates) {
        const roomData = roomDocMap[r.number] || null;
        const status = roomData?.status || r.status || 'available';

        // if no dates provided, include only those currently marked available
        if (!formData.checkIn || !formData.checkOut) {
          if (status === 'available') results.push(r);
          continue;
        }

        // if dates provided, check bookings for conflicts and room status
        if (status !== 'available') continue;
        const ok = await isRoomAvailableForDates(r.number, formData.checkIn, formData.checkOut);
        if (ok) results.push(r);
      }
    } catch (e) {
      console.warn('Failed to fetch rooms collection for availability checks', e);
    }
    return results;
  };

  // Renderers remain largely same, but available rooms are loaded from Firestore/rooms state
  const renderStep1 = () => (
    // ...existing code...
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Information</h3>
      {/* form fields unchanged */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.guestName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter guest name"
          />
          {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="guest@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="+63 9XX XXX XXXX"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
          <select
            value={formData.idType}
            onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
            title="ID Type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
          >
            <option value="passport">Passport</option>
            <option value="drivers-license">Driver's License</option>
            <option value="national-id">National ID</option>
            <option value="sss">SSS ID</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.idNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
            errors.idNumber ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter ID number"
        />
        {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
          placeholder="Complete address"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.roomType}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, roomType: e.target.value, roomNumber: '' }));
          }}
          title="Room Type"
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

      {formData.roomType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Rooms <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.roomNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
            title="Available Rooms"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.roomNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">{loadingRooms ? 'Loading...' : 'Select room'}</option>
            {rooms
              .filter(r => r.type === formData.roomType)
              .map(room => (
                <option key={room.number} value={room.number} disabled={room.status !== 'available'}>
                  Room {room.number} {room.status !== 'available' ? `(${room.status})` : ''}
                </option>
              ))
            }
          </select>
          {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
          <p className="mt-2 text-xs text-gray-500">Note: Final availability will be checked against active bookings.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <input
            type="date"
            value={formData.checkIn}
            title="Check-in Date"
            onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.checkOut}
            title="Check-out Date"
            onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.checkOut ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
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
    </div>
  );

  const renderStep3 = () => {
    const total = calculateTotal();
    const remainingBalance = total - formData.paymentReceived;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment & Confirmation</h3>
        
        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Guest:</span>
              <span className="font-medium">{formData.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span>Room:</span>
              <span className="font-medium">
                {roomTypes.find(rt => rt.id === formData.roomType)?.name} - Room {formData.roomNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dates:</span>
              <span className="font-medium">
                {new Date(formData.checkIn).toLocaleDateString()} - {new Date(formData.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span className="font-medium">{formData.guests}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total Amount:</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Received</label>
            <input
              type="number"
              value={formData.paymentReceived}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentReceived: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
              placeholder="0"
            />
          </div>
        </div>

        {remainingBalance > 0 && (
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Remaining Balance: ₱{remainingBalance.toLocaleString()}</strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Walk-in Booking" size="lg">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum 
                  ? 'bg-heritage-green text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step > stepNum ? 'bg-heritage-green' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div>
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90"
              >
                Complete Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};