import React from 'react';
interface ItemsFiltersProps {
    globalFilter: string;
    onGlobalFilterChange: (value: string) => void;
    categoryOptions: Array<{
        label: string;
        value: string;
    }>;
    onCategoryFilter: (category: string) => void;
    onStatusFilter: (status: string) => void;
}
export declare const ItemsFilters: React.FC<ItemsFiltersProps>;
export {};
