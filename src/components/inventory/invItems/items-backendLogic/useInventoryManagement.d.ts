import type { InventoryItem, InventoryStats, InventoryFilters } from './inventoryService';
export interface UseInventoryManagementReturn {
    items: InventoryItem[];
    filteredItems: InventoryItem[];
    inventoryStats: InventoryStats;
    filterOptions: {
        categoryOptions: Array<{
            value: string;
            label: string;
            count: number;
        }>;
        stockStatusOptions: Array<{
            value: string;
            label: string;
            count: number;
        }>;
    };
    loading: boolean;
    error: string | null;
    filters: InventoryFilters;
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
export declare const useInventoryManagement: () => UseInventoryManagementReturn;
