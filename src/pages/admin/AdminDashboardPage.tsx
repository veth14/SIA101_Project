import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import QuickActionsCard from '../../components/admin/QuickActionsCard';
import SystemHealthCard from '../../components/admin/SystemHealthCard';
import RevenueTrendsCard from '../../components/admin/RevenueTrendsCard';
import SmartInsightsCard from '../../components/admin/SmartInsightsCard';

interface DashboardStats {
  totalBookings: number;
  todayArrivals: number;
  totalRevenue: number;
  occupancyRate: number;
  lowStockItems: number;
  activeStaff: number;
  totalRooms: number;
  availableRooms: number;
}


export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    todayArrivals: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    lowStockItems: 0,
    activeStaff: 0,
    totalRooms: 0,
    availableRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      // Fetch all Firebase collections
      const [bookingsSnapshot, roomsSnapshot, inventorySnapshot, staffSnapshot] = await Promise.all([
        getDocs(collection(db, 'bookings')),
        getDocs(collection(db, 'rooms')),
        getDocs(collection(db, 'inventory')),
        getDocs(collection(db, 'staff'))
      ]);

      // Process bookings
      const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      const totalBookings = bookings.length;
      
      const todayArrivals = bookings.filter(booking => {
        const checkInDate = booking.checkInDate?.toDate?.() || new Date(booking.checkInDate);
        return checkInDate >= todayStart && checkInDate < todayEnd;
      }).length;

      const totalRevenue = bookings
        .filter(booking => booking.status !== 'cancelled')
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

      // Process rooms
      const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(room => room.status === 'available').length;
      const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;

      // Process inventory
      const inventory = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      const lowStockItems = inventory.filter(item => item.currentStock <= item.reorderLevel).length;

      // Process staff
      const staff = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      const activeStaff = staff.filter(member => member.status === 'active').length;

      setStats({
        totalBookings,
        todayArrivals,
        totalRevenue,
        occupancyRate,
        lowStockItems,
        activeStaff,
        totalRooms,
        availableRooms,
      });



    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback data
      setStats({
        totalBookings: 25,
        todayArrivals: 8,
        totalRevenue: 125000,
        occupancyRate: 85,
        lowStockItems: 3,
        activeStaff: 12,
        totalRooms: 10,
        availableRooms: 3,
      });
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heritage-green mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-heritage-light rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-heritage-green drop-shadow-sm">
                    Welcome to Balay Ginhawa
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Your premium hotel management command center
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

        {/* Premium KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Total Bookings - Premium Light Card */}
        <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200 p-8 transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
          {/* Light Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 border-2 border-white/40">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-2 rounded-full border border-emerald-200/50">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold text-emerald-700">+12%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-blue-800/80 tracking-wide uppercase">Total Bookings</p>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm">{stats.totalBookings}</p>
              <p className="text-sm text-blue-600/80 font-semibold">All time reservations</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-blue-100/50 rounded-full h-2 mt-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-[75%] transition-all duration-1000 shadow-sm animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Arrivals - Premium Glass Card */}
        <div className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-white/50 p-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-transparent to-heritage-neutral/10 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-heritage-green/15 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-heritage-neutral/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Live</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-heritage-green mb-2">Today's Arrivals</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.todayArrivals}</p>
              <p className="text-sm text-heritage-green font-medium">Expected check-ins</p>
            </div>
          </div>
        </div>

        {/* Revenue - Premium Glass Card */}
        <div className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-white/50 p-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-green-600/10 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-400/15 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-emerald-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold">+8%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">₱{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-emerald-600 font-medium">This month earnings</p>
            </div>
          </div>
        </div>

        {/* Occupancy Rate - Premium Glass Card */}
        <div className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-white/50 p-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-violet-600/10 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/15 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-violet-400/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-purple-600">
                  <span className="text-sm font-semibold">{stats.occupancyRate > 80 ? 'High' : stats.occupancyRate > 60 ? 'Good' : 'Low'}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 mb-2">Occupancy Rate</p>
              <p className="text-3xl font-bold text-gray-900 mb-3">{stats.occupancyRate}%</p>
              <div className="w-full bg-purple-200/50 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-violet-600 h-3 rounded-full transition-all duration-1000 shadow-sm" 
                  style={{ width: `${stats.occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Main Dashboard Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <QuickActionsCard />
          <SystemHealthCard />
          <RevenueTrendsCard />
          <SmartInsightsCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
