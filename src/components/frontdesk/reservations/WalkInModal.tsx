import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// --- UPDATED IMPORTS ---
import {
  type BookingData,
  type IRoom,
  useRooms
} from './ReservationsContext';

import { 
  ROOM_TYPES_CONFIG, 
  normalizeTypeKey, 
  checkDateOverlap 
} from './reservations.utils';

// --- Icon Components ---
const IconUserPlus = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
);
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const IconBed = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v4a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h2a1 1 0 011 1zm8 0v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V7a1 1 0 011-1h2a1 1 0 011 1zM3 15h18v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4z" /></svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6m6 3v-1a6 6 0 00-6-6h-1.5m-1.5-9a4 4 0 00-4-4h-1a4 4 0 100 8h1" /></svg>
);
const IconDollar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.657 0-3-.895-3-2s1.343-2 3-2 3-.895 3-2-1.343-2-3-2m-3.5 7.039a5.002 5.002 0 01-2.599-1M15.5 11.039a5.002 5.002 0 012.599-1" /></svg>
);

// --- InfoItem Component ---
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, children }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 w-6 h-6 text-gray-400 pt-1">
      {icon}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <div className="text-sm text-gray-900 mt-1 font-medium">{children}</div>
    </div>
  </div>
);

// --- Form Components ---
interface FormItemProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}
const FormItem: React.FC<FormItemProps> = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
  </div>
);

const inputBaseStyles = "w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition disabled:bg-gray-50 disabled:cursor-not-allowed";
const errorStyles = "border-red-400 ring-1 ring-red-200 focus:border-red-500 focus:ring-red-200";

const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) => {
  const { hasError, className, ...rest } = props;
  return <input {...rest} className={`${inputBaseStyles} ${hasError ? errorStyles : ''} ${className || ''}`} />;
};

const FormSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) => {
  const { hasError, className, ...rest } = props;
  return <select {...rest} className={`${inputBaseStyles} ${hasError ? errorStyles : ''} ${className || ''}`} />;
};

const FormTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) => {
  const { hasError, className, ...rest } = props;
  return <textarea {...rest} className={`${inputBaseStyles} ${hasError ? errorStyles : ''} ${className || ''}`} />;
};

// --- Helper Functions ---
const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// --- Security Helper Functions ---
const maskCardNumber = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 4) return '';
  return `•••• •••• •••• ${digits.slice(-4)}`;
};

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(' ');
};

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

const formatCVV = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

// --- Props Interface ---
interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooking: (booking: any) => void;
}

// --- CONSTANTS ---
const stepTitles = ["Guest Information", "Booking Details", "Payment & Confirmation"];

