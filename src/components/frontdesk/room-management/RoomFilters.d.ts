/**
 * RoomFilters Component
 *
 * Premium modern filters interface for room management.
 * Provides search and filtering functionality.
 */
import React from 'react';
interface RoomFiltersProps {
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    statusFilter?: string;
    onStatusChange?: (status: string) => void;
    roomTypeFilter?: string;
    onRoomTypeChange?: (type: string) => void;
    statusOptions?: Array<{
        value: string;
        label: string;
        count: number;
    }>;
    roomTypeOptions?: Array<{
        value: string;
        label: string;
    }>;
}
declare const RoomFilters: React.FC<RoomFiltersProps>;
export default RoomFilters;
