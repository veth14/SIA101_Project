import React from 'react';
interface CostBreakdownProps {
    costAnalysis?: Array<{
        category: string;
        amount: number;
        percentage: number;
        color?: string;
        icon?: React.ReactNode;
    }>;
}
export declare const CostBreakdown: React.FC<CostBreakdownProps>;
export {};
