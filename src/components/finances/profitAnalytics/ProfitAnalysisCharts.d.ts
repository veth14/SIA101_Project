import React from 'react';
interface CostAnalysis {
    category: string;
    amount: number;
    percentage: number;
    color: string;
    icon: React.ReactNode;
    trend: 'up' | 'down';
    change: string;
    status: 'high' | 'medium' | 'low';
    description: string;
}
interface DepartmentProfit {
    department: string;
    revenue: number;
    costs: number;
    profit: number;
    margin: number;
    status: 'excellent' | 'good' | 'poor' | 'critical';
}
interface ProfitAnalysisChartsProps {
    costAnalysis: CostAnalysis[];
    departmentProfits: DepartmentProfit[];
}
export declare const ProfitAnalysisCharts: React.FC<ProfitAnalysisChartsProps>;
export default ProfitAnalysisCharts;
