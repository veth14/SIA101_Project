import React from 'react';
import ProcurementFilters from './ProcurementFilters';
import ProcurementMetrics from './ProcurementMetrics';
import ProcurementCharts from './ProcurementCharts';

interface ProcurementAnalyticsPageProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

const ProcurementAnalyticsPage: React.FC<ProcurementAnalyticsPageProps> = ({
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProcurementFilters
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        category={category}
        onCategoryChange={onCategoryChange}
      />

      {/* Metrics */}
      <ProcurementMetrics />

      {/* Charts */}
      <ProcurementCharts />
    </div>
  );
};

export default ProcurementAnalyticsPage;