// --- MAIN COMPONENT ---
export const WalkInModal = ({ isOpen, onClose, onBooking }: WalkInModalProps) => {
  
  const [step, setStep] = useState(1);
  // Note: Removed local roomTypes state, using ROOM_TYPES_CONFIG directly
  
  // Get rooms from context
  const { rooms: allRooms, loading: roomsLoading } = useRooms();
  // State for *available* rooms
  const [filteredRooms, setFilteredRooms] = useState<IRoom[]>([]); 

  // State for our single availability query
  const [overlappingBookings, setOverlappingBookings] = useState<BookingData[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  const [formData, setFormData] = useState({
    guestName: '', email: '', phone: '', idType: 'passport', idNumber: '', address: '',
    roomType: '', roomNumber: '', guests: 1,
    checkIn: new Date().toISOString().split('T')[0], checkOut: '', nights: 1,
    totalAmount: 0, paymentMethod: 'cash', paymentReceived: 0,
    gcashName: '', gcashNumber: '', cardholderName: '',
    cardNumber: '', cardExpiry: '', cardCvv: '', specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempCardData, setTempCardData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  // --- Availability Query ---
  useEffect(() => {
    if (!isOpen || !formData.checkIn || !formData.checkOut) {
      setOverlappingBookings([]);
      return;
    }
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      setOverlappingBookings([]);
      return;
    }

    let mounted = true;
    const fetchOverlappingBookings = async () => {
      setIsCheckingAvailability(true);
      setOverlappingBookings([]);
      try {
        const q = query(
          collection(db, 'bookings'),
          where('status', 'in', ['confirmed', 'checked-in']),
          where('checkIn', '<', formData.checkOut), 
          where('checkOut', '>', formData.checkIn) 
        );

        const snap = await getDocs(q);
        if (!mounted) return;

        const bookings = snap.docs.map(doc => ({ ...doc.data(), bookingId: doc.id } as BookingData));
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
  }, [isOpen, formData.checkIn, formData.checkOut]);


  // --- Occupied Rooms Calculation ---
  const occupiedRoomNumbers = useMemo(() => {
    const occupied = new Set<string>();
    for (const b of overlappingBookings) {
      if (!b.roomNumber) continue;
      // USED UTILITY
      const isOverlapping = checkDateOverlap(
        formData.checkIn, formData.checkOut,
        b.checkIn, b.checkOut
      );
      if (isOverlapping) {
        occupied.add(b.roomNumber);
      }
    }
    return occupied;
  }, [overlappingBookings, formData.checkIn, formData.checkOut]);


  // --- Filter Available Rooms ---
  useEffect(() => {
    if (!formData.roomType) {
      setFilteredRooms([]);
      return;
    }

    const reservationTypeKey = formData.roomType; 
    // USED UTILITY
    const candidateRooms = allRooms.filter(r => 
      normalizeTypeKey(r.roomType) === reservationTypeKey
    );

    const availableRooms = candidateRooms.filter(room => {
      if (room.status !== 'available' || room.isActive === false) { 
        return false;
      }
      if (!formData.checkIn || !formData.checkOut || new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        return true;
      }
      if (occupiedRoomNumbers.has(room.id)) {
        return false;
      }
      return true;
    });

    setFilteredRooms(availableRooms);

  }, [formData.roomType, allRooms, occupiedRoomNumbers, formData.checkIn, formData.checkOut]);


  // Auto-select room
  useEffect(() => {
    if (!isOpen) return;
    if (filteredRooms.length > 0 && !formData.roomNumber) {
      setFormData(prev => ({ ...prev, roomNumber: filteredRooms[0].id }));
    } else if (filteredRooms.length === 0) {
      setFormData(prev => ({ ...prev, roomNumber: '' }));
    }
  }, [filteredRooms, isOpen, formData.roomNumber]);
  
  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // --- Validation ---
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

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    
    if (!formData.roomNumber) {
      newErrors.roomNumber = 'Room selection is required';
    } else if (filteredRooms.length === 0 || !filteredRooms.find(r => r.id === formData.roomNumber)) {
      newErrors.roomNumber = 'Selected room is not available for these dates';
    }

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
    
    if (formData.roomNumber && occupiedRoomNumbers.has(formData.roomNumber)) {
      newErrors.roomNumber = 'Selected room is not available for those dates';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.paymentMethod === 'gcash') {
      if (!formData.gcashName.trim()) newErrors.gcashName = 'GCash name is required';
      if (!formData.gcashNumber.trim()) {
        newErrors.gcashNumber = 'GCash number is required';
      } else if (formData.gcashNumber.replace(/\D/g, '').length < 11) {
        newErrors.gcashNumber = 'Must be a valid 11-digit number';
      }
    }
    if (formData.paymentMethod === 'card') {
      if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
      if (!tempCardData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (tempCardData.cardNumber.replace(/\D/g, '').length < 15) {
        newErrors.cardNumber = 'Must be a valid card number';
      }
      if (!tempCardData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(tempCardData.cardExpiry)) {
        newErrors.cardExpiry = 'Must be MM/YY format';
      }
      if (!tempCardData.cardCvv.trim()) {
        newErrors.cardCvv = 'CVV is required';
      } else if (tempCardData.cardCvv.replace(/\D/g, '').length < 3) {
        newErrors.cardCvv = 'Must be 3-4 digits';
      }
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const calculatePricing = () => {
    // USED UTILITY
    const rt = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType);
    if (!rt || !formData.checkOut || !formData.checkIn) {
      return { nights: 0, basePrice: 0, roomPricePerNight: 0, additionalGuestPrice: 0, baseGuests: 0, subtotal: 0, tax: 0, taxRate: 0.12, totalAmount: 0 };
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
      nights, basePrice: basePrice, roomPricePerNight: Math.round(roomPricePerNight * 100) / 100,
      additionalGuestPrice, baseGuests, subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100, taxRate, totalAmount: Math.round(totalAmount * 100) / 100,
    };
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      const ok = validateStep2();
      if (ok) {
        const { totalAmount } = calculatePricing();
        setFormData(prev => ({ ...prev, totalAmount: totalAmount, paymentReceived: totalAmount }));
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };
  
  const internalOnClose = () => {
    setStep(1);
    setFormData({
      guestName: '', email: '', phone: '', idType: 'passport', idNumber: '', address: '',
      roomType: '', roomNumber: '', guests: 1, 
      checkIn: new Date().toISOString().split('T')[0], checkOut: '', nights: 1,
      totalAmount: 0, paymentMethod: 'cash', paymentReceived: 0, specialRequests: '',
      gcashName: '', gcashNumber: '', cardholderName: '',
      cardNumber: '', cardExpiry: '', cardCvv: '',
    });
    // Clear sensitive card data from memory
    setTempCardData({ cardNumber: '', cardExpiry: '', cardCvv: '' });
    setErrors({});
    onClose(); 
  };

  const handleSubmit = async () => {
    const step2Ok = validateStep2();
    if (!step2Ok) { setStep(2); return; }
    const step3Ok = validateStep3();
    if (!step3Ok) return;

    const pricingDetails = calculatePricing();
    const { nights, basePrice, roomPricePerNight, additionalGuestPrice, baseGuests, subtotal, tax, taxRate, totalAmount } = pricingDetails;
    const paymentReceived = typeof formData.paymentReceived === 'number' ? formData.paymentReceived : 0;
    const paymentStatus = paymentReceived >= totalAmount ? 'paid' : 'pending';
    const now = new Date();
    const firestoreTimestamp = Timestamp.fromDate(now);
    const todayString = now.toISOString().split('T')[0];
    const bookingStatus = (formData.checkIn === todayString) ? 'checked-in' : 'confirmed';
    
    // USED UTILITY
    const selectedRoomType = ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType);
    const roomName = selectedRoomType?.name || 'Unknown Room';
    const roomType = selectedRoomType?.id || formData.roomType;
    const roomNumber = formData.roomNumber;
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
    const userId = `U${Date.now()}${Math.random().toString(36).substring(2, 7)}`;

    const newBooking = {
      additionalGuestPrice, baseGuests, basePrice, bookingId,
      checkIn: formData.checkIn, checkOut: formData.checkOut,
      createdAt: firestoreTimestamp,
      guests: Number(formData.guests),
      nights,
      paymentMethod: formData.paymentMethod,
      paymentStatus,
      paymentDetails: {
        cardLast4: formData.paymentMethod === 'card' ? tempCardData.cardNumber.replace(/\D/g, '').slice(-4) : null,
        cardholderName: formData.paymentMethod === 'card' ? formData.cardholderName : null,
        gcashName: formData.paymentMethod === 'gcash' ? formData.gcashName : null,
        gcashNumber: formData.paymentMethod === 'gcash' ? formData.gcashNumber : null,
        paidAt: paymentStatus === 'paid' ? firestoreTimestamp : null,
      },
      roomName, roomPricePerNight, roomType, roomNumber,
      status: bookingStatus,
      subtotal, tax, taxRate, totalAmount,
      updatedAt: firestoreTimestamp,
      userEmail: formData.email,
      userId,
      userName: formData.guestName,
    };

    onBooking(newBooking);
    internalOnClose(); 
  };


  // --- RENDER FUNCTIONS ---

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem label="Full Name" required error={errors.guestName}>
          <FormInput
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
            placeholder="Enter guest name"
            hasError={!!errors.guestName}
          />
        </FormItem>
        <FormItem label="Email" required error={errors.email}>
          <FormInput
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="guest@email.com"
            hasError={!!errors.email}
          />
        </FormItem>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem label="Phone Number" required error={errors.phone}>
          <FormInput
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+63 9XX XXX XXXX"
            hasError={!!errors.phone}
          />
        </FormItem>
        <FormItem label="ID Type">
          <FormSelect
            value={formData.idType}
            onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
            title="ID Type"
          >
            <option value="passport">Passport</option>
            <option value="drivers-license">Driver's License</option>
            <option value="national-id">National ID</option>
            <option value="sss">SSS ID</option>
          </FormSelect>
        </FormItem>
      </div>
      <FormItem label="ID Number" required error={errors.idNumber}>
        <FormInput
          type="text"
          value={formData.idNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
          placeholder="Enter ID number"
          hasError={!!errors.idNumber}
        />
      </FormItem>
      <FormItem label="Address">
        <FormTextarea
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          rows={2}
          placeholder="Complete address"
        />
      </FormItem>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <FormItem label="Room Type" required error={errors.roomType}>
        <FormSelect
          value={formData.roomType}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, roomType: e.target.value, roomNumber: '' }));
          }}
          title="Room Type"
          hasError={!!errors.roomType}
        >
          <option value="">Select room type</option>
          {/* USED UTILITY */}
          {ROOM_TYPES_CONFIG.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} - ₱{type.price.toLocaleString()}/night
            </option>
          ))}
        </FormSelect>
      </FormItem>

      {formData.roomType && (
        <FormItem label="Available Rooms" required error={errors.roomNumber}>
          <FormSelect
            value={formData.roomNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
            title="Available Rooms"
            hasError={!!errors.roomNumber}
            disabled={roomsLoading || isCheckingAvailability || filteredRooms.length === 0}
          >
            <option value="">
              {roomsLoading
                ? 'Loading...'
                : isCheckingAvailability
                ? 'Checking availability...'
                : (filteredRooms.length > 0 ? 'Select room' : 'No rooms available for selected dates')}
            </option>
            {filteredRooms.map((room: IRoom) => (
              <option key={room.id} value={room.id}>
                Room {room.roomNumber}
              </option>
            ))}
          </FormSelect>
        </FormItem>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormItem label="Check-in Date" error={errors.checkIn}>
          <FormInput
            type="date"
            value={formData.checkIn}
            title="Check-in Date"
            onChange={(e) => {
              const value = e.target.value;
              // Validate that year (first 4 digits) is exactly 4 digits
              if (value && value.length > 0) {
                const year = value.split('-')[0];
                if (year && year.length !== 4) {
                  // Invalid year format, don't update
                  return;
                }
              }
              setFormData(prev => ({ ...prev, checkIn: value }));
            }}
            hasError={!!errors.checkIn}
          />
        </FormItem>
        <FormItem label="Check-out Date" required error={errors.checkOut}>
          <FormInput
            type="date"
            value={formData.checkOut}
            title="Check-out Date"
            onChange={(e) => {
              const value = e.target.value;
              // Validate that year (first 4 digits) is exactly 4 digits
              if (value && value.length > 0) {
                const year = value.split('-')[0];
                if (year && year.length !== 4) {
                  // Invalid year format, don't update
                  return;
                }
              }
              setFormData(prev => ({ ...prev, checkOut: value }));
            }}
            hasError={!!errors.checkOut}
          />
        </FormItem>
        <FormItem label="Guests">
          <FormSelect
            title="Number of Guests"
            value={formData.guests}
            onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
          >
            {Array.from(
              { length: formData.roomType ? (ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType)?.maxGuests || 4) : 4 },
              (_, i) => i + 1
            ).map(num => (
              <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
            ))}
          </FormSelect>
        </FormItem>
      </div>

      <FormItem label="Special Requests">
        <FormTextarea
          value={formData.specialRequests}
          onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
          rows={3}
          placeholder="Any special requests or preferences..."
        />
      </FormItem>
    </div>
  );

  const renderGcashForm = () => (
    <div className="grid grid-cols-2 gap-4 mt-4 border-t border-gray-200 pt-4">
      <FormItem label="GCash Name" required error={errors.gcashName}>
        <FormInput
          type="text"
          value={formData.gcashName}
          onChange={(e) => setFormData(prev => ({ ...prev, gcashName: e.target.value }))}
          placeholder="Juan Dela Cruz"
          hasError={!!errors.gcashName}
        />
      </FormItem>
      <FormItem label="GCash Number" required error={errors.gcashNumber}>
        <FormInput
          type="tel"
          value={formData.gcashNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, gcashNumber: e.target.value }))}
          placeholder="0917XXXXXXX"
          hasError={!!errors.gcashNumber}
        />
      </FormItem>
    </div>
  );

  const renderCardForm = () => (
    <div className="space-y-4 mt-4 border-t border-gray-200 pt-4">
      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-xs text-amber-700 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <span>Card data is for display only. Full card details are never stored for security.</span>
        </p>
      </div>
      
      <FormItem label="Cardholder Name" required error={errors.cardholderName}>
        <FormInput
          type="text"
          value={formData.cardholderName}
          onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
          placeholder="Juan Dela Cruz"
          hasError={!!errors.cardholderName}
        />
      </FormItem>
      
      <FormItem label="Card Number" required error={errors.cardNumber}>
        <div className="space-y-2">
          <FormInput
            type="text"
            value={formatCardNumber(tempCardData.cardNumber)}
            onChange={(e) => setTempCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
            placeholder="0000 0000 0000 0000"
            hasError={!!errors.cardNumber}
            maxLength={19}
            autoComplete="off"
          />
          {tempCardData.cardNumber && (
            <p className="text-xs text-gray-500">Masked: {maskCardNumber(tempCardData.cardNumber)}</p>
          )}
        </div>
      </FormItem>
      
      <div className="grid grid-cols-2 gap-4">
        <FormItem label="Expiry Date" required error={errors.cardExpiry}>
          <FormInput
            type="text"
            value={formatExpiry(tempCardData.cardExpiry)}
            onChange={(e) => setTempCardData(prev => ({ ...prev, cardExpiry: e.target.value }))}
            placeholder="MM/YY"
            hasError={!!errors.cardExpiry}
            maxLength={5}
            autoComplete="off"
          />
        </FormItem>
        
        <FormItem label="CVV" required error={errors.cardCvv}>
          <FormInput
            type="password"
            value={formatCVV(tempCardData.cardCvv)}
            onChange={(e) => setTempCardData(prev => ({ ...prev, cardCvv: e.target.value }))}
            placeholder="•••"
            hasError={!!errors.cardCvv}
            maxLength={4}
            autoComplete="off"
          />
        </FormItem>
      </div>
    </div>
  );
  
  const renderStep3 = () => {
    const { totalAmount } = calculatePricing();
    const remainingBalance = totalAmount - formData.paymentReceived;
    
    return (
      <div className="space-y-6">
        <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h4>
          <div className="space-y-4">
            <InfoItem icon={<IconUser />} label="Guest Name">
              {formData.guestName}
            </InfoItem>
            <InfoItem icon={<IconBed />} label="Room">
              {/* USED UTILITY */}
              {ROOM_TYPES_CONFIG.find(rt => rt.id === formData.roomType)?.name || formData.roomType}
              {formData.roomNumber && ` - Room ${formData.roomNumber}`}
            </InfoItem>
            <InfoItem icon={<IconCalendar />} label="Stay Dates">
              {formatDate(formData.checkIn)} - {formatDate(formData.checkOut)}
            </InfoItem>
            <InfoItem icon={<IconUsers />} label="Guests">
              {formData.guests} guest{formData.guests > 1 ? 's' : ''}
            </InfoItem>
            <div className="border-t border-gray-200 my-4"></div>
            <InfoItem icon={<IconDollar />} label="Total Amount">
              <span className="text-xl font-bold text-gray-900">
                ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </InfoItem>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem label="Payment Method">
              <FormSelect
                title="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => {
                  setErrors({});
                  setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                }}
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="gcash">GCash</option>
              </FormSelect>
            </FormItem>
            <FormItem label="Payment Received">
              <FormInput
                type="number"
                value={formData.paymentReceived}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentReceived: Number(e.target.value) }))}
                placeholder="0.00"
              />
            </FormItem>
          </div>

          {formData.paymentMethod === 'gcash' && renderGcashForm()}
          {formData.paymentMethod === 'card' && renderCardForm()}

          {remainingBalance > 0 && (
            <div className="bg-yellow-50 p-3 rounded-md mt-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Remaining Balance: ₱{remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </p>
            </div>
          )}
          {remainingBalance < 0 && (
            <div className="bg-blue-50 p-3 rounded-md mt-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Change Due: ₱{(-remainingBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderProgressBar = () => (
    <div className="flex items-center mb-6">
      {stepTitles.map((title, index) => {
        const stepNum = index + 1;
        const isCompleted = step > stepNum;
        const isCurrent = step === stepNum;
        return (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isCompleted ? 'bg-emerald-600 text-white' : 
                isCurrent ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300' : 'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? '✓' : stepNum}
              </div>
              <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-emerald-700' : 'text-gray-500'}`}>{title}</span>
            </div>
            {stepNum < stepTitles.length && (
              <div className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-emerald-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );


  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={internalOnClose}
        aria-label="Close overlay"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-gray-50/95 shadow-2xl ring-1 ring-black/5">

        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <IconUserPlus />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold md:text-2xl text-emerald-700">Add Walk-In Reservation</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Step {step} of {stepTitles.length}: {stepTitles[step-1]}
                </p>
              </div>
            </div>

            <button
              onClick={internalOnClose}
              aria-label="Close"
              className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-6">
          {renderProgressBar()}

          <div className="p-6 bg-white rounded-2xl ring-1 ring-black/5 shadow-inner">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
          
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex items-center justify-between">
            
            <button
              onClick={internalOnClose}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            
            <div className="flex items-center space-x-3">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-2xl shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-2xl shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5"
                >
                  Complete Booking
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>,
    document.body
  );
};