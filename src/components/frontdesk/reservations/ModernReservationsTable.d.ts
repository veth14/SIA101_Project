import React from 'react';
import { BookingData } from './ReservationsContext';
interface ModernReservationsTableProps {
    reservations: BookingData[];
    onRowClick: (reservation: BookingData) => void;
    onCheckIn: (reservation: BookingData) => void;
    onCheckOut: (reservation: BookingData) => void;
    onEdit: (reservation: BookingData) => void;
    onCancel: (reservation: BookingData) => void;
    onAddReservation?: (booking: any) => void;
}
declare const ModernReservationsTable: React.FC<ModernReservationsTableProps>;
export default ModernReservationsTable;
