import React from 'react';
interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
}
export declare const PaginationControls: React.FC<PaginationControlsProps>;
export {};
