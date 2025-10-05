 import React, { useState } from 'react';
import InventoryAnalyticsHeader from './InventoryAnalyticsHeader';
import AnalyticsTabs from './AnalyticsTabs';
import { AnalyticsFilters } from './AnalyticsFilters';
import AnalyticsMetrics from './AnalyticsMetrics';
import AnalyticsChart from './AnalyticsChart';
import AnalyticsBottomSections from './AnalyticsBottomSections';
import ProcurementAnalyticsPage from './procurementAnalytics/ProcurementAnalyticsPage';
import RequisitionAnalyticsPage from './requisitionAnalytics/RequisitionAnalyticsPage';

const InventoryAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [dateRange, setDateRange] = useState('last30days');
  const [category, setCategory] = useState('all');

  const renderAnalyticsContent = () => {
    switch (activeTab) {
      case 'procurement':
        return (
          <ProcurementAnalyticsPage
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            category={category}
            onCategoryChange={setCategory}
          />
        );
      case 'department':
        return (
          <RequisitionAnalyticsPage
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            category={category}
            onCategoryChange={setCategory}
          />
        );
      default:
        return (
          <div className="space-y-6">
            

            {/* Metrics */}
            <AnalyticsMetrics />

            {/* Filters */}
            <AnalyticsFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              category={category}
              onCategoryChange={setCategory}
            />
            
            {/* Chart */}
            <AnalyticsChart />

            {/* Bottom Sections */}
            <AnalyticsBottomSections />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Clean Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
      </div>

      <div className="relative z-10 px-6 py-6 space-y-6">
        {/* Header */}
        <InventoryAnalyticsHeader />

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
