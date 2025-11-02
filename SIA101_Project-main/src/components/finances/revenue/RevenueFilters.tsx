import React from 'react';

interface RevenueFiltersProps {
  selectedPeriod: string;
  selectedSource: string;
  onPeriodChange: (period: string) => void;
  onSourceChange: (source: string) => void;
}

const RevenueFilters: React.FC<RevenueFiltersProps> = ({
  selectedPeriod,
  selectedSource,
  onPeriodChange,
  onSourceChange
}) => {
  return (
    <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
          <p className="text-sm text-gray-600">Track revenue streams and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm font-medium"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm font-medium"
          >
            <option value="all">All Sources</option>
            <option value="rooms">Rooms</option>
            <option value="food_beverage">Food & Beverage</option>
            <option value="spa_services">Spa Services</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RevenueFilters;
