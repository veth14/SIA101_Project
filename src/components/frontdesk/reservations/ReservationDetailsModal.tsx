import { Modal } from '../../admin/Modal';
import { Timestamp } from 'firebase/firestore'; 

// --- Icon Components (remain the same) ---
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const IconEnvelope = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6m6 3v-1a6 6 0 00-6-6h-1.5m-1.5-9a4 4 0 00-4-4h-1a4 4 0 100 8h1" /></svg>
);
const IconBed = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646zM9 13A-5 5 0 016 8V6a2 2 0 012-2h8a2 2 0 012 2v2a-5 5 0 01-3 4.5V13h-1V9.5a-5 5 0 01-3-4.5V6" /></svg>
);
const IconHashtag = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M5 9h14M5 15h14" /></svg>
);
const IconCreditCard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);
const IconDollar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.657 0-3-.895-3-2s1.343-2 3-2 3-.895 3-2-1.343-2-3-2m-3.5 7.039a5.002 5.002 0 01-2.599-1M15.5 11.039a5.002 5.002 0 012.599-1" /></svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconInfo = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const IconClock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

// InfoItem component (remains the same)
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
      <div className="text-sm text-gray-900 mt-1">{children}</div>
    </div>
  </div>
);


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
interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingData;
  onEdit?: (reservation: BookingData) => void;
  onCheckIn?: (reservation: BookingData) => void;
  onCheckOut?: (reservationId: string) => void;
  onCancel?: (reservationId: string) => void;
}

