import React from 'react';
import { type BookingData } from './ReservationsContext';
interface EditReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: BookingData | null;
    onSave: (updatedReservation: BookingData) => void;
}
export declare const EditReservationModal: ({ isOpen, onClose, reservation, onSave }: EditReservationModalProps) => React.ReactPortal | null;
export {};
