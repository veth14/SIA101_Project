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
        {/* Light Premium Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white via-heritage-green/5 to-heritage-light/10 rounded-3xl shadow-xl border border-heritage-green/20">
          {/* Light Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-transparent to-heritage-neutral/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-heritage-light/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-heritage-green/5 rounded-full animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-heritage-green/10 rounded-full animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-xl border border-heritage-green/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-heritage-light rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-heritage-green drop-shadow-sm">
                    Analytics & Reports
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Track performance and generate insights
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className="bg-gradient-to-br from-white/90 to-heritage-green/5 backdrop-blur-xl rounded-3xl p-8 border border-heritage-green/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-heritage-light rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <p className="text-4xl font-black bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent drop-shadow-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-1 h-1 bg-heritage-green rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-heritage-neutral rounded-full animate-ping delay-75"></div>
                      <div className="w-1 h-1 bg-heritage-light rounded-full animate-ping delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex space-x-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <button className="bg-white/90 text-heritage-green border-2 border-heritage-green/30 px-6 py-3 rounded-xl hover:bg-heritage-green/5 hover:shadow-lg transition-all duration-300 font-semibold">
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
    </div>
  );
};
