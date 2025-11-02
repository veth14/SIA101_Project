/**
 * RoomFilters Component
 * 
 * Premium modern filters interface for room management.
 * Provides search and filtering functionality.
 */

import React from 'react';

interface RoomFiltersProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  roomTypeFilter?: string;
  onRoomTypeChange?: (type: string) => void;
  statusOptions?: Array<{ value: string; label: string; count: number }>;
  roomTypeOptions?: Array<{ value: string; label: string }>;
}

const RoomFilters: React.FC<RoomFiltersProps> = ({
  searchTerm = '',
  onSearchChange = () => {},
  statusFilter = 'all',
  onStatusChange = () => {},
  roomTypeFilter = 'all',
  onRoomTypeChange = () => {},
  statusOptions = [
    { value: 'all', label: 'All Status', count: 0 },
    { value: 'available', label: 'Available', count: 0 },
    { value: 'occupied', label: 'Occupied', count: 0 },
    { value: 'maintenance', label: 'Maintenance', count: 0 },
    { value: 'cleaning', label: 'Cleaning', count: 0 }
  ],
  roomTypeOptions = [
    { value: 'all', label: 'All Room Types' },
    { value: 'standard', label: 'Standard Room' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'family', label: 'Family Room' }
  ]
}) => {

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 space-y-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-transparent to-emerald-100/10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-6 right-6 w-3 h-3 bg-heritage-green/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 bg-emerald-400/30 rounded-full animate-bounce"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-heritage-green via-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Icon Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl blur-lg opacity-30"></div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">Search & Filter Rooms</h3>
            <p className="text-sm text-gray-600 font-medium">Find and manage hotel rooms efficiently</p>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by room number, type, or guest name..."
            className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-heritage-green/20 focus:border-heritage-green transition-all duration-300 shadow-sm hover:shadow-md font-medium"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900">Room Status</h4>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 font-semibold text-sm ${
                statusFilter === option.value
                  ? 'border-heritage-green bg-gradient-to-r from-heritage-green to-emerald-600 text-white shadow-xl scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-heritage-green/50 hover:bg-heritage-green/5 hover:scale-102 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-black">{option.count}</div>
                <div className="text-xs opacity-90">{option.label}</div>
              </div>
              {statusFilter === option.value && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Room Type Filter */}
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900">Room Type</h4>
        </div>
        <div className="relative">
          <select
            value={roomTypeFilter}
            onChange={(e) => onRoomTypeChange(e.target.value)}
            className="w-full p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md font-semibold appearance-none cursor-pointer"
          >
            {roomTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFilters;
