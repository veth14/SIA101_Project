import React from 'react';
interface TransactionFilters {
    category: string;
    status: string;
}
interface TransactionAnalyticsProps {
    filters: {
        status: string;
        category: string;
    };
    onFiltersChange: (filters: TransactionFilters) => void;
    isLoading: boolean;
}
declare const TransactionAnalytics: React.FC<TransactionAnalyticsProps>;
export default TransactionAnalytics;
