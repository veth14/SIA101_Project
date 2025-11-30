 import React, { useState } from 'react';
import AnalyticsTabs from './AnalyticsTabs';
import AnalyticsChart from './AnalyticsChartWorking';
import AnalyticsBottomSections from './AnalyticsBottomSections';
import ProcurementAnalyticsPage from './procurementAnalytics/ProcurementAnalyticsPage';
import RequisitionAnalyticsPage from './requisitionAnalytics/RequisitionAnalyticsPage';

const InventoryAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  const renderAnalyticsContent = () => {
    switch (activeTab) {
      case 'procurement':
        return <ProcurementAnalyticsPage />;
      case 'department':
        return <RequisitionAnalyticsPage />;
      default:
        return (
          <div className="space-y-6">
            
            
            {/* Chart */}
            <AnalyticsChart />

            {/* Bottom Sections */}
            <AnalyticsBottomSections />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE] -mt-2">
      {/* Clean Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20"></div>
      </div>

      <div className="relative z-10 px-6 py-6 space-y-6">

        {/* Tabs */}
        <AnalyticsTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Content */}
        {renderAnalyticsContent()}
      </div>
    </div>
  );
};

export default InventoryAnalyticsPage;