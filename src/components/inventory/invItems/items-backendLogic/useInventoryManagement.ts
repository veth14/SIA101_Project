import { useState, useEffect, useCallback } from 'react';
import { 
  fetchInventoryItems, 
  calculateInventoryStats, 
  filterInventoryItems, 
  getInventoryFilterOptions,
  updateItemStock,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  subscribeToInventoryItems
} from './inventoryService';
import type { 
  InventoryItem, 
  InventoryStats, 
  InventoryFilters
} from './inventoryService';

export interface UseInventoryManagementReturn {
  // Data
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  inventoryStats: InventoryStats;
  filterOptions: {
    categoryOptions: Array<{ value: string; label: string; count: number }>;
    stockStatusOptions: Array<{ value: string; label: string; count: number }>;
  };
  
  // State
  loading: boolean;
  error: string | null;
  filters: InventoryFilters;
  
  // Actions
  setFilters: (filters: Partial<InventoryFilters>) => void;
  refreshItems: () => Promise<void>;
  updateStock: (itemId: string, newStock: number) => Promise<void>;
  addItem: (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (itemId: string, itemData: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
}

/**
 * Custom hook for inventory management with Firebase integration
 */
export const useInventoryManagement = (): UseInventoryManagementReturn => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<InventoryFilters>({
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
   * Fetch inventory items from Firebase (one-off, uses cache).
   * Kept for explicit refresh usage.
   */
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const inventoryData = await fetchInventoryItems();
      setItems(inventoryData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory items';
      setError(errorMessage);
      console.error('❌ Error loading inventory items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: Partial<InventoryFilters>) => {
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
  const updateStock = useCallback(async (itemId: string, newStock: number) => {
    try {
      await updateItemStock(itemId, newStock);
      // Update local state immediately for better UX
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, currentStock: newStock, updatedAt: new Date() } : item
      ));
    } catch (err) {
      console.error('❌ Error updating item stock:', err);
      throw err;
    }
  }, []);

  /**
   * Add new inventory item and refresh data
   */
  const addItem = useCallback(async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addInventoryItem(itemData);
      // Refresh data to get the new item
      await loadItems();
    } catch (err) {
      console.error('❌ Error adding inventory item:', err);
      throw err;
    }
  }, [loadItems]);

  /**
   * Update inventory item and refresh data
   */
  const updateItem = useCallback(async (itemId: string, itemData: Partial<InventoryItem>) => {
    try {
      await updateInventoryItem(itemId, itemData);
      // Update local state immediately for better UX
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...itemData, updatedAt: new Date() } : item
      ));
    } catch (err) {
      console.error('❌ Error updating inventory item:', err);
      throw err;
    }
  }, []);

  /**
   * Delete inventory item and refresh data
   */
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      await deleteInventoryItem(itemId);
      // Remove from local state immediately for better UX
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('❌ Error deleting inventory item:', err);
      throw err;
    }
  }, []);

  // Subscribe to real-time updates on mount
  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToInventoryItems(
      (inventoryData) => {
        setItems(inventoryData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe to inventory updates';
        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

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