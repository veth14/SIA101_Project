import { useState } from 'react';
import { Modal } from '../../admin/Modal';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooking: (booking: any) => void;
}

const roomTypes = [
  { id: 'standard', name: 'Standard Room (Silid Payapa)', price: 2500, maxGuests: 4 },
  { id: 'deluxe', name: 'Deluxe Room (Silid Marahuyo)', price: 3800, maxGuests: 4 },
  { id: 'suite', name: 'Suite Room (Silid Ginhawa)', price: 5500, maxGuests: 4 },
  { id: 'family', name: 'Family Suite (Silid Haraya)', price: 8000, maxGuests: 8 },
];

const availableRooms = [
  { number: '101', type: 'standard', status: 'available' },
  { number: '102', type: 'standard', status: 'available' },
  { number: '103', type: 'standard', status: 'occupied' },
  { number: '201', type: 'deluxe', status: 'available' },
  { number: '202', type: 'deluxe', status: 'maintenance' },
  { number: '301', type: 'suite', status: 'available' },
  { number: '401', type: 'family', status: 'available' },
];

export const WalkInModal = ({ isOpen, onClose, onBooking }: WalkInModalProps) => {
  const [step, setStep] = useState(1);
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

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.roomNumber) newErrors.roomNumber = 'Room selection is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    if (checkOut <= checkIn) {
      newErrors.checkOut = 'Check-out must be after check-in date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    const roomType = roomTypes.find(rt => rt.id === formData.roomType);
    if (!roomType) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return roomType.price * nights;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      const total = calculateTotal();
      setFormData(prev => ({ ...prev, totalAmount: total }));
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    const bookingId = `WI${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const newBooking = {
      id: bookingId,
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      roomType: roomTypes.find(rt => rt.id === formData.roomType)?.name || '',
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

  const getAvailableRoomsForType = (roomTypeId: string) => {
    return availableRooms.filter(room => 
      room.type === roomTypeId && room.status === 'available'
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.roomNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select room</option>
            {getAvailableRoomsForType(formData.roomType).map(room => (
              <option key={room.number} value={room.number}>
                Room {room.number}
              </option>
            ))}
          </select>
          {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <input
            type="date"
            value={formData.checkIn}
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
