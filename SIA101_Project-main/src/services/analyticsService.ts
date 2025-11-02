import {
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface AnalyticsData {
  bookingsCount: number;
  revenue: number;
  occupancyRate: number;
  averageStayDuration: number;
}

export const getBookingAnalytics = async (startDate: Date, endDate: Date): Promise<AnalyticsData> => {
  const bookingsQuery = query(
    collection(db, 'bookings'),
    where('checkIn', '>=', Timestamp.fromDate(startDate)),
    where('checkIn', '<=', Timestamp.fromDate(endDate))
  );

  const bookings = await getDocs(bookingsQuery);
  
  const analytics = bookings.docs.reduce((acc, doc) => {
    const booking = doc.data();
    const stayDuration = (booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24); // in days

    return {
      bookingsCount: acc.bookingsCount + 1,
      revenue: acc.revenue + booking.totalAmount,
      occupancyRate: 0, // Will be calculated after
      averageStayDuration: acc.averageStayDuration + stayDuration,
    };
  }, {
    bookingsCount: 0,
    revenue: 0,
    occupancyRate: 0,
    averageStayDuration: 0,
  });

  // Calculate averages
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  analytics.occupancyRate = (analytics.bookingsCount / totalDays) * 100;
  analytics.averageStayDuration = analytics.averageStayDuration / analytics.bookingsCount;

  return analytics;
};

export const getInventoryAnalytics = async () => {
  const inventoryQuery = query(collection(db, 'inventory'));
  const inventory = await getDocs(inventoryQuery);

  return {
    totalItems: inventory.size,
    lowStockItems: inventory.docs.filter(doc => {
      const item = doc.data();
      return item.quantity <= item.minThreshold;
    }).length
  };
};

export const getRevenueByPeriod = async (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'daily':
      startDate.setDate(now.getDate() - 7); // Last 7 days
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 28); // Last 4 weeks
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 12); // Last 12 months
      break;
    case 'yearly':
      startDate.setFullYear(now.getFullYear() - 5); // Last 5 years
      break;
  }

  return getBookingAnalytics(startDate, now);
};
