import React from 'react';
import MaintenanceHeader from './MaintenanceHeader';
import StatsGrid from './StatsGrid';
import RecentActivity from './RecentActivity';

const MaintenanceOverviewPage: React.FC = () => {
  return (
    <div className="p-6">
      <MaintenanceHeader />
      <StatsGrid />
      <RecentActivity />
    </div>
  );
};

export default MaintenanceOverviewPage;
