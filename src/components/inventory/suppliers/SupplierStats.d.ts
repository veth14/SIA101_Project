import React from 'react';
interface SupplierStatsProps {
    stats: {
        totalSuppliers: number;
        activeSuppliers: number;
        inactiveSuppliers: number;
        suspendedSuppliers: number;
        totalValue: number;
    };
    formatCurrency: (amount: number) => string;
}
export declare const SupplierStats: React.FC<SupplierStatsProps>;
export {};
