import React from 'react';
interface RevenueFiltersProps {
    selectedPeriod: string;
    selectedSource: string;
    onPeriodChange: (period: string) => void;
    onSourceChange: (source: string) => void;
}
declare const RevenueFilters: React.FC<RevenueFiltersProps>;
export default RevenueFilters;
