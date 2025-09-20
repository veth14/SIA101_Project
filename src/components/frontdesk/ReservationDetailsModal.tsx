import { Modal } from '../admin/Modal';

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
  bookingType?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onEdit?: (reservation: Reservation) => void;
  onCheckIn?: (reservation: Reservation) => void;
  onCheckOut?: (reservationId: string) => void;
  onCancel?: (reservationId: string) => void;
}

export const ReservationDetailsModal = ({ 
  isOpen, 
  onClose, 
  reservation, 
  onEdit,
  onCheckIn,
  onCheckOut,
  onCancel 
}: ReservationDetailsModalProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      'checked-in': 'bg-green-100 text-green-800 border-green-200',
      'checked-out': 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      refunded: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateNights = () => {
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reservation Details" size="lg">
      <div className="space-y-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{reservation.guestName}</h2>
            <p className="text-sm text-gray-600">Booking ID: {reservation.id}</p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(reservation.status)}`}>
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('-', ' ')}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(reservation.paymentStatus)}`}>
              {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Guest Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Guest Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-sm text-gray-900 mt-1">{reservation.guestName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <p className="text-sm text-gray-900 mt-1">{reservation.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="text-sm text-gray-900 mt-1">{reservation.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
              <p className="text-sm text-gray-900 mt-1">{reservation.guests} guest{reservation.guests > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Booking Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <p className="text-sm text-gray-900 mt-1">{reservation.roomType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Number</label>
              <p className="text-sm text-gray-900 mt-1">
                {reservation.roomNumber ? `Room ${reservation.roomNumber}` : 'Not assigned'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
              <p className="text-sm text-gray-900 mt-1">{formatDate(reservation.checkIn)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
              <p className="text-sm text-gray-900 mt-1">{formatDate(reservation.checkOut)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <p className="text-sm text-gray-900 mt-1">{calculateNights()} night{calculateNights() > 1 ? 's' : ''}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking Type</label>
              <p className="text-sm text-gray-900 mt-1 capitalize">
                {reservation.bookingType || 'Online'}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">₱{reservation.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
              </span>
            </div>
            {reservation.paymentMethod && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <p className="text-sm text-gray-900 mt-1 capitalize">{reservation.paymentMethod.replace('-', ' ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Special Requests */}
        {reservation.specialRequests && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Special Requests</h3>
            <p className="text-sm text-gray-700">{reservation.specialRequests}</p>
          </div>
        )}

        {/* Booking Timeline */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Timeline</h3>
          <div className="space-y-2">
            {reservation.createdAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Booking Created:</span>
                <span className="text-gray-900">{formatDateTime(reservation.createdAt)}</span>
              </div>
            )}
            {reservation.updatedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">{formatDateTime(reservation.updatedAt)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Status:</span>
              <span className="text-gray-900 capitalize">{reservation.status.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {reservation.status === 'confirmed' && onCheckIn && (
              <button
                onClick={() => onCheckIn(reservation)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Check In
              </button>
            )}
            
            {reservation.status === 'checked-in' && onCheckOut && (
              <button
                onClick={() => onCheckOut(reservation.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Check Out
              </button>
            )}
            
            {onEdit && ['confirmed', 'checked-in'].includes(reservation.status) && (
              <button
                onClick={() => onEdit(reservation)}
                className="px-4 py-2 text-sm font-medium text-heritage-green bg-white border border-heritage-green rounded-md hover:bg-heritage-green hover:text-white focus:outline-none focus:ring-2 focus:ring-heritage-green"
              >
                Edit Booking
              </button>
            )}
            
            {onCancel && reservation.status === 'confirmed' && (
              <button
                onClick={() => onCancel(reservation.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
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
