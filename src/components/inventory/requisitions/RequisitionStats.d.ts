import React from 'react';
interface RequisitionStatsProps {
    stats: {
        totalRequisitions: number;
        pendingRequisitions: number;
        approvedRequisitions: number;
        fulfilledRequisitions: number;
        totalValue: number;
    };
    formatCurrency: (amount: number) => string;
}
export declare const RequisitionStats: React.FC<RequisitionStatsProps>;
export {};
