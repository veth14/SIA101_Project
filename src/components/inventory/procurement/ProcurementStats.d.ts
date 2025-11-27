import React from 'react';
interface ProcurementStatsProps {
    stats: {
        totalOrders: number;
        pendingOrders: number;
        approvedOrders: number;
        receivedOrders: number;
        totalValue: number;
    };
    formatCurrency: (amount: number) => string;
}
export declare const ProcurementStats: React.FC<ProcurementStatsProps>;
export {};
