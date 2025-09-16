import React from 'react';

interface RoomStatus {
  occupied: number;
  reserved: number;
  available: number;
  notReady: number;
}

export const RoomAvailability: React.FC<{ status: RoomStatus }> = ({ status }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Room Availability</h2>
        <div className="relative">
          <input
            type="date"
            className="border rounded-md px-3 py-1.5 text-sm"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="h-24 bg-green-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl font-semibold text-green-600">{status.occupied}</span>
          </div>
          <span className="text-sm text-gray-600">Occupied</span>
        </div>
        <div className="text-center">
          <div className="h-24 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl font-semibold text-yellow-600">{status.reserved}</span>
          </div>
          <span className="text-sm text-gray-600">Reserved</span>
        </div>
        <div className="text-center">
          <div className="h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl font-semibold text-blue-600">{status.available}</span>
          </div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="text-center">
          <div className="h-24 bg-red-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl font-semibold text-red-600">{status.notReady}</span>
          </div>
          <span className="text-sm text-gray-600">Not Ready</span>
        </div>
      </div>
    </div>
  );
};
