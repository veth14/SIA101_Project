import { createContext, useContext } from 'react';
import { Timestamp } from 'firebase/firestore';

// --- 1. Interfaces ---

export interface IRoom {
  id: string;
  roomNumber: string;
  roomName: string;
  roomType: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  currentReservation: string | null;
  isActive: boolean;
}

export interface BookingData {
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

// --- 2. Context Definition ---

interface IRoomsContext {
  rooms: IRoom[];
  loading: boolean;
  refreshRooms: () => Promise<void>;
}

export const RoomsContext = createContext<IRoomsContext | null>(null);

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomsContext.Provider');
  }
  return context;
};