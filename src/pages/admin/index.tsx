import { AdminLayout } from '../../layouts/AdminLayout';
import { KpiTile } from '../../components/admin/KpiTile';
import { sampleReservations } from '../../data/sampleReservations';
import { rooms } from '../../data/rooms';
import { sampleInventory, getLowStockItems } from '../../data/sampleInventory';
import { sampleStaff, getActiveStaff } from '../../data/sampleStaff';

export default function AdminDashboard() {
  // Calculate dashboard metrics
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  // Today's arrivals and departures
  const todayArrivals = sampleReservations.filter(r => r.checkIn === todayString);
  const todayDepartures = sampleReservations.filter(r => r.checkOut === todayString);
  
  // Pending check-ins (confirmed reservations for today)
  const pendingCheckIns = sampleReservations.filter(r => 
    r.checkIn === todayString && r.status === 'confirmed'
  );
  
  // Occupied rooms
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const occupancyRate = (occupiedRooms.length / rooms.length) * 100;
  
  // Today's revenue
  const todayRevenue = sampleReservations
    .filter(r => r.checkIn === todayString)
    .reduce((sum, r) => sum + r.totalAmount, 0);
  
  // Low stock items
  const lowStockItems = getLowStockItems();
  
  // Active staff
  const activeStaff = getActiveStaff();

  // Recent activities (mock data)
  const recentActivities = [
    {
      id: 1,
      type: 'check-in',
      message: 'Maria Santos checked in to Room 201',
      time: '10 minutes ago',
      icon: '🏨',
    },
    {
      id: 2,
      type: 'booking',
      message: 'New booking received for Family Suite',
      time: '25 minutes ago',
      icon: '📋',
    },
    {
      id: 3,
      type: 'inventory',
      message: 'Bath towels stock is running low',
      time: '1 hour ago',
      icon: '📦',
    },
    {
      id: 4,
      type: 'maintenance',
      message: 'AC repair completed in Room 203',
      time: '2 hours ago',
      icon: '🔧',
    },
    {
      id: 5,
      type: 'check-out',
      message: 'John Dela Cruz checked out from Room 102',
      time: '3 hours ago',
      icon: '✅',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-lg p-6 text-white">
          <h1 className="text-2xl font-serif font-bold mb-2">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-heritage-light">
            Here's what's happening at Balay Ginhawa today
          </p>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiTile
            title="Today's Arrivals"
            value={todayArrivals.length}
            icon="🛬"
            color="blue"
          />
          <KpiTile
            title="Today's Departures"
            value={todayDepartures.length}
            icon="🛫"
            color="green"
          />
          <KpiTile
            title="Pending Check-ins"
            value={pendingCheckIns.length}
            icon="⏳"
            color="yellow"
          />
          <KpiTile
            title="Occupancy Rate"
            value={`${occupancyRate.toFixed(1)}%`}
            icon="🏨"
            color="purple"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiTile
            title="Today's Revenue"
            value={`₱${todayRevenue.toLocaleString()}`}
            icon="💰"
            color="green"
          />
          <KpiTile
            title="Low Stock Items"
            value={lowStockItems.length}
            icon="📦"
            color="red"
          />
          <KpiTile
            title="Active Staff"
            value={activeStaff.length}
            icon="👥"
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-4">
              {/* Arrivals */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Arrivals ({todayArrivals.length})
                </h4>
                <div className="space-y-2">
                  {todayArrivals.slice(0, 3).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.guestName}</p>
                        <p className="text-sm text-gray-500">{reservation.roomType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{reservation.guests} guests</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          reservation.status === 'confirmed' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {reservation.status === 'confirmed' ? 'Pending' : 'Checked In'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {todayArrivals.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No arrivals scheduled for today</p>
                  )}
                </div>
              </div>

              {/* Departures */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Departures ({todayDepartures.length})
                </h4>
                <div className="space-y-2">
                  {todayDepartures.slice(0, 3).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.guestName}</p>
                        <p className="text-sm text-gray-500">{reservation.roomType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Room {reservation.roomNumber}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          reservation.status === 'checked-in' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reservation.status === 'checked-in' ? 'Occupied' : 'Checked Out'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {todayDepartures.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No departures scheduled for today</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
              Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Status Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
            Room Status Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['available', 'occupied', 'maintenance', 'cleaning'].map((status) => {
              const count = rooms.filter(r => r.status === status).length;
              const percentage = (count / rooms.length) * 100;
              const statusColors = {
                available: 'bg-green-100 text-green-800 border-green-200',
                occupied: 'bg-blue-100 text-blue-800 border-blue-200',
                maintenance: 'bg-red-100 text-red-800 border-red-200',
                cleaning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              };
              
              return (
                <div key={status} className={`p-4 rounded-lg border ${statusColors[status as keyof typeof statusColors]}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm font-medium capitalize">{status}</div>
                    <div className="text-xs mt-1">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-heritage-light hover:border-heritage-green transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏨</span>
                <div>
                  <h4 className="font-medium text-gray-900">Check-in Guest</h4>
                  <p className="text-sm text-gray-500">Process pending arrivals</p>
                </div>
              </div>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-heritage-light hover:border-heritage-green transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📋</span>
                <div>
                  <h4 className="font-medium text-gray-900">New Booking</h4>
                  <p className="text-sm text-gray-500">Create walk-in reservation</p>
                </div>
              </div>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-heritage-light hover:border-heritage-green transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-medium text-gray-900">View Reports</h4>
                  <p className="text-sm text-gray-500">Generate analytics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
