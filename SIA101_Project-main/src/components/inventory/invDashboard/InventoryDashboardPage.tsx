import React from 'react';
import InventoryDashboardHeader from './InventoryDashboardHeader';
import { DashboardBackground } from './DashboardBackground';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardActivity } from './DashboardActivity';

const InventoryDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background Elements */}
      <DashboardBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header - Keep Original */}
        <InventoryDashboardHeader />

        {/* Stats Cards */}
        <DashboardStats />

        {/* Charts Section */}
        <DashboardCharts />

        {/* Activity Feed */}
        <DashboardActivity />
      </div>
    </div>
  );
};

export default InventoryDashboardPage;
