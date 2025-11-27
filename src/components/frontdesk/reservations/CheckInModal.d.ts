import React from 'react';
import { type BookingData } from './ReservationsContext';
interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: BookingData | null;
    onCheckIn: (updatedReservation: BookingData) => void;
}
export declare const CheckInModal: ({ isOpen, onClose, reservation, onCheckIn }: CheckInModalProps) => React.ReactPortal | null;
export {};
