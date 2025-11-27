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
}
export interface StockTransaction {
    id: string;
    itemId: string;
    itemName: string;
    type: 'stock-in' | 'stock-out' | 'adjustment';
    quantity: number;
    reason: string;
    performedBy: string;
    timestamp: string;
    notes?: string;
}
export declare const sampleInventory: InventoryItem[];
export declare const sampleTransactions: StockTransaction[];
export declare const getItemsByCategory: (category: string) => InventoryItem[];
export declare const getLowStockItems: () => InventoryItem[];
export declare const getItemById: (id: string) => InventoryItem | undefined;
export declare const getTransactionsByItemId: (itemId: string) => StockTransaction[];
export declare const categories: string[];
