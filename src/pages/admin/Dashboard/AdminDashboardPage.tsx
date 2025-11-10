import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import RevenueTrendsCard from '../../../components/admin/RevenueTrendsCard';
import SmartInsightsCard from '../../../components/admin/SmartInsightsCard';
import { AdminDashboardStats } from '../../../components/admin/AdminDashboardStats';

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

type FieldDate = Date | { toDate: () => Date } | string | undefined;

interface BookingRecord {
  id: string;
  checkInDate?: FieldDate;
  status?: string;
  totalAmount?: number;
}

interface InventoryRecord {
  id: string;
  currentStock?: number;
  reorderLevel?: number;
}

interface StaffRecord {
  id: string;
  status?: string;
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
  
  const [bookingsData, setBookingsData] = useState<BookingRecord[]>([]);


  const fetchDashboardData = useCallback(async () => {
    try {
      if (!auth.currentUser) {
        return;
      }
      
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      // Fetch Firebase collections with limits to optimize reads
      const [bookingsSnapshot, roomsSnapshot, inventorySnapshot, staffSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'bookings'), limit(100))),
        getDocs(query(collection(db, 'rooms'), limit(100))),
        getDocs(query(collection(db, 'inventory'), limit(100))),
        getDocs(query(collection(db, 'staff'), limit(50)))
      ]);

      const bookings = bookingsSnapshot.docs.map(d => ({ 
        ...(d.data() as unknown as Omit<BookingRecord, 'id'>), 
        id: d.id 
      })) as BookingRecord[];
      
      const totalBookings = bookings.length;

      const todayArrivals = bookings.filter(booking => {
        const raw = booking.checkInDate;
        if (!raw) return false;

        try {
          let checkInDate: Date | null = null;
          if (typeof raw === 'object' && raw !== null && 'toDate' in raw) {
            checkInDate = (raw as { toDate: () => Date }).toDate();
          } else if (typeof raw === 'string') {
            checkInDate = new Date(raw);
          } else if (raw instanceof Date) {
            checkInDate = raw;
          }
          if (!checkInDate) return false;
          return checkInDate >= todayStart && checkInDate < todayEnd;
        } catch {
          return false;
        }
      }).length;

      const validBookingsForRevenue = bookings.filter(booking => booking.status !== 'cancelled');
      const totalRevenue = validBookingsForRevenue.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

      const rooms = roomsSnapshot.docs.map(d => ({ 
        ...(d.data() as Record<string, unknown>), 
        id: d.id 
      }));
      
      const totalRooms = Math.max(rooms.length, 50);
      
      const occupiedRooms = bookings.filter(booking => 
        booking.status === 'confirmed' || 
        booking.status === 'checked-in' ||
        booking.status === 'active' ||
        !booking.status
      ).length;
      
      const availableRooms = totalRooms - occupiedRooms;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      const inventory = inventorySnapshot.docs.map(d => ({ 
        ...(d.data() as unknown as InventoryRecord), 
        id: d.id 
      })) as InventoryRecord[];
      const lowStockItems = inventory.filter(item => 
        (item.currentStock ?? 0) <= (item.reorderLevel ?? 0)
      ).length;

      const staff = staffSnapshot.docs.map(d => ({ 
        ...(d.data() as unknown as StaffRecord), 
        id: d.id 
      })) as StaffRecord[];
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

      setBookingsData(bookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        totalBookings: 0,
        todayArrivals: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        lowStockItems: 0,
        activeStaff: 0,
        totalRooms: 50,
        availableRooms: 50,
      });
      setBookingsData([]);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute rounded-full opacity-25 bottom-16 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 w-full px-4 py-6 space-y-6 lg:px-8">
        {/* Header (variant switchable) */}

        <AdminDashboardStats stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <RevenueTrendsCard bookings={bookingsData} />
          <SmartInsightsCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
