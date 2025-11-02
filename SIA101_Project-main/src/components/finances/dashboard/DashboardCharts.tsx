import React from 'react';
import RevenueAnalytics from './RevenueAnalytics';
import ProfitAnalysis from './ProfitAnalysis';
import RecentTransactions from './RecentTransactions';
import RecentActivities from './RecentActivities';

const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Analytics */}
      <RevenueAnalytics />
      
      {/* Profit Analysis */}
      <ProfitAnalysis />
      
      {/* Recent Transactions */}
      <RecentTransactions />
      
      {/* Recent Activities */}
      <RecentActivities />
    </div>
  );
};

export default DashboardCharts;

