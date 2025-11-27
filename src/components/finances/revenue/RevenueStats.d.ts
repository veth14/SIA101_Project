import React from 'react';
interface RevenueStatsProps {
    totalRevenue: number;
    averageDaily: number;
    growthRate: number;
    topSource: string;
}
declare const RevenueStats: React.FC<RevenueStatsProps>;
export default RevenueStats;
