import React from 'react';
interface AdminDashboardStatsProps {
    stats: {
        totalBookings: number;
        todayArrivals: number;
        totalRevenue: number;
        occupancyRate: number;
        lowStockItems: number;
        activeStaff: number;
        totalRooms: number;
        availableRooms: number;
    };
}
export declare const AdminDashboardStats: React.FC<AdminDashboardStatsProps>;
export {};
