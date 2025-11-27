import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getBookingAnalytics, getInventoryAnalytics } from '../../../services/analyticsService';
export const DashboardPage = () => {
    const [bookingStats, setBookingStats] = useState(null);
    const [inventoryStats, setInventoryStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const today = new Date();
                const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                const [bookingData, inventoryData] = await Promise.all([
                    getBookingAnalytics(thirtyDaysAgo, today),
                    getInventoryAnalytics()
                ]);
                setBookingStats(bookingData);
                setInventoryStats(inventoryData);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
            }
            finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);
    // Removed loading animation - show content immediately
    if (error) {
        return (_jsx("div", { className: "bg-red-50 p-4 rounded-md", children: _jsx("p", { className: "text-red-700", children: error }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-heritage-green", children: "Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Total Bookings" }), _jsx("p", { className: "mt-2 text-3xl font-semibold text-heritage-green", children: bookingStats?.bookingsCount || 0 })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Revenue (30 days)" }), _jsxs("p", { className: "mt-2 text-3xl font-semibold text-heritage-green", children: ["\u20B1", (bookingStats?.revenue || 0).toLocaleString()] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Occupancy Rate" }), _jsxs("p", { className: "mt-2 text-3xl font-semibold text-heritage-green", children: [Math.round(bookingStats?.occupancyRate || 0), "%"] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Avg. Stay Duration" }), _jsxs("p", { className: "mt-2 text-3xl font-semibold text-heritage-green", children: [Math.round(bookingStats?.averageStayDuration || 0), " days"] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Total Items" }), _jsx("p", { className: "mt-2 text-3xl font-semibold text-heritage-green", children: inventoryStats?.totalItems || 0 })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Low Stock Items" }), _jsx("p", { className: "mt-2 text-3xl font-semibold text-heritage-neutral", children: inventoryStats?.lowStockItems || 0 })] })] })] }));
};
