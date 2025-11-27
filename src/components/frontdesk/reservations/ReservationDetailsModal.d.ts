import React from 'react';
import { BookingData } from './ReservationsContext';
interface ReservationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: BookingData | null;
    onEdit?: (reservation: BookingData) => void;
    onCheckIn?: (reservation: BookingData) => void;
    onCheckOut?: (reservation: BookingData) => void;
    onCancel?: (reservation: BookingData) => void;
}
export declare const ReservationDetailsModal: ({ isOpen, onClose, reservation, onEdit, onCheckIn, onCheckOut, onCancel }: ReservationDetailsModalProps) => React.ReactPortal | null;
export {};
