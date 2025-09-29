/**
 * RoomFilters Component
 * 
 * Premium modern filters interface for room management.
 * Provides search, filtering, and add new room functionality.
 */

import React from 'react';

interface RoomFiltersProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  roomTypeFilter?: string;
  onRoomTypeChange?: (type: string) => void;
  onAddNew?: () => void;
}

const RoomFilters: React.FC<RoomFiltersProps> = ({
  searchTerm = '',
  onSearchChange = () => {},
  statusFilter = 'all',
  onStatusChange = () => {},
  roomTypeFilter = 'all',
  onRoomTypeChange = () => {},
  onAddNew = () => {}
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status', count: 50 },
    { value: 'available', label: 'Available', count: 32 },
    { value: 'occupied', label: 'Occupied', count: 18 },
    { value: 'maintenance', label: 'Maintenance', count: 0 },
    { value: 'cleaning', label: 'Cleaning', count: 0 }
  ];

  const roomTypeOptions = [
    { value: 'all', label: 'All Room Types' },
    { value: 'standard', label: 'Standard Room' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'family', label: 'Family Room' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Room Filters & Search</h3>
        <div className="flex-1"></div>
        <button 
          onClick={onAddNew}
          className="group relative overflow-hidden bg-gradient-to-r from-heritage-green to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-heritage-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-2">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add New Room</span>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Search Rooms</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by room number, type, or guest name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-500 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🏨 Filter by Status</label>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
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
                  <div className="w-2 h-2 bg-heritage-green rounded-full animate-pulse"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Room Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">🏠 Filter by Room Type</label>
        <select
          value={roomTypeFilter}
          onChange={(e) => onRoomTypeChange(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all duration-300"
        >
          {roomTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Summary */}
      {(searchTerm || statusFilter !== 'all' || roomTypeFilter !== 'all') && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Active Filters:</p>
            <button
              onClick={() => {
                onSearchChange('');
                onStatusChange('all');
                onRoomTypeChange('all');
              }}
              className="text-sm text-heritage-green hover:text-heritage-green/80 font-medium transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🔍 Search: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🏨 Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                <button
                  onClick={() => onStatusChange('all')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {roomTypeFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🏠 Type: {roomTypeOptions.find(opt => opt.value === roomTypeFilter)?.label}
                <button
                  onClick={() => onRoomTypeChange('all')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomFilters;
