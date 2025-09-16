import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon?: React.ReactNode;
}

interface DashboardStatsProps {
  newBookings: number;
  checkIn: number;
  checkOut: number;
  totalRevenue: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendValue, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        {icon && <div className="text-heritage-green">{icon}</div>}
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'} {trendValue}
        </span>
        <span className="text-gray-400 text-sm ml-2">from last week</span>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  newBookings,
  checkIn,
  checkOut,
  totalRevenue,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="New Bookings"
        value={newBookings}
        trend="up"
        trendValue="2.5%"
      />
      <StatsCard
        title="Check-in"
        value={checkIn}
        trend="down"
        trendValue="1.2%"
      />
      <StatsCard
        title="Check-out"
        value={checkOut}
        trend="up"
        trendValue="3.1%"
      />
      <StatsCard
        title="Total Revenue"
        value={`₱${totalRevenue.toLocaleString()}`}
        trend="up"
        trendValue="4.3%"
      />
    </div>
  );
};
