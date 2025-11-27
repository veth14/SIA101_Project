import React from 'react';
interface FilterOption {
    value: string;
    label: string;
    icon?: string;
}
interface FilterDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
    className?: string;
}
export declare const FilterDropdown: React.FC<FilterDropdownProps>;
export {};
