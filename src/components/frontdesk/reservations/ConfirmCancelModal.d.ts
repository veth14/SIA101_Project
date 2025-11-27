import React from 'react';
import { BookingData } from './ReservationsContext';
interface ConfirmCancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: BookingData;
    onConfirmCancel: (reservation: BookingData) => Promise<void>;
}
export declare const ConfirmCancelModal: ({ isOpen, onClose, reservation, onConfirmCancel }: ConfirmCancelModalProps) => React.ReactPortal | null;
export {};
