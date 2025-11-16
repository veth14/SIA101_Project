import { useState, useEffect } from 'react';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from 'firebase/firestore'; 

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooking: (booking: any) => void;
}

const defaultRoomTypes = [
  { id: 'standard', name: 'Silid Payapa', price: 2500, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 500 },
  { id: 'deluxe', name: 'Silid Marahuyo', price: 3800, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 750 },
  { id: 'suite', name: 'Silid Ginhawa', price: 5500, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 1000 },
  { id: 'family', name: 'Silid Haraya', price: 8000, baseGuests: 4, maxGuests: 8, additionalGuestPrice: 1200 },
];

const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
  const start1 = new Date(checkIn1);
  const end1 = new Date(checkOut1);
  const start2 = new Date(checkIn2);
  const end2 = new Date(checkOut2);
  return start1 < end2 && start2 < end1;
};

export const WalkInModal = ({ isOpen, onClose, onBooking }: WalkInModalProps) => {
  const [step, setStep] = useState(1);
  const [roomTypes, setRoomTypes] = useState<Array<any>>([]);
  const [rooms, setRooms] = useState<Array<any>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  
  // --- NEW ---
  // State for the auto-assignment logic
  const [availableRooms, setAvailableRooms] = useState<Array<any>>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  // --- END NEW ---

  const [formData, setFormData] = useState({
    // ... (formData fields remain the same)
    guestName: '',
    email: '',
    phone: '',
    idType: 'passport',
    idNumber: '',
    address: '',
    roomType: '',
    roomNumber: '',
    guests: 1,
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: '',
    nights: 1,
    totalAmount: 0,
    paymentMethod: 'cash',
    paymentReceived: 0,
    gcashName: '',
    gcashNumber: '',
    cardholderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  interface RoomType {
    id: string;
    name: string;
    price: number;
    maxGuests: number;
    baseGuests: number;
    additionalGuestPrice: number;
  }

  // useEffect to fetch room types and all rooms (remains the same)
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoadingRooms(true);
      try {
        // ... (existing data fetching logic)
        const rtCol = collection(db, 'roomTypes');
        const rtSnap = await getDocs(rtCol);
        const fetchedTypes = rtSnap.docs.map(d => ({ id: d.id, ...d.data() } as RoomType));
        
        if (mounted) {
              if (fetchedTypes.length > 0) {
            setRoomTypes(fetchedTypes.map(t => ({
              id: t.id,
              name: t.name || t.id,
              price: typeof t.price === 'number' ? t.price : Number(t.price || 0),
              maxGuests: t.maxGuests || 4,
              baseGuests: t.baseGuests || 2,
              additionalGuestPrice: t.additionalGuestPrice || (Number(t.price || 0) * 0.2)
            })));
          } else {
            console.warn('No roomTypes found in Firestore `roomTypes` collection, using default room types.');
            setRoomTypes(defaultRoomTypes);
          }

          const roomsCol = collection(db, 'rooms');
          const roomsSnap = await getDocs(roomsCol);
          const fetchedRooms = roomsSnap.docs.map(d => ({ number: d.id, ...d.data() }));
          
          if (fetchedRooms.length > 0) {
            const validTypes = fetchedTypes.length > 0 ? fetchedTypes : defaultRoomTypes;
            const typeMap: Record<string, string> = {};
            validTypes.forEach((t: RoomType) => {
              typeMap[t.id] = t.id;
              typeMap[t.name.toLowerCase()] = t.id;
              const baseName = t.name.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
              typeMap[baseName] = t.id;
            });

            const normalizeType = (raw: any) => {
              if (!raw) return 'standard';
              const input = raw.toString().toLowerCase();
              if (validTypes.some(t => t.id === input)) return input;
              const withoutSilid = input.replace(/\s*\([^)]*\)/, '').trim();
              if (typeMap[input]) return typeMap[input];
              if (typeMap[withoutSilid]) return typeMap[withoutSilid];
              const fallbackMap: Record<string, string> = {
                'standard': 'standard', 'standard room': 'standard',
                'deluxe': 'deluxe', 'deluxe room': 'deluxe',
                'suite': 'suite', 'suite room': 'suite',
                'family': 'family', 'family suite': 'family', 'premium family suite': 'family'
              };
              return fallbackMap[withoutSilid.toLowerCase()] || 'standard';
            };

            setRooms(fetchedRooms.map((r: any) => ({
              number: r.number || r.id || r.roomNumber,
              type: normalizeType(r.type || r.roomType),
              status: r.status || 'available',
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

  // isRoomAvailableForDates (helper function remains the same)
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
      return false;
    }
  };

  // --- NEW ---
  // This effect finds all truly available rooms when dates or room type change
  useEffect(() => {
    const findAvailableRooms = async () => {
      // Don't run if we don't have all the info
      if (!formData.roomType || !formData.checkIn || !formData.checkOut || rooms.length === 0) {
        setAvailableRooms([]);
        return;
      }

      // Check that checkout is after checkin
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      if (checkOut <= checkIn) {
        setAvailableRooms([]);
        return;
      }

      setIsCheckingAvailability(true);
      
      // 1. Get all rooms of the correct type and 'available' status
      const candidateRooms = rooms.filter(r => r.type === formData.roomType && r.status === 'available');
      
      // 2. Check availability (booking conflicts) for each one
      const availabilityChecks = candidateRooms.map(room => 
        isRoomAvailableForDates(room.number, formData.checkIn, formData.checkOut)
      );
      
      const results = await Promise.all(availabilityChecks);
      
      // 3. Filter down to only the available ones
      const trulyAvailableRooms = candidateRooms.filter((_, index) => results[index]);
      
      setAvailableRooms(trulyAvailableRooms);
      setIsCheckingAvailability(false);
    };

    findAvailableRooms();
  }, [formData.roomType, formData.checkIn, formData.checkOut, rooms]); // Runs when these change
  // --- END NEW ---

  // --- NEW ---
  // This effect auto-selects the first available room
  useEffect(() => {
    if (isCheckingAvailability) return; // Wait until the check is complete

    if (availableRooms.length > 0) {
      // Check if the currently selected room is STILL in the available list.
      const currentSelectionIsValid = availableRooms.some(r => r.number === formData.roomNumber);
      
      // If the selection is invalid (or empty), auto-select the first one.
      if (!currentSelectionIsValid) {
        setFormData(prev => ({ ...prev, roomNumber: availableRooms[0].number }));
      }
      // If it's valid, we do nothing and leave the user's manual selection.
    } else {
      // No rooms are available. Clear the selection.
      setFormData(prev => ({ ...prev, roomNumber: '' }));
    }
  }, [availableRooms, isCheckingAvailability]); // Runs when the list of available rooms changes
  // --- END NEW ---

  // validateStep1 (remains the same)
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      newErrors.phone = 'Phone number must have at least 11 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // validateStep2 (remains the same, but we add a check for the new list)
  const validateStep2 = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    
    // --- UPDATED ---
    // We can now check our pre-fetched list
    if (availableRooms.length === 0) {
      newErrors.roomNumber = 'No rooms are available for these dates';
    }
    // --- END UPDATED ---

    if (!formData.roomNumber) newErrors.roomNumber = 'Room selection is required';
    
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

    // Final check on the selected room (this is good redundancy)
    const isAvailable = await isRoomAvailableForDates(formData.roomNumber, formData.checkIn, formData.checkOut);
    if (!isAvailable) {
      setErrors({ roomNumber: 'Selected room is not available for those dates' });
      return false;
    }

    return true;
  };

  // validateStep3 (remains the same)
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (formData.paymentMethod === 'gcash') {
      if (!formData.gcashName.trim()) {
        newErrors.gcashName = 'GCash name is required';
      }
      if (!formData.gcashNumber.trim()) {
        newErrors.gcashNumber = 'GCash number is required';
      } else if (formData.gcashNumber.replace(/\D/g, '').length < 11) {
         newErrors.gcashNumber = 'Must be a valid 11-digit number';
      }
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\D/g, '').length < 15) {
         newErrors.cardNumber = 'Must be a valid card number';
      }
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
         newErrors.cardExpiry = 'Must be MM/YY format';
      }
      if (!formData.cardCvv.trim()) {
        newErrors.cardCvv = 'CVV is required';
      } else if (formData.cardCvv.replace(/\D/g, '').length < 3) {
         newErrors.cardCvv = 'Must be 3-4 digits';
      }
    }

    setErrors(prev => ({ 
      ...prev, 
      gcashName: newErrors.gcashName,
      gcashNumber: newErrors.gcashNumber,
      cardholderName: newErrors.cardholderName,
      cardNumber: newErrors.cardNumber,
      cardExpiry: newErrors.cardExpiry,
      cardCvv: newErrors.cardCvv,
    }));
    
    return Object.keys(newErrors).length === 0;
  }

  // calculatePricing (remains the same)
  const calculatePricing = () => {
    const rt = roomTypes.find(rt => rt.id === formData.roomType);
    if (!rt || !formData.checkOut || !formData.checkIn) {
      return {
        nights: 0, basePrice: 0, roomPricePerNight: 0,
        additionalGuestPrice: 0, baseGuests: 0,
        subtotal: 0, tax: 0, taxRate: 0.12, totalAmount: 0,
      };
    }
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    
    const basePrice = rt.price;
    const additionalGuestPrice = rt.additionalGuestPrice;
    const baseGuests = rt.baseGuests;
    
    const extraGuests = Math.max(0, formData.guests - baseGuests);
    const roomPricePerNight = basePrice + (extraGuests * additionalGuestPrice);
    
    const subtotal = roomPricePerNight * nights;
    const taxRate = 0.12;
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + tax;

    return {
      nights,
      basePrice: basePrice,
      roomPricePerNight: Math.round(roomPricePerNight * 100) / 100,
      additionalGuestPrice,
      baseGuests,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      taxRate,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  };

  // handleNext (bug fix from before is retained)
  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      const ok = await validateStep2();
      if (ok) {
        const { totalAmount } = calculatePricing();
        setFormData(prev => ({ 
          ...prev, 
          totalAmount: totalAmount, 
          paymentReceived: totalAmount // Pre-fill with full amount
        }));
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  // handleSubmit (logic fix from before is retained)
  const handleSubmit = async () => {
    const step2Ok = await validateStep2();
    if (!step2Ok) return;
    const step3Ok = validateStep3();
    if (!step3Ok) return;

    const pricingDetails = calculatePricing();
    const {
      nights, basePrice, roomPricePerNight, additionalGuestPrice,
      baseGuests, subtotal, tax, taxRate, totalAmount,
    } = pricingDetails;

    const paymentReceived = typeof formData.paymentReceived === 'number' ? formData.paymentReceived : 0;
    const paymentStatus = paymentReceived >= totalAmount ? 'paid' : 'pending';
    
    const now = new Date();
    const firestoreTimestamp = Timestamp.fromDate(now);
    const todayString = now.toISOString().split('T')[0]; 
    const bookingStatus = (formData.checkIn === todayString) ? 'checked-in' : 'confirmed';

    const selectedRoomType = roomTypes.find(rt => rt.id === formData.roomType);
    const roomName = selectedRoomType?.name || 'Unknown Room';
    const roomType = selectedRoomType?.id || formData.roomType;
    const roomNumber = formData.roomNumber; 

    const bookingId = `BK${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
    const userId = `U${Date.now()}${Math.random().toString(36).substring(2, 7)}`;

    const newBooking = {
      additionalGuestPrice: additionalGuestPrice,
      baseGuests: baseGuests,
      basePrice: basePrice,
      bookingId: bookingId,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      createdAt: firestoreTimestamp,
      guests: Number(formData.guests),
      nights: nights,
      paymentDetails: {
        cardLast4: formData.paymentMethod === 'card' ? formData.cardNumber.slice(-4) : null,
        cardholderName: formData.paymentMethod === 'card' ? formData.cardholderName : null,
        gcashName: formData.paymentMethod === 'gcash' ? formData.gcashName : null,
        gcashNumber: formData.paymentMethod === 'gcash' ? formData.gcashNumber : null,
        paidAt: paymentStatus === 'paid' ? firestoreTimestamp : null,
        paymentMethod: formData.paymentMethod,
        paymentStatus: paymentStatus,
      },
      roomName: roomName,
      roomPricePerNight: roomPricePerNight,
      roomType: roomType,
      roomNumber: roomNumber,
      status: bookingStatus,
      subtotal: subtotal,
      tax: tax,
      taxRate: taxRate,
      totalAmount: totalAmount,
      updatedAt: firestoreTimestamp,
      userEmail: formData.email,
      userId: userId, 
      userName: formData.guestName,
    };

    onBooking(newBooking);
    onClose();

    // Reset form
    setStep(1);
    setFormData({
      guestName: '', email: '', phone: '', idType: 'passport', idNumber: '', address: '',
      roomType: '', roomNumber: '', guests: 1, 
      checkIn: new Date().toISOString().split('T')[0], checkOut: '', nights: 1,
      totalAmount: 0, paymentMethod: 'cash', paymentReceived: 0, specialRequests: '',
      gcashName: '', gcashNumber: '', cardholderName: '',
      cardNumber: '', cardExpiry: '', cardCvv: '',
    });
  };

  // renderStep1 (remains the same)
  const renderStep1 = () => (
    <div className="space-y-4">
      <label className="text-lg font-medium text-gray-900 mb-4">Guest Information</label>
      {/* ... (all form fields remain the same) ... */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md ${errors.guestName ? 'border-red-300' : 'border-gray-300'}`}
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
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
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
            className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
          className={`w-full px-3 py-2 border rounded-md ${errors.idNumber ? 'border-red-300' : 'border-gray-300'}`}
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
          placeholder="Complete address"
        />
      </div>
    </div>
  );

  // --- UPDATED ---
  // renderStep2 now uses the new 'availableRooms' state
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
          className={`w-full px-3 py-2 border rounded-md ${errors.roomType ? 'border-red-300' : 'border-gray-300'}`}
        >
          <option value="">Select room type</option>
          {roomTypes.map(type => {
            return (
              <option key={type.id} value={type.id}>
                {type.name} - ₱{type.price.toLocaleString()}/night
              </option>
            );
          })}
        </select>
        {errors.roomType && <p className="text-red-500 text-xs mt-1">{errors.roomType}</p>}
      </div>

      {/* This 'Available Rooms' dropdown is now powered by the new logic */}
      {formData.roomType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Rooms <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.roomNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
            title="Available Rooms"
            className={`w-full px-3 py-2 border rounded-md ${errors.roomNumber ? 'border-red-300' : 'border-gray-300'}`}
            disabled={isCheckingAvailability} // Disable while checking
          >
            <option value="">
              {isCheckingAvailability 
                ? 'Checking availability...' 
                : (availableRooms.length > 0 ? 'Select room' : 'No rooms available')}
            </option>
            {/* We map over the new 'availableRooms' state */}
            {availableRooms.map(room => (
              <option key={room.number} value={room.number}>
                Room {room.number}
              </option>
            ))}
          </select>
          {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
        </div>
      )}
      {/* --- END UPDATED --- */}


      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <input
            type="date"
            value={formData.checkIn}
            title="Check-in Date"
            onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className={`w-full px-3 py-2 border rounded-md ${errors.checkOut ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <select
            title="Number of Guests"
            value={formData.guests}
            onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {Array.from(
              { length: formData.roomType ? 
                (roomTypes.find(rt => rt.id === formData.roomType)?.maxGuests || 4) : 4 
              }, 
              (_, i) => i + 1
            ).map(num => (
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
          placeholder="Any special requests or preferences..."
        />
      </div>
    </div>
  );
  // --- END UPDATED ---

  // renderStep3 (remains the same)
  const renderStep3 = () => {
    const { totalAmount } = calculatePricing();
    const remainingBalance = totalAmount - formData.paymentReceived;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment & Confirmation</h3>
        
        {/* Booking Summary (remains the same) */}
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
                {(() => {
                  return roomTypes.find(rt => rt.id === formData.roomType)?.name || formData.roomType;
                })()} - Room {formData.roomNumber}
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
              <span>₱{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment (remains the same) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
                title="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => {
                  setErrors({}); 
                  setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="gcash">GCash</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Received</label>
            <input
              type="number"
              value={formData.paymentReceived}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentReceived: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0"
            />
          </div>
        </div>

        {/* Conditional Payment Forms (remains the same) */}
        {formData.paymentMethod === 'gcash' && renderGcashForm()}
        {formData.paymentMethod === 'card' && renderCardForm()}


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
  
  // renderGcashForm (remains the same)
  const renderGcashForm = () => (
    <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GCash Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.gcashName}
          onChange={(e) => setFormData(prev => ({ ...prev, gcashName: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md ${errors.gcashName ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Juan Dela Cruz"
        />
        {errors.gcashName && <p className="text-red-500 text-xs mt-1">{errors.gcashName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GCash Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.gcashNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, gcashNumber: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md ${errors.gcashNumber ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="0917XXXXXXX"
        />
        {errors.gcashNumber && <p className="text-red-500 text-xs mt-1">{errors.gcashNumber}</p>}
      </div>
    </div>
  );

  // renderCardForm (remains the same)
  const renderCardForm = () => (
    <div className="space-y-4 mt-4 border-t pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md ${errors.cardholderName ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Juan Dela Cruz"
        />
        {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.cardNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="0000 0000 0000 0000"
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.cardExpiry}
            onChange={(e) => setFormData(prev => ({ ...prev, cardExpiry: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md ${errors.cardExpiry ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="MM/YY"
          />
          {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.cardCvv}
            onChange={(e) => setFormData(prev => ({ ...prev, cardCvv: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md ${errors.cardCvv ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="123"
          />
          {errors.cardCvv && <p className="text-red-500 text-xs mt-1">{errors.cardCvv}</p>}
        </div>
      </div>
    </div>
  );

  // Modal Render (remains the same)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Reservation" size="lg">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-4">
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