export interface AnalyticsData {
    bookingsCount: number;
    revenue: number;
    occupancyRate: number;
    averageStayDuration: number;
}
export declare const getBookingAnalytics: (startDate: Date, endDate: Date) => Promise<AnalyticsData>;
export declare const getInventoryAnalytics: () => Promise<{
    totalItems: number;
    lowStockItems: number;
}>;
export declare const getRevenueByPeriod: (period: "daily" | "weekly" | "monthly" | "yearly") => Promise<AnalyticsData>;
