import { Timestamp } from 'firebase/firestore';
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
interface IRoomsContext {
    rooms: IRoom[];
    loading: boolean;
    refreshRooms: () => Promise<void>;
}
export declare const RoomsContext: import("react").Context<IRoomsContext | null>;
export declare const useRooms: () => IRoomsContext;
export {};
