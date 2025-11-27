import type { InventoryItem } from '../services/inventoryService';
export declare const useInventory: () => {
    items: InventoryItem[];
    loading: boolean;
    error: string | null;
    fetchInventory: () => Promise<void>;
    fetchLowStockItems: () => Promise<void>;
    addItem: (item: Omit<InventoryItem, "id">) => Promise<void>;
    updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
};
