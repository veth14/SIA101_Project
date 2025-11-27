import React from 'react';
import type { ChartData } from 'chart.js';
type RevenueData = ChartData<'line'>;
export declare const RevenueChart: React.FC<{
    data: RevenueData;
}>;
export {};
