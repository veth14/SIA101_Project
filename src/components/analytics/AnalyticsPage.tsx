import { useState } from 'react';
import { KpiTile } from '../admin/KpiTile';
import { DateRangePicker } from '../admin/DateRangePicker';
import { RevenueChart } from './RevenueChart';
import { sampleReservations } from '../../data/sampleReservations';
import { rooms } from '../../data/rooms';

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({ 
    startDate: '2024-01-01', 
    endDate: '2024-01-31' 
  });

  // Calculate analytics data
  const calculateAnalytics = () => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // Filter reservations for current period
    const currentReservations = sampleReservations.filter(r => {
      const checkIn = new Date(r.checkIn);
      return checkIn >= thisMonth && checkIn <= today;
    });

    const lastMonthReservations = sampleReservations.filter(r => {
      const checkIn = new Date(r.checkIn);
      return checkIn >= lastMonth && checkIn <= lastMonthEnd;
    });

    // Today's revenue
    const todayRevenue = currentReservations
      .filter(r => new Date(r.checkIn).toDateString() === today.toDateString())
      .reduce((sum, r) => sum + r.totalAmount, 0);

    // This month's revenue
    const thisMonthRevenue = currentReservations
      .reduce((sum, r) => sum + r.totalAmount, 0);

    // Last month's revenue
    const lastMonthRevenue = lastMonthReservations
      .reduce((sum, r) => sum + r.totalAmount, 0);

    // Revenue change percentage
    const revenueChange = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Occupancy calculations
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const occupancyRate = (occupiedRooms / totalRooms) * 100;

    // ADR (Average Daily Rate)
    const totalNights = currentReservations.reduce((sum, r) => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);

    const adr = totalNights > 0 ? thisMonthRevenue / totalNights : 0;

    // RevPAR (Revenue Per Available Room)
    const revpar = adr * (occupancyRate / 100);

    return {
      todayRevenue,
      thisMonthRevenue,
      revenueChange,
      occupancyRate,
      adr,
      revpar,
      totalBookings: currentReservations.length,
      bookingChange: lastMonthReservations.length > 0 
        ? ((currentReservations.length - lastMonthReservations.length) / lastMonthReservations.length) * 100 
        : 0,
    };
  };

  const analytics = calculateAnalytics();

  // Revenue by room type
  const revenueByRoomType = sampleReservations.reduce((acc, reservation) => {
    const roomType = reservation.roomType;
    if (!acc[roomType]) {
      acc[roomType] = 0;
    }
    acc[roomType] += reservation.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const roomTypeData = Object.entries(revenueByRoomType).map(([type, revenue]) => ({
    name: type,
    revenue,
    percentage: (revenue / Object.values(revenueByRoomType).reduce((a, b) => a + b, 0)) * 100,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Track performance and generate insights</p>
        </div>
        <div className="flex space-x-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <button className="bg-white text-heritage-green border border-heritage-green px-4 py-2 rounded-md hover:bg-heritage-light transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiTile
          title="Today's Revenue"
          value={`₱${analytics.todayRevenue.toLocaleString()}`}
          icon="💰"
          color="green"
        />
        <KpiTile
          title="This Month Revenue"
          value={`₱${analytics.thisMonthRevenue.toLocaleString()}`}
          change={{
            value: Math.abs(analytics.revenueChange),
            type: analytics.revenueChange >= 0 ? 'increase' : 'decrease'
          }}
          icon="📈"
          color="blue"
        />
        <KpiTile
          title="Occupancy Rate"
          value={`${analytics.occupancyRate.toFixed(1)}%`}
          icon="🏨"
          color="purple"
        />
        <KpiTile
          title="Total Bookings"
          value={analytics.totalBookings}
          change={{
            value: Math.abs(analytics.bookingChange),
            type: analytics.bookingChange >= 0 ? 'increase' : 'decrease'
          }}
          icon="📋"
          color="yellow"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiTile
          title="ADR (Average Daily Rate)"
          value={`₱${analytics.adr.toLocaleString()}`}
          icon="💵"
          color="green"
        />
        <KpiTile
          title="RevPAR (Revenue Per Available Room)"
          value={`₱${analytics.revpar.toLocaleString()}`}
          icon="🏢"
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <RevenueChart />
        </div>

        {/* Room Type Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Revenue by Room Type</h3>
          <div className="space-y-4">
            {roomTypeData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-heritage-green' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    ₱{item.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Booking Status</h3>
          <div className="space-y-3">
            {['confirmed', 'checked-in', 'checked-out', 'cancelled'].map((status) => {
              const count = sampleReservations.filter(r => r.status === status).length;
              const percentage = (count / sampleReservations.length) * 100;
              const statusColors = {
                confirmed: 'bg-blue-500',
                'checked-in': 'bg-green-500',
                'checked-out': 'bg-gray-500',
                cancelled: 'bg-red-500',
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Payment Status</h3>
          <div className="space-y-3">
            {['paid', 'pending', 'refunded'].map((status) => {
              const count = sampleReservations.filter(r => r.paymentStatus === status).length;
              const percentage = (count / sampleReservations.length) * 100;
              const statusColors = {
                paid: 'bg-green-500',
                pending: 'bg-yellow-500',
                refunded: 'bg-red-500',
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Occupancy */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Room Status</h3>
          <div className="space-y-3">
            {['available', 'occupied', 'maintenance', 'cleaning'].map((status) => {
              const count = rooms.filter(r => r.status === status).length;
              const percentage = (count / rooms.length) * 100;
              const statusColors = {
                available: 'bg-green-500',
                occupied: 'bg-blue-500',
                maintenance: 'bg-red-500',
                cleaning: 'bg-yellow-500',
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-heritage-light hover:border-heritage-green transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-medium text-gray-900">Monthly Report</h4>
                <p className="text-sm text-gray-500">Generate comprehensive monthly analytics</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-heritage-light hover:border-heritage-green transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💰</span>
              <div>
                <h4 className="font-medium text-gray-900">Revenue Report</h4>
                <p className="text-sm text-gray-500">Detailed revenue breakdown and trends</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-heritage-light hover:border-heritage-green transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏨</span>
              <div>
                <h4 className="font-medium text-gray-900">Occupancy Report</h4>
                <p className="text-sm text-gray-500">Room utilization and occupancy trends</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
