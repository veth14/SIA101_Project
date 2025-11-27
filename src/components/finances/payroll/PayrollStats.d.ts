import React from 'react';
interface PayrollStatsProps {
    totalEmployees: number;
    totalPayroll: number;
    totalDeductions: number;
    pendingPayrolls: number;
}
export declare const PayrollStats: React.FC<PayrollStatsProps>;
export {};
