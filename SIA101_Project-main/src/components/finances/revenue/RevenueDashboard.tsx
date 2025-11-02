import React from 'react';
import RevenueStats from './RevenueStats';
import RevenueSourcesBreakdown from './RevenueSourcesBreakdown';
import RevenueDistribution from './RevenueDistribution';
import RevenueTrends from './RevenueTrends';
import type { RevenueData } from './RevenueSourcesBreakdown';

const RevenueDashboard: React.FC = () => {

  // Sample revenue data
  const revenueData: RevenueData[] = [
    {
      id: '1',
      source: 'rooms',
      amount: 52400,
      date: '2024-10-08',
      description: 'Room bookings and accommodations',
      percentage: 71.5
    },
    {
      id: '2',
      source: 'food_beverage',
      amount: 18900,
      date: '2024-10-08',
      description: 'Restaurant, room service, and bar sales',
      percentage: 25.8
    },
    {
      id: '3',
      source: 'other',
      amount: 1980,
      date: '2024-10-08',
      description: 'Laundry, parking, and miscellaneous',
      percentage: 2.7
    }
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const averageDaily = Math.round(totalRevenue / 30);
  const growthRate = 12.5;
  const topSource = 'Rooms';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <RevenueStats
        totalRevenue={totalRevenue}
        averageDaily={averageDaily}
        growthRate={growthRate}
        topSource={topSource}
      />

      {/* Revenue Analytics Chart */}
      <RevenueTrends />

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueSourcesBreakdown revenueData={revenueData} />
        <RevenueDistribution revenueData={revenueData} />
      </div>
    </div>
  );
};

export default RevenueDashboard;