import React from 'react';
interface ReportsFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedYear: number;
    onYearChange: (year: number) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    selectedMonth?: number;
    onMonthChange?: (month: number) => void;
    selectedStatus?: string;
    onStatusChange?: (status: string) => void;
    selectedFileType?: string;
    onFileTypeChange?: (fileType: string) => void;
    selectedPreparedBy?: string;
    onPreparedByChange?: (preparedBy: string) => void;
    sortBy?: string;
    onSortChange?: (sortBy: string) => void;
    onGenerateClick?: () => void;
    isLoading?: boolean;
}
declare const ReportsFilter: React.FC<ReportsFilterProps>;
export default ReportsFilter;
