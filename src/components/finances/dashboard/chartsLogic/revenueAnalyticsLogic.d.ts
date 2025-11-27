export interface DataPoint {
    day: string;
    revenue: number;
    expenses: number;
    profit: number;
}
export interface ChartCalculations {
    maxValue: number;
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
    averageRevenue: number;
    growthRate: number;
    profitMargin: number;
    maxRevenue: number;
    maxDay: string;
    projectedRevenue: number;
}
export declare const getDailyRevenueData: () => DataPoint[];
export declare const getWeeklyRevenueData: () => DataPoint[];
export declare const getMonthlyRevenueData: () => DataPoint[];
export declare const getYearlyRevenueData: () => DataPoint[];
export declare const getRevenueData: (timeframe: "weekly" | "monthly" | "yearly") => DataPoint[];
export declare const calculateChartMetrics: (data: DataPoint[]) => ChartCalculations;
export declare const generateChartCoordinates: (data: DataPoint[], maxValue: number, viewBoxWidth?: number, viewBoxHeight?: number) => {
    day: string;
    x: number;
    revenueY: number;
    expenseY: number;
    revenue: number;
    expenses: number;
    profit: number;
}[];
export declare const generateSVGPath: (coordinates: Array<{
    x: number;
    y: number;
}>, closePath?: boolean) => string;
export declare const formatCurrency: (value: number) => string;
export declare const formatShortCurrency: (value: number) => string;
