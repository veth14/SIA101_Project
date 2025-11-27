import { useState, useEffect, useCallback } from 'react';
import { fetchInventoryItems, calculateInventoryStats, filterInventoryItems, getInventoryFilterOptions, updateItemStock, addInventoryItem, updateInventoryItem, deleteInventoryItem } from './inventoryService';
/**
 * Custom hook for inventory management with Firebase integration
 */
export const useInventoryManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFiltersState] = useState({
        searchTerm: '',
        selectedCategory: 'All Categories',
        stockStatus: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
    });
    // Calculate derived data
    const inventoryStats = calculateInventoryStats(items);
    const filteredItems = filterInventoryItems(items, filters);
    const filterOptions = getInventoryFilterOptions(items);
    /**
     * Fetch inventory items from Firebase
     */
    const loadItems = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const inventoryData = await fetchInventoryItems();
            setItems(inventoryData);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory items';
            setError(errorMessage);
            console.error('❌ Error loading inventory items:', err);
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
     * Refresh inventory data
     */
    const refreshItems = useCallback(async () => {
        await loadItems();
    }, [loadItems]);
    /**
     * Update item stock and refresh data
     */
    const updateStock = useCallback(async (itemId, newStock) => {
        try {
            await updateItemStock(itemId, newStock);
            // Update local state immediately for better UX
            setItems(prev => prev.map(item => item.id === itemId ? { ...item, currentStock: newStock, updatedAt: new Date() } : item));
        }
        catch (err) {
            console.error('❌ Error updating item stock:', err);
            throw err;
        }
    }, []);
    /**
     * Add new inventory item and refresh data
     */
    const addItem = useCallback(async (itemData) => {
        try {
            await addInventoryItem(itemData);
            // Refresh data to get the new item
            await loadItems();
        }
        catch (err) {
            console.error('❌ Error adding inventory item:', err);
            throw err;
        }
    }, [loadItems]);
    /**
     * Update inventory item and refresh data
     */
    const updateItem = useCallback(async (itemId, itemData) => {
        try {
            await updateInventoryItem(itemId, itemData);
            // Update local state immediately for better UX
            setItems(prev => prev.map(item => item.id === itemId ? { ...item, ...itemData, updatedAt: new Date() } : item));
        }
        catch (err) {
            console.error('❌ Error updating inventory item:', err);
            throw err;
        }
    }, []);
    /**
     * Delete inventory item and refresh data
     */
    const deleteItem = useCallback(async (itemId) => {
        try {
            await deleteInventoryItem(itemId);
            // Remove from local state immediately for better UX
            setItems(prev => prev.filter(item => item.id !== itemId));
        }
        catch (err) {
            console.error('❌ Error deleting inventory item:', err);
            throw err;
        }
    }, []);
    // Load items on mount
    useEffect(() => {
        loadItems();
    }, [loadItems]);
    return {
        // Data
        items,
        filteredItems,
        inventoryStats,
        filterOptions,
        // State
        loading,
        error,
        filters,
        // Actions
        setFilters,
        refreshItems,
        updateStock,
        addItem,
        updateItem,
        deleteItem
    };
};
