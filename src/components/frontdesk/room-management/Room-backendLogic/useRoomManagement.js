import { useState, useEffect, useCallback } from 'react';
import { fetchRooms, calculateRoomStats, filterRooms, getFilterOptions, updateRoomStatus } from './roomService';
export const useRoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFiltersState] = useState({
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load rooms';
            setError(errorMessage);
            console.error('❌ Error loading rooms:', err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    /**
     * Update filters
     */
    const setFilters = useCallback((newFilters) => {
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
    const updateStatus = useCallback(async (roomId, status) => {
        try {
            await updateRoomStatus(roomId, status);
            setRooms(prev => prev.map(room => room.id === roomId ? { ...room, status } : room));
        }
        catch (err) {
            console.error('❌ Error updating room status:', err);
            throw err;
        }
    }, []);
    /**
     * NEW: Optimistic Update Helper
     * Updates the local state immediately without fetching from DB
     */
    const modifyRoomState = useCallback((updatedRoom) => {
        setRooms(prevRooms => prevRooms.map(room => (room.id === updatedRoom.id ? updatedRoom : room)));
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
