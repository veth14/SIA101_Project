import { useState, useCallback } from 'react';
import type { BookingData } from '../services/bookingService';
import { createBooking, updateBooking, deleteBooking, getUserBookings } from '../services/bookingService';

export const useBooking = (userId: string) => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserBookings(userId);
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addBooking = async (bookingData: Omit<BookingData, 'id'>) => {
    try {
      setLoading(true);
      await createBooking(bookingData);
      await fetchBookings();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingById = async (id: string, updates: Partial<BookingData>) => {
    try {
      setLoading(true);
      await updateBooking(id, updates);
      await fetchBookings();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBookingById = async (id: string) => {
    try {
      setLoading(true);
      await deleteBooking(id);
      await fetchBookings();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    addBooking,
    updateBooking: updateBookingById,
    deleteBooking: deleteBookingById
  };
};
