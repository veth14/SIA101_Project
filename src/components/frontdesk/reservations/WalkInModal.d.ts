import React from 'react';
interface WalkInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBooking: (booking: any) => void;
}
export declare const WalkInModal: ({ isOpen, onClose, onBooking }: WalkInModalProps) => React.ReactPortal | null;
export {};
