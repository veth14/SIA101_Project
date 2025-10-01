import { useState, useEffect, useCallback } from 'react';
import { 
  fetchRooms, 
  calculateRoomStats, 
  filterRooms, 
  getFilterOptions,
  updateRoomStatus 
} from './roomService';
import type { 
  Room, 
  RoomStats, 
  RoomFilters
} from './roomService';

export interface UseRoomManagementReturn {
  // Data
  rooms: Room[];
  filteredRooms: Room[];
  roomStats: RoomStats;
  filterOptions: {
    statusOptions: Array<{ value: string; label: string; count: number }>;
    roomTypeOptions: Array<{ value: string; label: string }>;
  };
  
  // State
  loading: boolean;
  error: string | null;
  filters: RoomFilters;
  
  // Actions
  setFilters: (filters: Partial<RoomFilters>) => void;
  refreshRooms: () => Promise<void>;
  updateStatus: (roomId: string, status: Room['status']) => Promise<void>;
}

/**
 * Custom hook for room management with Firebase integration
 */
export const useRoomManagement = (): UseRoomManagementReturn => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<RoomFilters>({
    searchTerm: '',
    statusFilter: 'all',
    roomTypeFilter: 'all'
  });

  // Calculate derived data
  const roomStats = calculateRoomStats(rooms);
  const filteredRooms = filterRooms(rooms, filters);
  const filterOptions = getFilterOptions(rooms);

  /**
   * Fetch rooms from Firebase
   */
  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const roomsData = await fetchRooms();
      setRooms(roomsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load rooms';
      setError(errorMessage);
      console.error('❌ Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: Partial<RoomFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Refresh rooms data
   */
  const refreshRooms = useCallback(async () => {
    await loadRooms();
  }, [loadRooms]);

  /**
   * Update room status and refresh data
   */
  const updateStatus = useCallback(async (roomId: string, status: Room['status']) => {
    try {
      await updateRoomStatus(roomId, status);
      // Update local state immediately for better UX
      setRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, status } : room
      ));
    } catch (err) {
      console.error('❌ Error updating room status:', err);
      throw err;
    }
  }, []);

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    // Data
    rooms,
    filteredRooms,
    roomStats,
    filterOptions,
    
    // State
    loading,
    error,
    filters,
    
    // Actions
    setFilters,
    refreshRooms,
    updateStatus
  };
};
