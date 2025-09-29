/**
 * RoomGrid Component
 * 
 * Premium modern grid layout for room cards with pagination and professional header.
 * Displays rooms in a responsive grid with filtering and pagination support.
 */

import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard';

interface RoomGridProps {
  searchTerm?: string;
  statusFilter?: string;
  roomTypeFilter?: string;
}

const RoomGrid: React.FC<RoomGridProps> = ({
  searchTerm = '',
  statusFilter = 'all',
  roomTypeFilter = 'all'
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roomTypeFilter]);

  const roomsData = [
    {
      roomNumber: "101",
      roomType: "Standard Room",
      status: 'available' as const,
      price: 3500,
      features: ["WiFi", "AC", "TV", "Private Bath"]
    },
    {
      roomNumber: "102",
      roomType: "Deluxe Room",
      status: 'occupied' as const,
      price: 4500,
      guest: "John Smith",
      checkIn: "Dec 20, 2024",
      checkOut: "Dec 22, 2024",
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony"]
    },
    {
      roomNumber: "103",
      roomType: "Suite",
      status: 'available' as const,
      price: 7500,
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "Living Room", "Kitchenette"]
    },
    {
      roomNumber: "104",
      roomType: "Family Room",
      status: 'maintenance' as const,
      price: 5500,
      features: ["WiFi", "AC", "TV", "Bunk Beds", "Extra Space"]
    },
    {
      roomNumber: "201",
      roomType: "Standard Room",
      status: 'cleaning' as const,
      price: 3500,
      features: ["WiFi", "AC", "TV", "Private Bath"]
    },
    {
      roomNumber: "202",
      roomType: "Deluxe Room",
      status: 'occupied' as const,
      price: 4500,
      guest: "Maria Garcia",
      checkIn: "Dec 19, 2024",
      checkOut: "Dec 21, 2024",
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony"]
    },
    {
      roomNumber: "203",
      roomType: "Suite",
      status: 'available' as const,
      price: 7500,
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "Living Room", "Jacuzzi"]
    },
    {
      roomNumber: "204",
      roomType: "Standard Room",
      status: 'available' as const,
      price: 3500,
      features: ["WiFi", "AC", "TV", "Private Bath"]
    },
    {
      roomNumber: "301",
      roomType: "Family Room",
      status: 'occupied' as const,
      price: 5500,
      guest: "The Johnson Family",
      checkIn: "Dec 18, 2024",
      checkOut: "Dec 23, 2024",
      features: ["WiFi", "AC", "TV", "Bunk Beds", "Extra Space", "Connecting Rooms"]
    },
    {
      roomNumber: "302",
      roomType: "Deluxe Room",
      status: 'available' as const,
      price: 4500,
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "Ocean View"]
    },
    {
      roomNumber: "303",
      roomType: "Standard Room",
      status: 'maintenance' as const,
      price: 3500,
      features: ["WiFi", "AC", "TV", "Private Bath"]
    },
    {
      roomNumber: "304",
      roomType: "Suite",
      status: 'occupied' as const,
      price: 7500,
      guest: "Robert Wilson",
      checkIn: "Dec 21, 2024",
      checkOut: "Dec 25, 2024",
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "Living Room", "Kitchen"]
    }
  ];

  // Filter rooms based on search and filters
  const filteredRooms = roomsData.filter(room => {
    const matchesSearch = searchTerm === '' || 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.guest?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    
    // Improved room type matching
    const matchesType = roomTypeFilter === 'all' || 
      room.roomType.toLowerCase().includes(roomTypeFilter.toLowerCase()) ||
      (roomTypeFilter === 'standard' && room.roomType.toLowerCase().includes('standard')) ||
      (roomTypeFilter === 'deluxe' && room.roomType.toLowerCase().includes('deluxe')) ||
      (roomTypeFilter === 'suite' && room.roomType.toLowerCase().includes('suite')) ||
      (roomTypeFilter === 'family' && room.roomType.toLowerCase().includes('family'));
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Show empty state if no rooms
  if (filteredRooms.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Hotel Rooms</h3>
            <p className="text-sm text-gray-500 font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRooms.length)} of {filteredRooms.length} rooms • Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 items-stretch">
          {currentRooms.map((room, index) => (
            <div
              key={room.roomNumber}
              className="opacity-0 animate-pulse h-full"
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards` 
              }}
            >
              <RoomCard
                roomNumber={room.roomNumber}
                roomType={room.roomType}
                status={room.status}
                price={room.price}
                guest={room.guest}
                checkIn={room.checkIn}
                checkOut={room.checkOut}
                features={room.features}
                maxFeatures={3}
                onViewDetails={() => console.log('View details:', room.roomNumber)}
                onEdit={() => console.log('Edit room:', room.roomNumber)}
                onDelete={() => console.log('Delete room:', room.roomNumber)}
                onBook={() => console.log('Book room:', room.roomNumber)}
              />
            </div>
          ))}
        </div>
        
        {/* Inline styles for animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `
        }} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-6 border-t border-gray-100">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } transition-colors`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                  disabled={pageNum === '...'}
                  className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                    currentPage === pageNum
                      ? 'bg-heritage-green text-white'
                      : pageNum === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } transition-colors`}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomGrid;
