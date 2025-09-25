import React from 'react';
import RoomCard from './RoomCard';

const RoomGrid: React.FC = () => {
  const roomsData = [
    {
      roomNumber: "101",
      roomType: "Standard Room",
      status: 'available' as const,
      price: 3500,
      features: ["WiFi", "AC", "TV", "Private Bath"],
      colorScheme: 'green' as const
    },
    {
      roomNumber: "102",
      roomType: "Deluxe Room",
      status: 'occupied' as const,
      price: 4500,
      guest: "John Smith",
      checkIn: "Dec 20, 2024",
      checkOut: "Dec 22, 2024",
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony"],
      colorScheme: 'orange' as const
    },
    {
      roomNumber: "103",
      roomType: "Suite",
      status: 'available' as const,
      price: 7500,
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "Living Room"],
      colorScheme: 'green' as const
    },
    {
      roomNumber: "104",
      roomType: "Family Room",
      status: 'maintenance' as const,
      price: 5500,
      features: ["WiFi", "AC", "TV", "Bunk Beds", "Extra Space"],
      colorScheme: 'red' as const
    },
    {
      roomNumber: "201",
      roomType: "Standard Room",
      status: 'cleaning' as const,
      price: 3500,
      features: ["WiFi", "AC", "TV", "Private Bath"],
      colorScheme: 'blue' as const
    },
    {
      roomNumber: "202",
      roomType: "Deluxe Room",
      status: 'occupied' as const,
      price: 4500,
      guest: "Maria Garcia",
      checkIn: "Dec 19, 2024",
      checkOut: "Dec 21, 2024",
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony"],
      colorScheme: 'orange' as const
    },
    {
      roomNumber: "203",
      roomType: "Suite",
      status: 'available' as const,
      price: 7500,
      features: ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "Living Room"],
      colorScheme: 'green' as const
    },
    {
      roomNumber: "204",
      roomType: "Standard Room",
      status: 'available' as const,
      price: 3500,
      features: ["WiFi", "AC", "TV", "Private Bath"],
      colorScheme: 'green' as const
    },
    {
      roomNumber: "301",
      roomType: "Family Room",
      status: 'occupied' as const,
      price: 5500,
      guest: "The Johnson Family",
      checkIn: "Dec 18, 2024",
      checkOut: "Dec 23, 2024",
      features: ["WiFi", "AC", "TV", "Bunk Beds", "Extra Space"],
      colorScheme: 'orange' as const
    }
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-15"></div>
      <div className="relative bg-gradient-to-br from-white/95 to-green-50/30 backdrop-blur-xl rounded-3xl border border-green-200/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#82A33D] to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Room Directory
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{roomsData.length} rooms</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>{roomsData.filter(room => room.status === 'available').length} available</span>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsData.map((room) => (
              <RoomCard
                key={room.roomNumber}
                roomNumber={room.roomNumber}
                roomType={room.roomType}
                status={room.status}
                price={room.price}
                guest={room.guest}
                checkIn={room.checkIn}
                checkOut={room.checkOut}
                features={room.features}
                colorScheme={room.colorScheme}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomGrid;
