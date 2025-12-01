import React, { useState } from 'react';
import RoomStats from './RoomStats';
import RoomFilters from './RoomFilters';
import RoomGrid from './RoomGrid';
import { useRoomManagement } from './Room-backendLogic/useRoomManagement';
import { EditRoomModal } from './EditRoomModal';
import { ViewRoomDetailsModal } from './ViewRoomDetailsModal';
import type { Room } from './Room-backendLogic/roomService';
import { invalidateRoomsCache } from './Room-backendLogic/roomService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const RoomManagementPage: React.FC = () => {
  const {
    filteredRooms,
    roomStats,
    filterOptions,
    loading,
    error,
    filters,
    setFilters,
    modifyRoomState
  } = useRoomManagement();

  // --- Lifted State for Pagination ---
  // We control the page here so we can pass the data stats to the Header/Filters
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // --- Handlers ---
  
  // When filters change, we MUST reset to Page 1
  const handleSearchChange = (term: string) => {
    setFilters({ searchTerm: term });
    setCurrentPage(1); 
  };

  const handleStatusChange = (status: string) => {
    setFilters({ statusFilter: status });
    setCurrentPage(1);
  };

  const handleRoomTypeChange = (type: string) => {
    setFilters({ roomTypeFilter: type });
    setCurrentPage(1);
  };

  // Modal Handlers
  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleSwitchToEdit = (room: Room) => {
    setIsViewModalOpen(false);
    setTimeout(() => {
      setSelectedRoom(room);
      setIsEditModalOpen(true);
    }, 100);
  };

  const handleSaveChanges = async (roomData: Partial<Room>) => {
    if (!selectedRoom) return;

    try {
      const roomRef = doc(db, 'rooms', selectedRoom.id);
      const isActive = roomData.status === 'available';

      // @ts-ignore
      const { id, roomSize, ...otherData } = roomData;
      
      const updatePayload = {
        ...otherData,
        size: roomSize, 
        isActive
      };
      
      await updateDoc(roomRef, updatePayload);
      invalidateRoomsCache();
      
      const updatedRoomLocal: Room = {
        ...selectedRoom,
        ...roomData as Room,
        isActive,
        roomSize: roomData.roomSize
      };

      modifyRoomState(updatedRoomLocal);
      
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  // --- Pagination Stats Calculation ---
  const totalItems = filteredRooms.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        
        {/* 1. Stats Cards */}
        <RoomStats roomStats={roomStats} loading={loading} />

        {/* 2. Unified Table Container (Filters + Grid) */}
        <div className="flex flex-col bg-white border shadow-md rounded-xl border-gray-200/70 overflow-hidden">
          
          {/* Header Section */}
          <RoomFilters
            searchTerm={filters.searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={filters.statusFilter}
            onStatusChange={handleStatusChange}
            roomTypeFilter={filters.roomTypeFilter}
            onRoomTypeChange={handleRoomTypeChange}
            statusOptions={filterOptions.statusOptions}
            roomTypeOptions={filterOptions.roomTypeOptions}
            // Pass stats for "Showing 1-6 of 12"
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
          />
          
          {/* Grid Section */}
          <div className="flex-1">
             {/* NOTE: We are now passing currentPage and setCurrentPage 
                down to RoomGrid, so RoomGrid must be updated to accept them!
             */}
            <RoomGrid
              rooms={filteredRooms}
              loading={loading}
              error={error}
              onView={handleViewRoom}
              onEdit={handleEditRoom}
              // Pagination Props
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      </div>

      {/* Modals */}
      <ViewRoomDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        room={selectedRoom}
        onEdit={handleSwitchToEdit}
      />

      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        room={selectedRoom}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default RoomManagementPage;