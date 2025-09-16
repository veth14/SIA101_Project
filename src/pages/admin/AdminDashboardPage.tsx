import React from 'react';
import { GuestDemographics } from '../../components/admin/GuestDemographics';
// Import other components as needed

export const AdminDashboardPage: React.FC = () => {
  const mockDemographicsData = {
    localGuests: 150,
    foreignGuests: 75,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-600">Total Bookings</h3>
          <p className="text-3xl font-bold mt-2">256</p>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-600">Revenue</h3>
          <p className="text-3xl font-bold mt-2">₱458,500</p>
          <p className="text-sm text-green-600 mt-2">+8% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-600">Room Occupancy</h3>
          <p className="text-3xl font-bold mt-2">85%</p>
          <p className="text-sm text-yellow-600 mt-2">-2% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Demographics Chart */}
        <GuestDemographics {...mockDemographicsData} />
        
        {/* Other charts and components */}
      </div>
    </div>
  );
};
