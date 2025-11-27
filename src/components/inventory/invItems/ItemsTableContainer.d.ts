import React from 'react';
import type { InventoryItem } from './items-backendLogic/inventoryService';
export declare const CategoryDropdown: React.FC<{
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    categoryOptions: Array<{
        value: string;
        label: string;
        count: number;
    }>;
}>;
export declare const StockStatusDropdown: React.FC<{
    selectedStockStatus: string;
    onStockStatusChange: (status: string) => void;
    stockStatusOptions: Array<{
        value: string;
        label: string;
        count: number;
    }>;
}>;
interface ItemsTableProps {
    searchTerm: string;
    selectedCategory: string;
    items: InventoryItem[];
    currentPage: number;
    onPageChange: (page: number) => void;
    onViewDetails?: (item: InventoryItem) => void;
}
export declare const ItemsTableContainer: React.FC<ItemsTableProps>;
export {};
