import React from 'react';
interface RequisitionFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    priorityFilter: string;
    onPriorityChange: (value: string) => void;
    departmentFilter: string;
    onDepartmentChange: (value: string) => void;
    departments: string[];
}
export declare const RequisitionFilters: React.FC<RequisitionFiltersProps>;
export {};
