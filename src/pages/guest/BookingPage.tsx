import { useState } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import type { BookingData } from '../../services/bookingService';

export const BookingPage = () => {
  const { userData } = useAuth();
  const { addBooking, loading, error } = useBooking(userData?.uid || '');
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    roomType: 'standard',
    guests: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.uid) return;

    const booking: Omit<BookingData, 'id'> = {
      userId: userData.uid,
      checkIn: new Date(formData.checkIn),
      checkOut: new Date(formData.checkOut),
      roomType: formData.roomType,
      guests: formData.guests,
      status: 'pending',
      totalAmount: calculateTotal(formData.roomType, formData.checkIn, formData.checkOut),
      createdAt: new Date()
    };

    try {
      await addBooking(booking);
      setFormData({
        checkIn: '',
        checkOut: '',
        roomType: 'standard',
        guests: 1
      });
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  const calculateTotal = (roomType: string, checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const rates: Record<string, number> = {
      standard: 2500,
      deluxe: 3500,
      suite: 5000
    };

    return nights * (rates[roomType] || rates.standard);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-heritage-green mb-8">Book Your Stay</h1>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
              Check-in Date
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
              Check-out Date
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={formData.roomType}
              onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="standard">Standard Room</option>
              <option value="deluxe">Deluxe Room</option>
              <option value="suite">Heritage Suite</option>
            </select>
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              min="1"
              max="4"
              value={formData.guests}
              onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-heritage-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-green ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
};
