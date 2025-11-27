import React from 'react';
interface RoomStatus {
    occupied: number;
    reserved: number;
    available: number;
    notReady: number;
}
export declare const RoomAvailability: React.FC<{
    status: RoomStatus;
}>;
export {};
