import React from 'react';
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}
export declare const SearchBar: React.FC<SearchBarProps>;
export {};
