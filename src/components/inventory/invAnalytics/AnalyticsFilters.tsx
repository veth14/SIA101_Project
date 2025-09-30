import React from 'react';

interface AnalyticsFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  reportType: string;
  onReportTypeChange: (type: string) => void;
  department: string;
  onDepartmentChange: (dept: string) => void;
}

const dateRangeOptions = [
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last3months', label: 'Last 3 Months' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'lastyear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' }
];

const reportTypeOptions = [
  { value: 'consumption', label: 'Consumption Analysis' },
  { value: 'procurement', label: 'Procurement Analysis' },
  { value: 'variance', label: 'Variance Analysis' },
  { value: 'turnover', label: 'Inventory Turnover' },
  { value: 'valuation', label: 'Inventory Valuation' }
];

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'fb', label: 'Food & Beverage' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'frontoffice', label: 'Front Office' },
  { value: 'security', label: 'Security' }
];

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  reportType,
  onReportTypeChange,
  department,
  onDepartmentChange
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Date Range Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📅 Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent bg-white"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Report Type Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📊 Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent bg-white"
          >
            {reportTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏢 Department
          </label>
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent bg-white"
          >
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium">
            Generate Report
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            Export Data
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {dateRange !== 'last30days' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-heritage-green/10 text-heritage-green">
              📅 {dateRangeOptions.find(opt => opt.value === dateRange)?.label}
              <button 
                onClick={() => onDateRangeChange('last30days')}
                className="ml-2 text-heritage-green hover:text-heritage-green/80"
              >
                ×
              </button>
            </span>
          )}
          {reportType !== 'consumption' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              📊 {reportTypeOptions.find(opt => opt.value === reportType)?.label}
              <button 
                onClick={() => onReportTypeChange('consumption')}
                className="ml-2 text-blue-800 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {department !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              🏢 {departmentOptions.find(opt => opt.value === department)?.label}
              <button 
                onClick={() => onDepartmentChange('all')}
                className="ml-2 text-purple-800 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
