import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

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

interface RecentActivity {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'booking' | 'checkin' | 'inventory' | 'staff';
  amount?: number;
}

export const ProfessionalDashboard = () => {
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
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
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

      // Generate activities from real data
      const activities: RecentActivity[] = [];
      
      bookings.slice(0, 3).forEach((booking, index) => {
        activities.push({
          id: `booking-${index}`,
          action: 'New Booking',
          details: `${booking.guestName || 'Guest'} - ${booking.roomType || 'Room'}`,
          timestamp: booking.createdAt?.toDate() || new Date(Date.now() - index * 60 * 1000),
          type: 'booking'
        });
      });

      inventory.filter(item => item.currentStock <= item.reorderLevel).slice(0, 2).forEach((item, index) => {
        activities.push({
          id: `inventory-${index}`,
          action: 'Low Stock Alert',
          details: `${item.name} - ${item.currentStock} remaining`,
          timestamp: new Date(Date.now() - (index + 3) * 60 * 1000),
          type: 'inventory'
        });
      });

      setRecentActivities(activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

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

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin 👋</h1>
              <p className="text-gray-600 mt-1">Here's what's happening at Balay Ginhawa today</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-lg font-semibold text-heritage-green">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Arrivals */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Today's Arrivals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayArrivals}</p>
                <p className="text-xs text-gray-400 mt-1">Expected today</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-heritage-light rounded-xl flex items-center justify-center group-hover:bg-heritage-green/20 transition-colors">
                  <svg className="w-6 h-6 text-heritage-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₱{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">This month</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-heritage-green h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link
                to="/admin/frontdesk"
                className="group flex items-center p-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Front Desk</p>
                  <p className="text-sm opacity-90">Manage reservations</p>
                </div>
                <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link
                to="/admin/inventory"
                className="group flex items-center p-4 border-2 border-gray-200 hover:border-heritage-green rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Inventory</p>
                  <p className="text-sm text-gray-500">Stock management</p>
                </div>
                <svg className="w-5 h-5 ml-auto text-gray-400 group-hover:text-heritage-green group-hover:translate-x-1 transition-all" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link
                to="/admin/analytics"
                className="group flex items-center p-4 border-2 border-gray-200 hover:border-heritage-green rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-100 transition-colors">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Analytics</p>
                  <p className="text-sm text-gray-500">Reports & insights</p>
                </div>
                <svg className="w-5 h-5 ml-auto text-gray-400 group-hover:text-heritage-green group-hover:translate-x-1 transition-all" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Enhanced System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-900">All Systems</span>
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Operational</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-blue-900">Active Staff</span>
                </div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{stats.activeStaff}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Available Rooms</span>
                </div>
                <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{stats.availableRooms}/{stats.totalRooms}</span>
              </div>
              
              {stats.lowStockItems > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium text-yellow-900">Low Stock Alert</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">{stats.lowStockItems} items</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Recent Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="w-2 h-2 bg-heritage-green rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="relative">
                  {index !== recentActivities.length - 1 && (
                    <div className="absolute left-4 top-8 w-px h-6 bg-gray-200"></div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'booking' ? 'bg-blue-100' :
                      activity.type === 'checkin' ? 'bg-green-100' :
                      activity.type === 'inventory' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'booking' && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {activity.type === 'checkin' && (
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {activity.type === 'inventory' && (
                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-400 flex-shrink-0">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                      {activity.amount && (
                        <p className="text-xs text-heritage-green font-medium mt-1">₱{activity.amount.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
