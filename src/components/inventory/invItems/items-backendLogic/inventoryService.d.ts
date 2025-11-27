export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    description: string;
    currentStock: number;
    reorderLevel: number;
    unitPrice: number;
    supplier: string;
    lastRestocked: string;
    image?: string;
    unit: string;
    location: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface StockTransaction {
    id: string;
    itemId: string;
    itemName: string;
    type: "stock-in" | "stock-out" | "adjustment";
    quantity: number;
    reason: string;
    performedBy: string;
    timestamp: string;
    notes?: string;
}
export interface InventoryStats {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    categories: string[];
    recentTransactions: StockTransaction[];
}
export interface InventoryFilters {
    searchTerm: string;
    selectedCategory: string;
    stockStatus: "all" | "in-stock" | "low-stock" | "out-of-stock";
    sortBy: "name" | "category" | "stock" | "value" | "lastRestocked";
    sortOrder: "asc" | "desc";
}
export declare const fetchInventoryItems: (forceRefresh?: boolean) => Promise<InventoryItem[]>;
/**
 * Calculate inventory statistics from items data
 */
export declare const calculateInventoryStats: (items: InventoryItem[]) => InventoryStats;
/**
 * Filter inventory items based on search term, category, and stock status
 */
export declare const filterInventoryItems: (items: InventoryItem[], filters: InventoryFilters) => InventoryItem[];
/**
 * Get filter options with counts from actual inventory data
 */
export declare const getInventoryFilterOptions: (items: InventoryItem[]) => {
    categoryOptions: {
        value: string;
        label: string;
        count: number;
    }[];
    stockStatusOptions: {
        value: string;
        label: string;
        count: number;
    }[];
};
/**
 * Update inventory item stock
 */
export declare const updateItemStock: (itemId: string, newStock: number) => Promise<void>;
/**
 * Add new inventory item
 */
export declare const addInventoryItem: (itemData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => Promise<string>;
/**
 * Update inventory item
 */
export declare const updateInventoryItem: (itemId: string, itemData: Partial<InventoryItem>) => Promise<void>;
/**
 * Delete inventory item
 */
export declare const deleteInventoryItem: (itemId: string) => Promise<void>;
/**
 * Get low stock items
 */
export declare const getLowStockItems: () => Promise<InventoryItem[]>;
/**
 * Get items by category
 */
export declare const getItemsByCategory: (category: string) => Promise<InventoryItem[]>;
