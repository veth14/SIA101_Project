import React from 'react';
interface GuestInfo {
    name: string;
    checkIn: string;
    checkOut: string;
}
interface RoomCardProps {
    roomNumber: string;
    roomName?: string;
    roomType: string;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    price: number;
    guest?: GuestInfo | string;
    checkIn?: string;
    checkOut?: string;
    features: string[];
    maxFeatures?: number;
    onViewDetails?: () => void;
    onEdit?: () => void;
}
declare const RoomCard: React.FC<RoomCardProps>;
export default RoomCard;
