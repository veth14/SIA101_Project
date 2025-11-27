import React from 'react';
interface TransactionStatsProps {
    totalTransactions: number;
    completedTransactions: number;
    pendingTransactions: number;
    isLoading: boolean;
}
declare const TransactionStats: React.FC<TransactionStatsProps>;
export default TransactionStats;
