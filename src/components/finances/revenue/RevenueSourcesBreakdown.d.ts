import React from 'react';
export interface RevenueData {
    id: string;
    source: 'rooms' | 'food_beverage' | 'other';
    amount: number;
    date: string;
    description: string;
    percentage: number;
}
interface RevenueSourcesBreakdownProps {
    revenueData: RevenueData[];
}
declare const RevenueSourcesBreakdown: React.FC<RevenueSourcesBreakdownProps>;
export default RevenueSourcesBreakdown;
