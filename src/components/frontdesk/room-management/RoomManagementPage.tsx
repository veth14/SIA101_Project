import React from 'react';
import RoomHeader from './RoomHeader';
import RoomStats from './RoomStats';
import RoomFilters from './RoomFilters';
import RoomGrid from './RoomGrid';
import { useRoomManagement } from './Room-backendLogic/useRoomManagement';

const RoomManagementPage: React.FC = () => {
  const {
    filteredRooms,
    roomStats,
    filterOptions,
    loading,
    error,
    filters,
    setFilters
  } = useRoomManagement();

  // Handler functions for filters
  const handleSearchChange = (term: string) => {
    setFilters({ searchTerm: term });
  };

  const handleStatusChange = (status: string) => {
    setFilters({ statusFilter: status });
  };

  const handleRoomTypeChange = (type: string) => {
    setFilters({ roomTypeFilter: type });
  };


  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        <RoomHeader />
        <RoomStats roomStats={roomStats} loading={loading} />
        <RoomFilters
          searchTerm={filters.searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={filters.statusFilter}
          onStatusChange={handleStatusChange}
          roomTypeFilter={filters.roomTypeFilter}
          onRoomTypeChange={handleRoomTypeChange}
          statusOptions={filterOptions.statusOptions}
          roomTypeOptions={filterOptions.roomTypeOptions}
        />
        <RoomGrid
          rooms={filteredRooms}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default RoomManagementPage;
