import React from 'react';

interface TransactionFiltersProps {
  filters: {
    dateRange: string;
    type: string;
    category: string;
    status: string;
    searchTerm: string;
  };
  onFiltersChange: (filters: {
    dateRange: string;
    type: string;
    category: string;
    status: string;
    searchTerm: string;
  }) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Filters</h3>
        <p className="text-sm text-gray-600">Filter transactions by criteria</p>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilter('dateRange', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transaction Type
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Types', color: 'gray' },
              { value: 'credit', label: 'Income', color: 'green' },
              { value: 'debit', label: 'Expense', color: 'red' }
            ].map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={filters.type === type.value}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className="text-[#82A33D] focus:ring-[#82A33D]"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
                <div className={`w-2 h-2 rounded-full bg-${type.color}-500 ml-auto`}></div>
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Categories</option>
            <option value="rooms">Room Bookings</option>
            <option value="dining">Dining</option>
            <option value="events">Events</option>
            <option value="services">Services</option>
            <option value="maintenance">Maintenance</option>
            <option value="utilities">Utilities</option>
            <option value="supplies">Supplies</option>
            <option value="payroll">Payroll</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Status
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Status', color: 'gray' },
              { value: 'completed', label: 'Completed', color: 'green' },
              { value: 'pending', label: 'Pending', color: 'yellow' },
              { value: 'failed', label: 'Failed', color: 'red' }
            ].map((status) => (
              <label key={status.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={filters.status === status.value}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="text-[#82A33D] focus:ring-[#82A33D]"
                />
                <span className="text-sm text-gray-700">{status.label}</span>
                <div className={`w-2 h-2 rounded-full bg-${status.color}-500 ml-auto`}></div>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => onFiltersChange({
              dateRange: 'all',
              type: 'all',
              category: 'all',
              status: 'all',
              searchTerm: ''
            })}
            className="w-full py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
export { TransactionFilters };