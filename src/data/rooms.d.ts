export interface Room {
    id: string;
    number: string;
    type: string;
    name: string;
    basePrice: number;
    baseGuests: number;
    maxGuests: number;
    additionalGuestPrice: number;
    roomSize: string;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    features: string[];
    amenities: string[];
    image: string;
    floor: number;
    lastCleaned?: string;
    lastMaintenance?: string;
}
export declare const rooms: Room[];
export declare const getRoomsByStatus: (status: Room["status"]) => Room[];
export declare const getRoomsByType: (type: string) => Room[];
export declare const getAvailableRoomsByType: (type: string) => Room[];
export declare const getRoomById: (id: string) => Room | undefined;
export declare const getRoomByNumber: (number: string) => Room | undefined;
