import React from 'react';
import DepartmentFilters from './DepartmentFilters';
import DepartmentMetrics from './DepartmentMetrics';
import DepartmentCharts from './DepartmentCharts';

interface RequisitionAnalyticsPageProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

const RequisitionAnalyticsPage: React.FC<RequisitionAnalyticsPageProps> = ({
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <DepartmentFilters
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        category={category}
        onCategoryChange={onCategoryChange}
      />

      {/* Metrics */}
      <DepartmentMetrics />

      {/* Charts */}
      <DepartmentCharts />
    </div>
  );
};

export default RequisitionAnalyticsPage;
