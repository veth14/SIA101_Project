import React from 'react';
interface FiltersPanelProps {
    searchQuery: string;
    statusFilter: string;
    dateRange: {
        startDate: string;
        endDate: string;
    };
    onSearch: (query: string) => void;
    onStatusFilter: (status: string) => void;
    onDateRangeChange: (range: {
        startDate: string;
        endDate: string;
    }) => void;
    statusCounts: {
        all: number;
        confirmed: number;
        'checked-in': number;
        'checked-out': number;
        cancelled?: number;
    };
}
declare const FiltersPanel: React.FC<FiltersPanelProps>;
export default FiltersPanel;
