export interface InventoryItem {
    id?: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    minThreshold: number;
    location: string;
    lastUpdated: Date;
}
export declare const addInventoryItem: (item: Omit<InventoryItem, "id">) => Promise<{
    name: string;
    category: string;
    location: string;
    unit: string;
    quantity: number;
    minThreshold: number;
    lastUpdated: Date;
    id: string;
}>;
export declare const updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
export declare const deleteInventoryItem: (id: string) => Promise<void>;
export declare const getInventoryItems: () => Promise<InventoryItem[]>;
export declare const getLowStockItems: () => Promise<InventoryItem[]>;
