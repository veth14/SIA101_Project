import React from 'react';
interface Reservation {
    id: string;
    guestName: string;
    email: string;
    phone: string;
    roomType: string;
    roomNumber?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'refunded';
}
interface ReservationsTableProps {
    reservations: Reservation[];
    onRowClick: (reservation: Reservation) => void;
    onCheckIn: (reservation: Reservation) => void;
    onCheckOut: (reservation: Reservation) => void;
    onEdit: (reservation: Reservation) => void;
    onCancel: (reservation: Reservation) => void;
}
declare const ReservationsTable: React.FC<ReservationsTableProps>;
export default ReservationsTable;