// --- NEW ---
// Badge functions copied from ModernReservationsTable.tsx
const getStatusBadge = (status: string) => {
  const statusConfig = {
    confirmed: { 
      bg: 'bg-gradient-to-r from-amber-100 to-yellow-100', 
      text: 'text-amber-800', 
      dot: 'bg-amber-400',
      label: 'Confirmed' 
    },
    'checked-in': { 
      bg: 'bg-gradient-to-r from-emerald-100 to-green-100', 
      text: 'text-emerald-800', 
      dot: 'bg-emerald-400',
      label: 'Checked In' 
    },
    'checked-out': { 
      bg: 'bg-gradient-to-r from-blue-100 to-indigo-100', 
      text: 'text-blue-800', 
      dot: 'bg-blue-400',
      label: 'Checked Out' 
    },
    cancelled: { 
      bg: 'bg-gradient-to-r from-red-100 to-rose-100', 
      text: 'text-red-800', 
      dot: 'bg-red-400',
      label: 'Cancelled' 
    }
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed;
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`}>
      <div className={`w-2 h-2 ${config.dot} rounded-full animate-pulse`}></div>
      <span>{config.label}</span>
    </div>
  );
};

const getPaymentBadge = (status: string) => {
  const paymentConfig = {
    paid: { bg: 'bg-gradient-to-r from-green-100 to-emerald-100', text: 'text-green-800', icon: '✓', label: 'Paid' },
    pending: { bg: 'bg-gradient-to-r from-orange-100 to-amber-100', text: 'text-orange-800', icon: '⏳', label: 'Pending' },
    refunded: { bg: 'bg-gradient-to-r from-gray-100 to-slate-100', text: 'text-gray-800', icon: '↩', label: 'Refunded' }
  };
  const config = paymentConfig[status as keyof typeof paymentConfig] || paymentConfig.pending;
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};
// --- END NEW ---


export const ReservationDetailsModal = ({ 
  isOpen, 
  onClose, 
  reservation, 
  onEdit,
  onCheckIn,
  onCheckOut,
  onCancel 
}: ReservationDetailsModalProps) => {

  // --- REMOVED ---
  // Deleted getStatusColor() and getPaymentStatusColor()
  // --- END REMOVED ---

  // formatDate (remains the same)
  const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // formatDateTime (remains the same)
  const formatDateTime = (dateInput: Timestamp | string | Date | null | undefined) => {
    if (!dateInput) return "N/A";
    
    let date: Date;
    if (dateInput instanceof Timestamp) {
      date = dateInput.toDate();
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reservation.userName} size="lg">
      <div className="space-y-4">
        
        {/* --- UPDATED --- */}
        {/* Header now calls the new badge functions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">Booking ID: {reservation.bookingId}</p>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            {getStatusBadge(reservation.status)}
            {getPaymentBadge(reservation.paymentDetails.paymentStatus)}
          </div>
        </div>
        {/* --- END UPDATED --- */}


        {/* Stay Details (remains the same) */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-center">
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-in</label>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {formatDate(reservation.checkIn, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-sm text-gray-500">{formatDate(reservation.checkIn, { weekday: 'short' })}</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-blue-600">{reservation.nights} night{reservation.nights > 1 ? 's' : ''}</span>
              <svg className="w-12 h-4 text-gray-300" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 10 H100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M90 5 L100 10 L90 15" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-out</label>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {formatDate(reservation.checkOut, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
                <p className="text-sm text-gray-500">{formatDate(reservation.checkOut, { weekday: 'short' })}</p>
            </div>
          </div>
        </div>

        {/* Guest/Booking Info (remains the same) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 border border-gray-200 p-4 rounded-lg">
            <label className="text-lg font-semibold text-gray-900">Guest Information</label>
            <InfoItem icon={<IconUser />} label="Full Name">
              {reservation.userName}
            </InfoItem>
            <InfoItem icon={<IconEnvelope />} label="Email Address">
              {reservation.userEmail}
            </InfoItem>
            <InfoItem icon={<IconUsers />} label="Number of Guests">
              {reservation.guests} guest{reservation.guests > 1 ? 's' : ''}
            </InfoItem>
          </div>
          <div className="space-y-4 border border-gray-200 p-4 rounded-lg">
            <label className="text-lg font-semibold text-gray-900">Booking & Payment</label>
            <InfoItem icon={<IconBed />} label="Room Type">
              {reservation.roomName}
            </InfoItem>
            <InfoItem icon={<IconHashtag />} label="Room Number">
              {reservation.roomNumber ? `Room ${reservation.roomNumber}` : 'Not assigned'}
            </InfoItem>
            <InfoItem icon={<IconDollar />} label="Total Amount">
              <span className="text-lg font-bold text-gray-900">
                ₱{reservation.totalAmount.toLocaleString()}
              </span>
            </InfoItem>
            <InfoItem icon={<IconCreditCard />} label="Payment Method">
              <span className="capitalize">{reservation.paymentDetails.paymentMethod.replace('-', ' ')}</span>
            </InfoItem>
          </div>
        </div>

        {/* Booking Timeline (remains the same) */}
        <div className="border border-gray-200 p-4 rounded-lg">
          <label className="text-lg font-semibold text-gray-900 mb-3">Booking Timeline</label>
          <div className="space-y-3">
            <InfoItem icon={<IconCalendar />} label="Booking Created">
              {formatDateTime(reservation.createdAt)}
            </InfoItem>
            <InfoItem icon={<IconClock />} label="Last Updated">
              {formatDateTime(reservation.updatedAt)}
            </InfoItem>
            <InfoItem icon={<IconInfo />} label="Current Status">
              <span className="capitalize">{reservation.status.replace('-', ' ')}</span>
            </InfoItem>
          </div>
        </div>

        {/* Action Buttons (remains the same) */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-0">
            {reservation.status === 'confirmed' && onCheckIn && (
              <button
                onClick={() => onCheckIn(reservation)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                Check In
              </button>
            )}
            
            {reservation.status === 'checked-in' && onCheckOut && (
              <button
                onClick={() => onCheckOut(reservation.bookingId)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3m5 4v1a3 3 0 003 3h6a3 3 0 003-3V7a3 3 0 00-3-3h-6a3 3 0 00-3 3v1" /></svg>
                Check Out
              </button>
            )}
            
            {onEdit && ['confirmed', 'checked-in'].includes(reservation.status) && (
              <button
                onClick={() => onEdit(reservation)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-heritage-green bg-white border border-heritage-green rounded-md hover:bg-heritage-green hover:text-white focus:outline-none focus:ring-2 focus:ring-heritage-green"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 7.232z" /></svg>
                Edit Booking
              </button>
            )}
            
            {onCancel && reservation.status === 'confirmed' && (
              <button
                onClick={() => onCancel(reservation.bookingId)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Cancel Booking
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-heritage-green"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};