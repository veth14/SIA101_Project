import React from 'react';
import { SearchInput } from '../../admin/SearchInput';
import { DateRangePicker } from '../../admin/DateRangePicker';

interface FiltersPanelProps {
  searchQuery: string;
  statusFilter: string;
  dateRange: { startDate: string; endDate: string };
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  statusCounts: {
    all: number;
    confirmed: number;
    'checked-in': number;
    'checked-out': number;
    cancelled?: number;
  };
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  searchQuery,
  statusFilter,
  dateRange,
  onSearch,
  onStatusFilter,
  onDateRangeChange,
  statusCounts
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Reservations', count: statusCounts.all, color: 'bg-gray-100 text-gray-700' },
    { value: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'checked-in', label: 'Checked In', count: statusCounts['checked-in'], color: 'bg-green-100 text-green-700' },
    { value: 'checked-out', label: 'Checked Out', count: statusCounts['checked-out'], color: 'bg-blue-100 text-blue-700' },
    { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled || 0, color: 'bg-red-100 text-red-700' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6 h-full">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Filters & Search</h3>
      </div>

      {/* Search Bar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Reservations</label>
        <SearchInput
          placeholder="Search by guest name, email, or booking ID..."
          onSearch={onSearch}
        />
      </div>

      {/* Status Filter Tabs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Status</label>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusFilter(option.value)}
              className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                statusFilter === option.value
                  ? 'border-heritage-green bg-heritage-green/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${
                    statusFilter === option.value ? 'text-heritage-green' : 'text-gray-600'
                  }`}>
                    {option.label}
                  </p>
                  <p className={`text-lg font-bold ${
                    statusFilter === option.value ? 'text-heritage-green' : 'text-gray-900'
                  }`}>
                    {option.count}
                  </p>
                </div>
                {statusFilter === option.value && (
                  <div className="w-2 h-2 bg-heritage-green rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date Range</label>
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
        />
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || statusFilter !== 'all' || dateRange.startDate || dateRange.endDate) && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Active Filters:</p>
            <button
              onClick={() => {
                onSearch('');
                onStatusFilter('all');
                onDateRangeChange({ startDate: '', endDate: '' });
              }}
              className="text-sm text-heritage-green hover:text-heritage-green/80 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
              </span>
            )}
            {(dateRange.startDate || dateRange.endDate) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Date Range Applied
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;
