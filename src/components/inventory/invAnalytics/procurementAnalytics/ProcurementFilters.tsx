import React from 'react';

interface ProcurementFiltersProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

const dateRangeOptions = [
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'lastyear', label: 'Last Year' }
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'linens', label: 'Linens & Textiles' },
  { value: 'cleaning', label: 'Cleaning Supplies' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'maintenance', label: 'Maintenance' }
];

const ProcurementFilters: React.FC<ProcurementFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Procurement Filters</h3>
        <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Reset All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementFilters;
