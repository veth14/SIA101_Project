import type { Room, RoomStats, RoomFilters } from './roomService';
export interface UseRoomManagementReturn {
    rooms: Room[];
    filteredRooms: Room[];
    roomStats: RoomStats;
    filterOptions: {
        statusOptions: Array<{
            value: string;
            label: string;
            count: number;
        }>;
        roomTypeOptions: Array<{
            value: string;
            label: string;
        }>;
    };
    loading: boolean;
    error: string | null;
    filters: RoomFilters;
    setFilters: (filters: Partial<RoomFilters>) => void;
    refreshRooms: (forceRefresh?: boolean) => Promise<void>;
    updateStatus: (roomId: string, status: Room['status']) => Promise<void>;
    modifyRoomState: (updatedRoom: Room) => void;
}
export declare const useRoomManagement: () => UseRoomManagementReturn;
