import { useState, useEffect } from 'react';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { 
  collection, query, where, getDocs, 
  updateDoc, doc, getDoc, Timestamp, setDoc 
} from 'firebase/firestore';

// --- Icon Components (Added payment icons) ---
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconSave = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);
// --- NEW ---
const IconCreditCard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);
// --- END NEW ---


// BookingData interface (remains the same)
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

// Props (remains the same)
interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingData;
  onSave: (updatedReservation: BookingData) => void;
}

// localRoomTypes (I've updated maxGuests from your file to be more varied)
const localRoomTypes = [
  { id: 'standard', name: 'Silid Payapa', price: 2500, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 500 },
  { id: 'deluxe', name: 'Silid Marahuyo', price: 3800, baseGuests: 2, maxGuests: 5, additionalGuestPrice: 750 },
  { id: 'suite', name: 'Silid Ginhawa', price: 5500, baseGuests: 4, maxGuests: 6, additionalGuestPrice: 1000 },
  { id: 'family', name: 'Silid Haraya', price: 8000, baseGuests: 4, maxGuests: 8, additionalGuestPrice: 1200 },
];


export const EditReservationModal = ({ isOpen, onClose, reservation, onSave }: EditReservationModalProps) => {
  
  // --- UPDATED ---
  // Added all payment fields from WalkInModal
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    roomType: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    // Payment
    paymentMethod: 'cash',
    paymentReceived: 0,
    gcashName: '',
    gcashNumber: '',
    cardholderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  // --- END UPDATED ---

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- UPDATED ---
  // Now populates payment fields
  useEffect(() => {
    if (reservation) {
      setFormData({
        guestName: reservation.userName,
        email: reservation.userEmail,
        roomType: reservation.roomType,
        roomNumber: reservation.roomNumber || '',
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        // Payment
        paymentMethod: reservation.paymentDetails.paymentMethod || 'cash',
        paymentReceived: 0, // Will be set by the new useEffect
        // Pre-fill payment details if they exist
        gcashName: reservation.paymentDetails.gcashName || '',
        gcashNumber: reservation.paymentDetails.gcashNumber || '',
        cardholderName: reservation.paymentDetails.cardholderName || '',
        // Security: Do not pre-fill sensitive card data
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
      });
    }
  }, [reservation]);
  // --- END UPDATED ---

  // --- NEW ---
  // This effect calculates the balance due and pre-fills the payment field
  useEffect(() => {
    if (!isOpen) return; // Don't run when modal is closed
    
    // Calculate new price
    const newPricing = calculatePricing();
    const newTotalAmount = newPricing.totalAmount;
    
    // Determine what was already paid
    // We assume if status is 'paid', the original total was paid.
    // If 'pending', we assume 0 was paid toward the total (a safe assumption).
    const previouslyPaidAmount = reservation.paymentDetails.paymentStatus === 'paid' ? reservation.totalAmount : 0;
    
    let balanceDue = newTotalAmount - previouslyPaidAmount;
    
    // Don't ask for negative payment if the new total is less
    if (balanceDue < 0) balanceDue = 0; 
    
    // Pre-fill paymentReceived with the exact balance due
    setFormData(prev => ({
      ...prev,
      paymentReceived: Math.round(balanceDue * 100) / 100
    }));
    
  }, [formData.checkIn, formData.checkOut, formData.guests, formData.roomType, isOpen, reservation]);
  // --- END NEW ---


  // --- UPDATED ---
  // Now includes validation for payment fields
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
    
    if (reservation.status !== 'checked-in' && checkIn < today) {
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

    // --- NEW --- Payment Validation
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
    // --- END NEW ---

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // --- END UPDATED ---

  // calculatePricing (remains the same)
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

  // --- UPDATED ---
  // handleSave is now much smarter about payment status
  const handleSave = async () => {
    if (!validateForm()) return;

    // 1. Check room availability (remains the same)
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

    // 2. Get all new pricing details
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
    // If it *just became* paid, set the timestamp
    if (newPaymentStatus === 'paid' && reservation.paymentDetails.paymentStatus === 'pending') {
      newPaidAt = Timestamp.now();
    }
    // If it's no longer paid (due to price increase), clear the timestamp
    if (newPaymentStatus === 'pending') {
      newPaidAt = null;
    }

    // 5. Build the final object
    const updatedReservation: BookingData = {
      ...reservation, // Spread original to keep userId, createdAt, status, etc.
      
      // Overwrite changed fields
      userName: formData.guestName,
      userEmail: formData.email,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      roomType: formData.roomType,
      roomName: newRoomName,
      roomNumber: formData.roomNumber || null,
      
      // Overwrite all pricing fields
      ...newPricing,
      
      // Overwrite the paymentDetails map
      paymentDetails: {
        ...reservation.paymentDetails, // Keep old card/gcash info by default
        
        // Overwrite with new form data if payment method was changed
        cardLast4: formData.paymentMethod === 'card' ? formData.cardNumber.slice(-4) : (formData.paymentMethod === 'gcash' ? null : reservation.paymentDetails.cardLast4),
        cardholderName: formData.paymentMethod === 'card' ? formData.cardholderName : (formData.paymentMethod === 'gcash' ? null : reservation.paymentDetails.cardholderName),
        gcashName: formData.paymentMethod === 'gcash' ? formData.gcashName : (formData.paymentMethod === 'card' ? null : reservation.paymentDetails.gcashName),
        gcashNumber: formData.paymentMethod === 'gcash' ? formData.gcashNumber : (formData.paymentMethod === 'card' ? null : reservation.paymentDetails.gcashNumber),
        
        // Set new method and calculated status/date
        paymentMethod: formData.paymentMethod, 
        paymentStatus: newPaymentStatus,
        paidAt: newPaidAt,
      },
    };

    // 6. Update room documents (remains the same)
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

    // 7. Pass the complete object back
    onSave(updatedReservation);
  };
  // --- END UPDATED ---

  // Room fetching state (remains the same)
  const [rooms, setRooms] = useState<Array<any>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<Array<any>>([]);

  // checkDateOverlap (remains the same)
  const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    const start2 = new Date(checkIn2);
    const end2 = new Date(checkOut2);
    return start1 < end2 && start2 < end1;
  };

  // isRoomAvailableForDates (remains the same)
  const isRoomAvailableForDates = async (roomNumber: string, checkIn: string, checkOut: string) => {
    if (!roomNumber || !checkIn || !checkOut) return false;
    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(bookingsCol, where('roomNumber', '==', roomNumber), where('status', 'in', ['confirmed', 'checked-in']));
      const snap = await getDocs(q);
      const existing = snap.docs.map(d => (d.data() as BookingData));
      for (const b of existing) {
        if (typeof b.checkIn === 'string' && typeof b.checkOut === 'string') {
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

  // fetchRooms (remains the same)
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
            const normalizeType = (raw: any) => {
              const s = (raw || 'standard').toString().toLowerCase();
              if (localRoomTypes.some(rt => rt.id === s)) return s;
              if (s === 'silid payapa') return 'standard';
              if (s === 'silid marahuyo') return 'deluxe';
              if (s === 'silid ginhawa') return 'suite';
              if (s === 'silid haraya') return 'family';
              return 'standard';
            };
            setRooms(fetched.map((r: any) => ({
              number: r.number || r.id || r.roomNumber,
              type: normalizeType(r.type || r.roomType),
              status: r.status || 'available',
            })));
          } else {
            console.warn('No rooms found in Firestore `rooms` collection.');
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

  // filterRooms (remains the same)
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

  
  // Helper Functions (remains the same)
  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const selectedRoomName = localRoomTypes.find(rt => rt.id === formData.roomType)?.name || "No room selected";

  // --- NEW ---
  // Helper functions to render conditional payment forms
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
  // --- END NEW ---


  // --- JSX (UPDATED) ---
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Reservation" size="xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Left Column: Form Fields --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Guest Information (remains the same) */}
          <div className="border border-gray-200 p-3 rounded-lg">
            {/* ... (Guest info JSX) ... */}
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <IconUser />
              <span className="ml-2">Guest Information</span>
            </label>
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
              
              {/* --- GUEST FIX --- */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <select
                  title="Number of Guests"
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-md ${errors.guests ? 'border-red-300' : 'border-gray-300'}`}
                >
                  {/* This list is now dynamic */}
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
              {/* --- END GUEST FIX --- */}

            </div>
          </div>

          {/* Booking Details (remains the same) */}
          <div className="border border-gray-200 p-4 rounded-lg">
            {/* ... (Booking Details JSX) ... */}
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <IconCalendar />
              <span className="ml-2">Booking Details</span>
            </label>
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
          
          {/* --- NEW --- */}
          {/* Payment Section */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <IconCreditCard />
              <span className="ml-2">Payment</span>
            </label>

            {/* Price change summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
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
                <div className="flex justify-between text-lg font-bold text-heritage-green">
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
          {/* --- END NEW --- */}

        </div>

        {/* --- Right Column: Summary & Actions (Sticky) --- */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
          
          {/* Summary Card (remains the same) */}
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <label className="text-lg font-semibold text-blue-900 mb-3">Summary</label>
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

          {/* Total Amount Card */}
          <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-green-800">Updated Total Amount</label>
            <p className="text-3xl font-bold text-green-900 mt-1">
              ₱{calculatePricing().totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {calculatePricing().totalAmount !== reservation.totalAmount && (
              <p className="text-sm text-orange-600 mt-2">
                Previous: ₱{reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Action Buttons (remains the same) */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleSave}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green"
            >
              <IconSave />
              <span className="ml-2">Save Changes</span>
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