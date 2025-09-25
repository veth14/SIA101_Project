import { useState, useEffect } from 'react';
import { Modal } from '../../admin/Modal';

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

const availableRooms = [
  { number: '101', type: 'Standard Room' },
  { number: '102', type: 'Standard Room' },
  { number: '103', type: 'Standard Room' },
  { number: '201', type: 'Deluxe Room' },
  { number: '202', type: 'Deluxe Room' },
  { number: '301', type: 'Suite Room' },
  { number: '401', type: 'Family Suite' },
];

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
      setFormData({
        guestName: reservation.guestName,
        email: reservation.email,
        phone: reservation.phone,
        roomType: reservation.roomType,
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

  const calculateTotal = () => {
    const roomTypeData = roomTypes.find(rt => rt.name === formData.roomType);
    if (!roomTypeData) return reservation.totalAmount;

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return roomTypeData.price * nights;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedReservation: Reservation = {
      ...reservation,
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      roomType: formData.roomType,
      roomNumber: formData.roomNumber || undefined,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      specialRequests: formData.specialRequests,
      paymentMethod: formData.paymentMethod,
      totalAmount: calculateTotal(),
    };

    onSave(updatedReservation);
  };

  const getAvailableRoomsForType = () => {
    return availableRooms.filter(room => 
      room.type.toLowerCase().includes(formData.roomType.toLowerCase())
    );
  };

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
                  <option key={type.id} value={type.name}>
                    {type.name} - ₱{type.price.toLocaleString()}/night
                  </option>
                ))}
              </select>
              {errors.roomType && <p className="text-red-500 text-xs mt-1">{errors.roomType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <select
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
                disabled={!formData.roomType}
              >
                <option value="">Select room (optional)</option>
                {getAvailableRoomsForType().map(room => (
                  <option key={room.number} value={room.number}>
                    Room {room.number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date <span className="text-red-500">*</span>
              </label>
              <input
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
