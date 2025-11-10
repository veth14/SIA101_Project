import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminDashboardStatsProps {
  stats: {
    totalBookings: number;
    todayArrivals: number;
    totalRevenue: number;
    occupancyRate: number;
    lowStockItems: number;
    activeStaff: number;
    totalRooms: number;
    availableRooms: number;
  };
}

export const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({ stats }) => {
  const navigate = useNavigate();
  
  const currentGuests = stats.totalRooms - stats.availableRooms;

  return (
    <div className="space-y-6">
      {/* Hero Metrics - Finance Style */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Bookings - PRIMARY */}
        <div
          className="relative p-8 overflow-hidden transition-all duration-500 border shadow-lg cursor-default rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 group hover:shadow-2xl hover:-translate-y-1"
        >
          {/* Glass morphism effect (non-interactive) */}
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70 pointer-events-none" aria-hidden />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-[#82A33D]/10 to-transparent"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#82A33D]/5 to-transparent"></div>
          
          {/* Content */}
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-5">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Total Bookings</p>
              </div>
              
              <div className="relative">
                <p className="mb-3 text-5xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">{stats.totalBookings}</p>
                <div className="absolute -right-1 -top-1 w-8 h-8 bg-[#82A33D]/5 rounded-full blur-md -z-10 group-hover:bg-[#82A33D]/10 transition-colors duration-300"></div>
              </div>
              
              <div className="inline-flex items-center px-3 py-1 text-xs font-bold border rounded-full bg-emerald-50 text-emerald-700 border-emerald-200/50">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {stats.todayArrivals} arrivals today
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 transition-all duration-300 bg-green-100 border shadow-md rounded-xl border-white/70 group-hover:shadow-lg group-hover:scale-105">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-xl from-white/40"></div>
              </div>
              <div className="absolute transition-all duration-300 opacity-0 -inset-1 bg-gradient-to-r from-[#82A33D]/20 to-emerald-400/20 rounded-xl blur-md group-hover:opacity-100"></div>
            </div>
          </div>
          
          {/* Bottom progress indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#82A33D] to-emerald-400" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Current Guests - PRIMARY */}
        <div
          className="relative p-8 overflow-hidden transition-all duration-500 border shadow-lg cursor-default rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 group hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70 pointer-events-none" aria-hidden />
          <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-[#82A33D]/10 to-transparent"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#82A33D]/5 to-transparent"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-5">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Current Guests</p>
              </div>
              
              <div className="relative">
                <p className="mb-3 text-5xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">{currentGuests}</p>
                <div className="absolute -right-1 -top-1 w-8 h-8 bg-[#82A33D]/5 rounded-full blur-md -z-10 group-hover:bg-[#82A33D]/10 transition-colors duration-300"></div>
              </div>
              
              <div className="inline-flex items-center px-3 py-1 text-xs font-bold text-blue-700 border rounded-full bg-blue-50 border-blue-200/50">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {stats.occupancyRate}% occupancy
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 transition-all duration-300 bg-blue-100 border shadow-md rounded-xl border-white/70 group-hover:shadow-lg group-hover:scale-105">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-xl from-white/40"></div>
              </div>
              <div className="absolute transition-all duration-300 opacity-0 -inset-1 bg-gradient-to-r from-[#82A33D]/20 to-emerald-400/20 rounded-xl blur-md group-hover:opacity-100"></div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Available Rooms - PRIMARY */}
        <div
          className="relative p-8 overflow-hidden transition-all duration-500 border shadow-lg cursor-default rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 group hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70 pointer-events-none" aria-hidden />
          <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-[#82A33D]/10 to-transparent"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#82A33D]/5 to-transparent"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-5">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Available Rooms</p>
              </div>
              
              <div className="relative">
                <p className="mb-3 text-5xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">{stats.availableRooms}</p>
                <div className="absolute -right-1 -top-1 w-8 h-8 bg-[#82A33D]/5 rounded-full blur-md -z-10 group-hover:bg-[#82A33D]/10 transition-colors duration-300"></div>
              </div>
              
              <div className="inline-flex items-center px-3 py-1 text-xs font-bold text-purple-700 border rounded-full bg-purple-50 border-purple-200/50">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                of {stats.totalRooms} total rooms
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 transition-all duration-300 bg-purple-100 border shadow-md rounded-xl border-white/70 group-hover:shadow-lg group-hover:scale-105">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-xl from-white/40"></div>
              </div>
              <div className="absolute transition-all duration-300 opacity-0 -inset-1 bg-gradient-to-r from-[#82A33D]/20 to-emerald-400/20 rounded-xl blur-md group-hover:opacity-100"></div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: '33%' }}></div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics - Finance Style */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Total Revenue */}
        <div className="relative p-6 overflow-hidden transition-all duration-500 border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Total Revenue</p>
              </div>
              
              <p className="mb-2 text-3xl font-black text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                ₱{stats.totalRevenue.toLocaleString()}
              </p>
              
              <p className="text-xs text-gray-500">Monthly earnings</p>
            </div>
            
            <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-green-100 border shadow-md rounded-xl border-white/70 group-hover:shadow-lg group-hover:scale-105">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Today's Arrivals */}
        <div className="relative p-6 overflow-hidden transition-all duration-500 border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Today's Arrivals</p>
              </div>
              
              <p className="mb-2 text-3xl font-black text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                {stats.todayArrivals}
              </p>
              
              <p className="text-xs text-gray-500">Expected today</p>
            </div>
            
            <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-blue-100 border shadow-md rounded-xl border-white/70 group-hover:shadow-lg group-hover:scale-105">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="relative p-6 overflow-hidden transition-all duration-500 border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Low Stock</p>
              </div>
              
              <p className="mb-2 text-3xl font-black text-orange-600 transition-transform duration-300 group-hover:scale-105">
                {stats.lowStockItems}
              </p>
              
              <p className="text-xs text-gray-500">Needs reorder</p>
            </div>
            
            <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-orange-100 border shadow-md rounded-xl border-white/70 group-hover:shadow-lg group-hover:scale-105">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Staff */}
        <div className="relative p-6 overflow-hidden transition-all duration-500 border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Active Staff</p>
              </div>
              
              <p className="mb-2 text-3xl font-black text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                {stats.activeStaff}
              </p>
              
              <p className="text-xs text-gray-500">Currently active</p>
            </div>
            
            <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-indigo-100 border shadow-md rounded-xl border-white/70 group-hover:shadow-lg group-hover:scale-105">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (buttons only) */}
      <div className="p-4 border border-gray-200 shadow-lg bg-gradient-to-br from-gray-50 to-white rounded-2xl">
        <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4">
          <button
            onClick={() => navigate('/frontdesk/reservations')}
            className="flex flex-col items-center justify-center p-4 transition-all border bg-emerald-50 hover:bg-emerald-100 border-emerald-200 rounded-xl group"
          >
            <div className="flex items-center justify-center w-10 h-10 mb-2 transition-transform rounded-lg bg-emerald-600 group-hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Add Reservation</span>
          </button>

          <button
            onClick={() => navigate('/admin/inventory')}
            className="flex flex-col items-center justify-center p-4 transition-all border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl group"
          >
            <div className="flex items-center justify-center w-10 h-10 mb-2 transition-transform bg-blue-600 rounded-lg group-hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Manage Inventory</span>
          </button>

          <button
            onClick={() => navigate('/admin/reports')}
            className="flex flex-col items-center justify-center p-4 transition-all border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl group"
          >
            <div className="flex items-center justify-center w-10 h-10 mb-2 transition-transform bg-purple-600 rounded-lg group-hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Generate Report</span>
          </button>

          <button
            onClick={() => navigate('/admin/finances/payments')}
            className="flex flex-col items-center justify-center p-4 transition-all border bg-amber-50 hover:bg-amber-100 border-amber-200 rounded-xl group"
          >
            <div className="flex items-center justify-center w-10 h-10 mb-2 transition-transform rounded-lg bg-amber-600 group-hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">View Payments</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardStats;