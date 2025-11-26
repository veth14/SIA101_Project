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
    refreshRooms,
    modifyRoomState // Destructure the new helper
  } = useRoomManagement();

  // Modal State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  // Modal Handlers
  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  // Switch from View to Edit directly
  const handleSwitchToEdit = (room: Room) => {
    setIsViewModalOpen(false);
    setTimeout(() => {
      setSelectedRoom(room);
      setIsEditModalOpen(true);
    }, 100);
  };

  // Save changes handler (OPTIMIZED)
  const handleSaveChanges = async (roomData: Partial<Room>) => {
    if (!selectedRoom) return;

    try {
      const roomRef = doc(db, 'rooms', selectedRoom.id);
      
      // Logic: isActive is true ONLY if status is 'available'
      const isActive = roomData.status === 'available';

      // 1. Prepare Payload for Firestore (Database Update)
      // We map 'roomSize' from the form back to 'size' for the DB schema
      const { id, roomSize, ...otherData } = roomData as any;
      
      const updatePayload = {
        ...otherData,
        size: roomSize, 
        isActive
      };
      
      // 2. Perform the Write (Cost: 1 Write)
      await updateDoc(roomRef, updatePayload);
      console.log('Room updated successfully (Firestore)');
      
      // 3. Invalidate cache to ensure fresh data on next load
      invalidateRoomsCache();
      
      // 4. OPTIMISTIC UPDATE (Cost: 0 Reads)
      // We construct the full Room object for the local UI state
      // effectively bypassing the need to re-fetch the whole list
      const updatedRoomLocal: Room = {
        ...selectedRoom,      // Keep original data (ID, etc)
        ...roomData as Room,  // Overwrite with form data
        isActive,             // Ensure calculated field is correct
        roomSize: roomData.roomSize // Keep 'roomSize' property for frontend
      };

      // Update the UI instantly
      modifyRoomState(updatedRoomLocal);
      
      // NOTE: We removed 'await refreshRooms(true)' to save ~50 reads per save
      
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
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
          onView={handleViewRoom}
          onEdit={handleEditRoom}
        />
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