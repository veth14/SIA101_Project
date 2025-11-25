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
  refreshRooms: (forceRefresh?: boolean) => Promise<void>;
  updateStatus: (roomId: string, status: Room['status']) => Promise<void>;
  // NEW: Optimization helper
  modifyRoomState: (updatedRoom: Room) => void;
}

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
  const loadRooms = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const roomsData = await fetchRooms(forceRefresh);
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
  const refreshRooms = useCallback(async (forceRefresh = false) => {
    await loadRooms(forceRefresh);
  }, [loadRooms]);

  /**
   * Update room status and refresh data
   */
  const updateStatus = useCallback(async (roomId: string, status: Room['status']) => {
    try {
      await updateRoomStatus(roomId, status);
      setRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, status } : room
      ));
    } catch (err) {
      console.error('❌ Error updating room status:', err);
      throw err;
    }
  }, []);

  /**
   * NEW: Optimistic Update Helper
   * Updates the local state immediately without fetching from DB
   */
  const modifyRoomState = useCallback((updatedRoom: Room) => {
    setRooms(prevRooms => 
      prevRooms.map(room => (room.id === updatedRoom.id ? updatedRoom : room))
    );
  }, []);

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    rooms,
    filteredRooms,
    roomStats,
    filterOptions,
    loading,
    error,
    filters,
    setFilters,
    refreshRooms,
    updateStatus,
    modifyRoomState // Exporting the new helper
  };
};