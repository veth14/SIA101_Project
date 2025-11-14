import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { db } from '../../../config/firebase';
import { 
  collection, query, where, getDocs, 
  doc, getDoc, Timestamp, setDoc 
} from 'firebase/firestore';

// --- TYPE DEFINITIONS ---
// (It's best to move this to a shared types file, but it can stay here)
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

// --- PROPS ---
interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingData | null; // Allow null
  onSave: (updatedReservation: BookingData) => void;
}

// --- CONSTANTS ---
const localRoomTypes = [
  { id: 'standard', name: 'Silid Payapa', price: 2500, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 500 },
  { id: 'deluxe', name: 'Silid Marahuyo', price: 3800, baseGuests: 2, maxGuests: 5, additionalGuestPrice: 750 },
  { id: 'suite', name: 'Silid Ginhawa', price: 5500, baseGuests: 4, maxGuests: 6, additionalGuestPrice: 1000 },
  { id: 'family', name: 'Silid Haraya', price: 8000, baseGuests: 4, maxGuests: 8, additionalGuestPrice: 1200 },
];

// --- HELPER FUNCTIONS ---
const normalizeTypeInput = (raw: any) => {
  if (!raw) return '';
  const s = raw.toString().trim().toLowerCase();
  if (localRoomTypes.some(rt => rt.id === s)) return s;
  if (s === 'standard room' || s === 'silid payapa') return 'standard';
  if (s === 'deluxe room' || s === 'silid marahuyo') return 'deluxe';
  if (s === 'suite room' || s === 'silid ginhawa') return 'suite';
  if (s === 'family suite' || s === 'silid haraya' || s === 'premium family suite') return 'family';
  return s;
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
export const EditReservationModal = ({ isOpen, onClose, reservation, onSave }: EditReservationModalProps) => {
  
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    roomType: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    paymentMethod: 'cash',
    paymentReceived: 0,
    gcashName: '',
    gcashNumber: '',
    cardholderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- NEW ---
  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Populate form data from reservation
  useEffect(() => {
    if (reservation) {
      setFormData({
        guestName: reservation.userName,
        email: reservation.userEmail,
        roomType: normalizeTypeInput(reservation.roomType),
        roomNumber: reservation.roomNumber || '',
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        paymentMethod: reservation.paymentDetails.paymentMethod || 'cash',
        paymentReceived: 0, // Set by the effect below
        gcashName: reservation.paymentDetails.gcashName || '',
        gcashNumber: reservation.paymentDetails.gcashNumber || '',
        cardholderName: reservation.paymentDetails.cardholderName || '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
      });
    }
  }, [reservation]);

  // Calculate balance due
  useEffect(() => {
    if (!isOpen || !reservation) return;
    
    const newPricing = calculatePricing(); // Uses formData, so must be after state is set
    const newTotalAmount = newPricing.totalAmount;
    
    const previouslyPaidAmount = reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0;
    
    let balanceDue = newTotalAmount - previouslyPaidAmount;
    if (balanceDue < 0) balanceDue = 0; 
    
    setFormData(prev => ({
      ...prev,
      paymentReceived: Math.round(balanceDue * 100) / 100
    }));
    
  }, [formData.checkIn, formData.checkOut, formData.guests, formData.roomType, isOpen, reservation]);


  // --- All business logic (handlers, data fetching) remains unchanged ---
  
  // validateForm (unchanged)
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Only check past date if it's not already checked-in
    if (reservation && reservation.status !== 'checked-in' && checkIn < today) {
      newErrors.checkIn = 'Check-in date cannot be in the past';
    }
    if (checkOut <= checkIn) {
      newErrors.checkOut = 'Check-out must be after check-in date';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const selectedRoomType = localRoomTypes.find(rt => rt.id === formData.roomType);
    if (selectedRoomType && formData.guests > selectedRoomType.maxGuests) {
      newErrors.guests = `Max ${selectedRoomType.maxGuests} guests for this room`;
    }

    if (formData.paymentMethod === 'gcash') {
      if (!formData.gcashName.trim()) newErrors.gcashName = 'GCash name is required';
      if (!formData.gcashNumber.trim()) newErrors.gcashNumber = 'GCash number is required';
      else if (formData.gcashNumber.replace(/\D/g, '').length < 11) newErrors.gcashNumber = 'Must be a valid 11-digit number';
    }
    if (formData.paymentMethod === 'card') {
      if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (formData.cardNumber.replace(/\D/g, '').length < 15) newErrors.cardNumber = 'Must be a valid card number';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Must be MM/YY format';
      if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV is required';
      else if (formData.cardCvv.replace(/\D/g, '').length < 3) newErrors.cardCvv = 'Must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // calculatePricing (unchanged)
  const calculatePricing = () => {
    const rt = localRoomTypes.find(rt => rt.id === formData.roomType);
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
      basePrice: Math.round(basePrice * 100) / 100,
      roomPricePerNight: Math.round(roomPricePerNight * 100) / 100,
      additionalGuestPrice,
      baseGuests,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      taxRate,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  };

  // handleSave (unchanged)
  const handleSave = async () => {
    if (!validateForm() || !reservation) return;

    // 1. Check room availability
    if (formData.roomNumber && reservation && formData.roomNumber !== reservation.roomNumber) {
      try {
        const roomDoc = await getDoc(doc(db, 'rooms', formData.roomNumber));
        const roomData = roomDoc.exists() ? roomDoc.data() : null;
        const status = roomData?.status || 'available';
        const isActive = roomData?.isActive === false ? false : true;
        if (status !== 'available' || !isActive) {
          setErrors(prev => ({ ...prev, roomNumber: 'Selected room is currently marked unavailable' }));
          return;
        }
      } catch (e) { console.warn('Could not read room doc before save:', e); }

      const ok = await isRoomAvailableForDates(formData.roomNumber, formData.checkIn, formData.checkOut);
      if (!ok) {
        setErrors(prev => ({ ...prev, roomNumber: 'Selected room is not available for those dates' }));
        return;
      }
    }

    // 2. Get new pricing
    const newPricing = calculatePricing();
    const newTotalAmount = newPricing.totalAmount;

    // 3. Get new room name
    const roomTypeData = localRoomTypes.find(rt => rt.id === formData.roomType);
    const newRoomName = roomTypeData ? roomTypeData.name : 'Unknown Room';

    // 4. Determine new payment status
    const previouslyPaidAmount = reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0;
    const amountPaidNow = Number(formData.paymentReceived) || 0;
    const totalPaid = previouslyPaidAmount + amountPaidNow;

    const newPaymentStatus = totalPaid >= newTotalAmount ? 'paid' : 'pending';
    
    let newPaidAt: Timestamp | null = reservation.paymentDetails.paidAt;
    if (newPaymentStatus === 'paid' && reservation.paymentDetails.paymentStatus === 'pending') {
      newPaidAt = Timestamp.now();
    }
    if (newPaymentStatus === 'pending') {
      newPaidAt = null;
    }

    // 5. Build final object
    const updatedReservation: BookingData = {
      ...reservation,
      userName: formData.guestName,
      userEmail: formData.email,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      roomType: formData.roomType,
      roomName: newRoomName,
      roomNumber: formData.roomNumber || null,
      ...newPricing,
      paymentDetails: {
        ...reservation.paymentDetails,
        cardLast4: formData.paymentMethod === 'card' ? formData.cardNumber.slice(-4) : (formData.paymentMethod === 'gcash' ? null : reservation.paymentDetails.cardLast4),
        cardholderName: formData.paymentMethod === 'card' ? formData.cardholderName : (formData.paymentMethod === 'gcash' ? null : reservation.paymentDetails.cardholderName),
        gcashName: formData.paymentMethod === 'gcash' ? formData.gcashName : (formData.paymentMethod === 'card' ? null : reservation.paymentDetails.gcashName),
        gcashNumber: formData.paymentMethod === 'gcash' ? formData.gcashNumber : (formData.paymentMethod === 'card' ? null : reservation.paymentDetails.gcashNumber),
        paymentMethod: formData.paymentMethod, 
        paymentStatus: newPaymentStatus,
        paidAt: newPaidAt,
      },
    };

    // 6. Update room documents
    try {
      const prevRoom = reservation?.roomNumber;
      const newRoom = formData.roomNumber || null;
      if (newRoom && newRoom !== prevRoom) {
        await setDoc(doc(db, 'rooms', newRoom), {
          status: 'occupied', isActive: false, currentReservation: reservation.bookingId, 
        }, { merge: true });
      }
      if (prevRoom && prevRoom !== newRoom) {
        await setDoc(doc(db, 'rooms', prevRoom), {
          status: 'available', isActive: true, currentReservation: null,
        }, { merge: true });
      }
    } catch (err) {
      console.error('Error updating room documents:', err);
    }

    // 7. Pass object back
    onSave(updatedReservation);
  };
  
  // Room fetching logic (unchanged)
  const [rooms, setRooms] = useState<Array<any>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<Array<any>>([]);

  const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    const start2 = new Date(checkIn2);
    const end2 = new Date(checkOut2);
    return start1 < end2 && start2 < end1;
  };

  const isRoomAvailableForDates = async (roomNumber: string, checkIn: string, checkOut: string) => {
    if (!roomNumber || !checkIn || !checkOut || !reservation) return false;
    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(bookingsCol, where('roomNumber', '==', roomNumber), where('status', 'in', ['confirmed', 'checked-in']));
      const snap = await getDocs(q);
      const existing = snap.docs.map(d => (d.data() as any));
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
            const normalizeType = (raw: any) => normalizeTypeInput(raw || 'standard');
            setRooms(fetched.map((r: any) => ({
              number: r.number || r.id || r.roomNumber,
              type: normalizeType(r.type || r.roomType),
              status: r.status || 'available',
            })));
          } else {
            setRooms([]);
          }
        }
      } catch (err) {
        console.warn('Could not fetch rooms from Firestore.', err);
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
      if (!formData.roomType) {
        setFilteredRooms([]);
        return;
      }
      const candidates = rooms.filter(r => r.type === formData.roomType);
      const results: Array<any> = [];
      try {
        const roomsSnap = await getDocs(collection(db, 'rooms'));
        const roomDocMap: Record<string, any> = {};
        roomsSnap.docs.forEach(d => { roomDocMap[d.id] = d.data(); });
        for (const r of candidates) {
          if (reservation && r.number === reservation.roomNumber) {
            results.push(r);
            continue;
          }
          const roomData = roomDocMap[r.number] || null;
          const status = roomData?.status || r.status || 'available';
          if (!formData.checkIn || !formData.checkOut) {
            if (status === 'available') results.push(r);
            continue;
          }
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
  
  // Helper calculations for JSX
  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };
  
  const selectedRoomName = localRoomTypes.find(rt => rt.id === formData.roomType)?.name || "No room selected";

  // Conditional form render functions (unchanged)
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


  // --- NEW ---
  // Guard clause
  if (!isOpen || !reservation) {
    return null;
  }

  // --- NEW ---
  // Return the new modal structure
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={onClose}
        aria-label="Close overlay"
      />

      {/* Modal Card (using max-w-4xl for "xl" size) */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5">
        
        {/* Header (branded) */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <IconCalendar />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold md:text-2xl text-emerald-700">Edit Reservation</h2>
                <p className="mt-1 text-sm text-gray-500">{reservation.bookingId}</p>
              </div>
            </div>
          </div>

          {/* Close button (small subtle) */}
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

            {/* --- Left Column: Form Fields --- */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Guest Information - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* --- CHANGED TO H4 --- */}
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconUser />
                  <span className="ml-2">Guest Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-3 py-2 border rounded-md ${errors.guestName ? 'border-red-300' : 'border-gray-300'}`}
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
                      className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                    <select
                      title="Number of Guests"
                      value={formData.guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-md ${errors.guests ? 'border-red-300' : 'border-gray-300'}`}
                    >
                      {Array.from(
                        { length: formData.roomType ? 
                          (localRoomTypes.find(rt => rt.id === formData.roomType)?.maxGuests || 8) : 8 
                        }, 
                        (_, i) => i + 1
                      ).map(num => (
                        <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                      {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
                  </div>
                </div>
              </div>

              {/* Booking Details - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* --- CHANGED TO H4 --- */}
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconCalendar />
                  <span className="ml-2">Booking Details</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-3 py-2 border rounded-md ${errors.roomType ? 'border-red-300' : 'border-gray-300'}`}
                    >
                      <option value="">Select room type</option>
                      {localRoomTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
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
                      className={`w-full px-3 py-2 border rounded-md ${errors.roomNumber ? 'border-red-300' : 'border-gray-300'}`}
                      disabled={!formData.roomType || loadingRooms}
                    >
                      <option value="">{loadingRooms ? 'Loading rooms...' : 'Select room (optional)'}</option>
                      {filteredRooms && filteredRooms.length > 0 ? (
                        filteredRooms.map((room: any) => (
                          <option key={room.number} value={room.number}>
                            Room {room.number}
                          </option>
                        ))
                      ) : (
                        !loadingRooms && formData.roomType && <option value="" disabled>No rooms available</option>
                      )}
                    </select>
                    {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
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
                      className={`w-full px-3 py-2 border rounded-md ${errors.checkIn ? 'border-red-300' : 'border-gray-300'}`}
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
                      className={`w-full px-3 py-2 border rounded-md ${errors.checkOut ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
                  </div>
                </div>
              </div>
              
              {/* Payment Section - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* --- CHANGED TO H4 --- */}
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconCreditCard />
                  <span className="ml-2">Payment</span>
                </h4>

                {/* Price change summary - UPDATED STYLING (like a banner) */}
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Original Total:</span>
                      <span className="font-medium">
                        ₱{reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className={`font-medium ${reservation.paymentDetails.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {reservation.paymentDetails.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <hr className="my-2"/>
                    <div className="flex justify-between text-base">
                      <span>New Total:</span>
                      <span className="font-semibold">
                        ₱{calculatePricing().totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-emerald-700">
                      <span>Balance Due:</span>
                      <span>
                        ₱{formData.paymentReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment inputs */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Received Now</label>
                    <input
                      type="number"
                      value={formData.paymentReceived}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentReceived: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Conditional Payment Forms */}
                {formData.paymentMethod === 'gcash' && renderGcashForm()}
                {formData.paymentMethod === 'card' && renderCardForm()}
              </div>

            </div>

            {/* --- Right Column: Summary (Actions removed) --- */}
            <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
              
              {/* Summary Card - UPDATED STYLING */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                {/* --- CHANGED TO H4 --- */}
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Summary</h4>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Room:</span>
                    <span className="font-semibold text-gray-900 ml-2">{selectedRoomName}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Check-in:</span>
                    <span className="font-semibold text-gray-900 ml-2">{formatDate(formData.checkIn)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Check-out:</span>
                    <span className="font-semibold text-gray-900 ml-2">{formatDate(formData.checkOut)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="font-semibold text-gray-900 ml-2">{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Guests:</span>
                    <span className="font-semibold text-gray-900 ml-2">{formData.guests} guest{formData.guests > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Total Amount Card - UPDATED STYLING (like a banner) */}
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="block text-sm font-medium text-green-800">Updated Total Amount</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  ₱{calculatePricing().totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {calculatePricing().totalAmount !== reservation.totalAmount && (
                  <p className="text-sm text-orange-600 mt-2">
                    Previous: ₱{reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>
              
              {/* Action buttons were MOVED from here to the footer */}

            </div>
          </div>
        </div>
        
        {/* Footer Actions - NEW */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
            
            {/* Secondary Action */}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white/80 rounded-2xl shadow-sm hover:bg-gray-50 transition transform"
              title="Cancel changes"
            >
              Cancel
            </button>
            
            {/* Primary Action */}
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save changes to reservation"
            >
              <IconSave />
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};


// --- Icon Components (Moved to bottom) ---
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconSave = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);
const IconCreditCard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);