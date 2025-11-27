export interface Room {
    id: string;
    roomNumber: string;
    roomType: string;
    roomName: string;
    floor: number;
    maxGuests: number;
    bedType: string;
    size: string;
    basePrice: number;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    isActive: boolean;
    amenities: string[];
    features: string[];
    currentReservation: string | null;
    description: string;
}
export declare const ROOMS_DATA: Room[];
export declare const getRoomsByType: (roomType: string) => Room[];
export declare const getAvailableRooms: () => Room[];
export declare const getRoomById: (id: string) => Room | undefined;
export declare const getRoomByNumber: (roomNumber: string) => Room | undefined;
export declare const ROOM_TYPES: {
    STANDARD: string;
    DELUXE: string;
    SUITE: string;
    FAMILY: string;
};
export declare const ROOM_NAMES: {
    PAYAPA: string;
    MARAHUYO: string;
    GINHAWA: string;
    HARAYA: string;
};
