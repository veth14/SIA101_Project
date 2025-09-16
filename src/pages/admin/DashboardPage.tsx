import { useState, useEffect } from 'react';
import { getBookingAnalytics, getInventoryAnalytics } from '../../services/analyticsService';
import type { AnalyticsData } from '../../services/analyticsService';

export const DashboardPage = () => {
  const [bookingStats, setBookingStats] = useState<AnalyticsData | null>(null);
  const [inventoryStats, setInventoryStats] = useState<{ totalItems: number; lowStockItems: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heritage-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-heritage-green">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Booking Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Total Bookings</h3>
          <p className="mt-2 text-3xl font-semibold text-heritage-green">
            {bookingStats?.bookingsCount || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Revenue (30 days)</h3>
          <p className="mt-2 text-3xl font-semibold text-heritage-green">
            ₱{(bookingStats?.revenue || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Occupancy Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-heritage-green">
            {Math.round(bookingStats?.occupancyRate || 0)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Avg. Stay Duration</h3>
          <p className="mt-2 text-3xl font-semibold text-heritage-green">
            {Math.round(bookingStats?.averageStayDuration || 0)} days
          </p>
        </div>

        {/* Inventory Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Total Items</h3>
          <p className="mt-2 text-3xl font-semibold text-heritage-green">
            {inventoryStats?.totalItems || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Low Stock Items</h3>
          <p className="mt-2 text-3xl font-semibold text-heritage-neutral">
            {inventoryStats?.lowStockItems || 0}
          </p>
        </div>
      </div>

      {/* Add more dashboard sections as needed */}
    </div>
  );
};
