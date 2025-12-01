import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, collection, query, where, getCountFromServer } from 'firebase/firestore';
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
  currentGuests: number;
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
    currentGuests: 0,
  });

  // Keep bookingsData empty — charts can render gracefully without it.
  const [bookingsData, setBookingsData] = useState<BookingRecord[]>([]);

  const fetchDashboardData = useCallback(async () => {
        try {
          if (!auth.currentUser) return;
          const statsDocRef = doc(db, 'stats', 'dashboard');

          const unsubscribe = onSnapshot(statsDocRef, (snapshot) => {
        const statsData = snapshot.data() ?? {};
        
        // Debug: Check if stats/dashboard exists
        console.log('📊 stats/dashboard exists:', snapshot.exists());
        console.log('📊 stats/dashboard data:', statsData);

        // compute date keys
        const nowDate = new Date();
        const yyyy = nowDate.getFullYear();
        const mm = String(nowDate.getMonth() + 1).padStart(2, '0');
        const dd = String(nowDate.getDate()).padStart(2, '0');
        const todayKey = `${yyyy}-${mm}-${dd}`;
        const monthKey = `${yyyy}-${mm}`;

  // Use overall total bookings (not monthly) for Admin dashboard's Total Bookings
  const totalBookings = Number(statsData.totalBookings ?? 0);
        const totalRevenue = Number(statsData.totalRevenue ?? 0);
        const arrivals = statsData.arrivals ?? {};
        const arrivalsHasToday = Object.prototype.hasOwnProperty.call(arrivals, todayKey);
        let todayArrivals = arrivals[todayKey] ?? 0;

        const totalRoomsFromStats = typeof statsData.totalRooms === 'number' ? Number(statsData.totalRooms) : null;
        const availableRoomsFromStats = typeof statsData.availableRooms === 'number' ? Number(statsData.availableRooms) : null;

        const lowStockItems = Number(statsData.lowStockItems ?? 0);
        const activeStaffFromStats = typeof statsData.activeStaff === 'number' ? Number(statsData.activeStaff) : null;
        const activeStaff = activeStaffFromStats ?? 0;

        const currentGuestsFromStats = typeof statsData.currentGuests === 'number'
          ? Number(statsData.currentGuests)
          : null;

        // start with values from stats.dashboard when present
        let totalRooms = totalRoomsFromStats ?? 0;
        let availableRooms = availableRoomsFromStats ?? 0;

        const needRoomCounts = totalRoomsFromStats === null || availableRoomsFromStats === null;
        const needStaffCount = activeStaffFromStats === null;

        const applyCountsIfNeeded = async () => {
          try {
            if (needRoomCounts) {
              const totalRoomsSnap = await getCountFromServer(collection(db, 'rooms'));
              const availableRoomsSnap = await getCountFromServer(
                query(collection(db, 'rooms'), where('status', '==', 'available'))
              );
              totalRooms = Number(totalRoomsSnap.data().count || 0);
              availableRooms = Number(availableRoomsSnap.data().count || 0);
            }

            let currentGuests = currentGuestsFromStats;
            if (currentGuests === null) {
              const checkedInSnap = await getCountFromServer(
                query(collection(db, 'bookings'), where('status', '==', 'checked-in'))
              );
              currentGuests = Number(checkedInSnap.data().count || 0);
            }

            if (!arrivalsHasToday) {
              try {
                const arrivalsSnap = await getCountFromServer(
                  query(collection(db, 'bookings'), where('checkIn', '==', todayKey))
                );
                todayArrivals = Number(arrivalsSnap.data().count || 0);
              } catch (err) {
                console.error('Error counting today arrivals fallback:', err);
                todayArrivals = 0;
              }
            }

            let resolvedActiveStaff = typeof statsData.activeStaff === 'number' ? Number(statsData.activeStaff) : null;
            if (resolvedActiveStaff === null) {
              try {
                const activeByFlag = await getCountFromServer(query(collection(db, 'staff'), where('isActive', '==', true)));
                resolvedActiveStaff = Number(activeByFlag.data().count || 0);
                if (resolvedActiveStaff === 0) {
                  const activeByStatus = await getCountFromServer(query(collection(db, 'staff'), where('status', '==', 'active')));
                  resolvedActiveStaff = Number(activeByStatus.data().count || 0);
                }
              } catch (err) {
                resolvedActiveStaff = 0;
              }
            }

            const finalActiveStaff = resolvedActiveStaff ?? activeStaff;

            const occupiedRooms = totalRooms > 0
              ? (currentGuests !== null ? Math.min(totalRooms, currentGuests) : Math.max(0, totalRooms - availableRooms))
              : Math.max(0, totalRooms - availableRooms);
            const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

            setStats({
              totalBookings,
              todayArrivals,
              totalRevenue,
              occupancyRate,
              lowStockItems,
              activeStaff: finalActiveStaff,
              totalRooms,
              availableRooms,
              currentGuests: currentGuests ?? occupiedRooms,
            });
          } catch (err) {
            console.error('Error running fallback aggregation counts:', err);
            const occupiedRooms = totalRooms > 0 ? Math.max(0, totalRooms - availableRooms) : 0;
            const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
            setStats({
              totalBookings,
              todayArrivals,
              totalRevenue,
              occupancyRate,
              lowStockItems,
              activeStaff,
              totalRooms,
              availableRooms,
              currentGuests: currentGuestsFromStats ?? occupiedRooms,
            });
          }
        };

        // Set immediate stats using aggregated fields we have so dashboard isn't empty
        const occupiedRoomsNow = totalRooms > 0 ? Math.max(0, totalRooms - availableRooms) : 0;
        const occupancyRateNow = totalRooms > 0 ? Math.round((occupiedRoomsNow / totalRooms) * 100) : 0;
        const currentGuestsNow = currentGuestsFromStats ?? occupiedRoomsNow;
        setStats({
          totalBookings,
          todayArrivals,
          totalRevenue,
          occupancyRate: occupancyRateNow,
          lowStockItems,
          activeStaff,
          totalRooms,
          availableRooms,
          currentGuests: currentGuestsNow,
        });

        // Rate-limit fallback aggregation calls so a client won't trigger repeated getCountFromServer requests on every mount/refresh
        try {
          const lastRun = sessionStorage.getItem('dashboardCountsLastRun');
          const now = Date.now();
          const tenMinutes = 1000 * 60 * 10;
          const shouldRun = (needRoomCounts || !arrivalsHasToday || needStaffCount) && (!lastRun || now - Number(lastRun) > tenMinutes);

          if (shouldRun) {
            sessionStorage.setItem('dashboardCountsLastRun', String(now));
            void applyCountsIfNeeded();
          }
        } catch (err) {
          // sessionStorage may throw in some environments — run counts once
          void applyCountsIfNeeded();
        }

        setBookingsData([]);
      }, (error) => {
        console.error('Error fetching stats/dashboard:', error);
        // Fallback to safe defaults
        setStats({
          totalBookings: 0,
          todayArrivals: 0,
          totalRevenue: 0,
          occupancyRate: 0,
          lowStockItems: 0,
          activeStaff: 0,
          totalRooms: 0,
          availableRooms: 0,
          currentGuests: 0,
        });
        setBookingsData([]);
      });
      // Clean up subscription on unmount
      return unsubscribe;
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
        currentGuests: 0,
      });
      setBookingsData([]);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    fetchDashboardData().then((unsub) => {
      if (unsub) unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
