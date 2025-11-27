import React from 'react';
interface DepartmentProfit {
    department: string;
    revenue: number;
    costs: number;
    profit: number;
    margin: number;
    status: 'excellent' | 'good' | 'poor' | 'critical';
}
interface DepartmentCardsProps {
    departmentProfits: DepartmentProfit[];
}
export declare const DepartmentCards: React.FC<DepartmentCardsProps>;
export {};
