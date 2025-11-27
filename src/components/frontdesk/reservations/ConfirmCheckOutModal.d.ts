import React from 'react';
import { BookingData } from './ReservationsContext';
interface ConfirmCheckOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: BookingData;
    onConfirmCheckOut: (reservation: BookingData) => Promise<void>;
}
export declare const ConfirmCheckOutModal: ({ isOpen, onClose, reservation, onConfirmCheckOut }: ConfirmCheckOutModalProps) => React.ReactPortal | null;
export {};
