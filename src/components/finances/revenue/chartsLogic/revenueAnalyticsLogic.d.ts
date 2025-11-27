interface RevenueDataPoint {
    day: string;
    revenue: number;
}
interface ChartMetrics {
    totalRevenue: number;
    averageRevenue: number;
    maxRevenue: number;
    maxDay: string;
    projectedRevenue: number;
    growthRate: number;
}
export declare const getRevenueData: (timeframe: "weekly" | "monthly" | "yearly") => RevenueDataPoint[];
export declare const calculateChartMetrics: (data: RevenueDataPoint[]) => ChartMetrics;
export declare const formatCurrency: (value: number) => string;
export declare const formatShortCurrency: (value: number) => string;
export {};
