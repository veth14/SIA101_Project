import React from 'react';

interface AnalyticsFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

const dateRangeOptions = [
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last3months', label: 'Last 3 Months' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'lastyear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' }
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'linens', label: 'Linens & Textiles' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'cleaning', label: 'Cleaning Supplies' },
  { value: 'maintenance', label: 'Maintenance' }
];

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6">
      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-heritage-green focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-heritage-green focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button className="px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-green/90 text-white rounded-xl text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          Apply Filters
        </button>
      </div>
    </div>
  );
};
