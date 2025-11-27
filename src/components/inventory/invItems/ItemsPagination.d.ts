import React from 'react';
import type { InventoryItem } from '../../../data/sampleInventory';
interface ItemsPaginationProps {
    searchTerm: string;
    selectedCategory: string;
    items: InventoryItem[];
    currentPage: number;
    onPageChange: (page: number) => void;
}
export declare const ItemsPagination: React.FC<ItemsPaginationProps>;
export {};
