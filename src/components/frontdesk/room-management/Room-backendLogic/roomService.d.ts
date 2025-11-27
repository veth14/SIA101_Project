export interface Room {
    id: string;
    roomNumber: string;
    roomName?: string;
    roomType: string;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    basePrice: number;
    maxGuests: number;
    amenities: string[];
    features: string[];
    guest?: string;
    checkIn?: string;
    checkOut?: string;
    floor?: number;
    roomSize?: string;
    description?: string;
    isActive?: boolean;
}
export interface RoomStats {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
    cleaningRooms: number;
    occupancyRate: number;
}
export interface RoomFilters {
    searchTerm: string;
    statusFilter: string;
    roomTypeFilter: string;
}
export declare const fetchRooms: (forceRefresh?: boolean) => Promise<Room[]>;
/**
 * Calculate room statistics from room data
 */
export declare const calculateRoomStats: (rooms: Room[]) => RoomStats;
/**
 * Filter rooms based on search term, status, and room type
 */
export declare const filterRooms: (rooms: Room[], filters: RoomFilters) => Room[];
/**
 * Get filter options with counts from actual room data
 */
export declare const getFilterOptions: (rooms: Room[]) => {
    statusOptions: {
        value: string;
        label: string;
        count: number;
    }[];
    roomTypeOptions: {
        value: string;
        label: string;
    }[];
};
/**
 * Update room status
 */
export declare const updateRoomStatus: (roomId: string, status: Room["status"]) => Promise<void>;
