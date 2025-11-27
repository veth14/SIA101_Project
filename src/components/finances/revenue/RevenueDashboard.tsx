import React, { useEffect, useMemo, useState } from 'react';
import RevenueStats from './RevenueStats';
import RevenueSourcesBreakdown, { RevenueData } from './RevenueSourcesBreakdown';
import RevenueDistribution from './RevenueDistribution';
import RevenueTrends from './RevenueTrends';
import { subscribeToInvoices, InvoiceRecord } from '../../../backend/invoices/invoicesService';

type RevenueSource = RevenueData['source'];

interface RevenuePoint {
  date: string;
  amount: number;
}

const getInvoiceSource = (record: InvoiceRecord): RevenueSource => {
  const category = (record.transactionCategory || '').toString().toLowerCase();
  const description = (record.transactionDescription || '').toString().toLowerCase();

  // All booking-derived invoices are treated as room revenue
  if (category === 'booking' || description.includes('booking')) {
    return 'rooms';
  }

  if (description.includes('room')) return 'rooms';

  if (
    category.includes('food') ||
    category.includes('beverage') ||
    category.includes('restaurant') ||
    category.includes('bar') ||
    description.includes('food') ||
    description.includes('beverage') ||
    description.includes('restaurant') ||
    description.includes('bar')
  ) {
    return 'food_beverage';
  }

  return 'other';
};

const getInvoiceDate = (record: InvoiceRecord): string => {
  if (record.transactionDate) return record.transactionDate;
  if (record.dueDate) return record.dueDate;
  if (record.createdAt) return record.createdAt.toISOString().split('T')[0];
  return '';
};

const RevenueDashboard: React.FC = () => {
  const [invoiceRecords, setInvoiceRecords] = useState<InvoiceRecord[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToInvoices(
      (records) => {
        const paid = records.filter((r) => r.status === 'paid' || r.status === 'completed');
        setInvoiceRecords(paid);
      },
      (error) => {
        console.error('Error loading invoices for revenue dashboard:', error);
      }
    );

    return unsubscribe;
  }, []);

  const revenuePoints: RevenuePoint[] = useMemo(
    () =>
      invoiceRecords.map((record) => ({
        date: getInvoiceDate(record),
        amount: typeof record.total === 'number' ? record.total : 0,
      })),
    [invoiceRecords]
  );

  const totalRevenue = useMemo(
    () => revenuePoints.reduce((sum, p) => sum + p.amount, 0),
    [revenuePoints]
  );

  const averageDaily = useMemo(() => {
    if (revenuePoints.length === 0) return 0;
    const byDate = new Map<string, number>();
    revenuePoints.forEach((p) => {
      if (!p.date) return;
      byDate.set(p.date, (byDate.get(p.date) || 0) + p.amount);
    });
    const days = byDate.size || 1;
    const total = Array.from(byDate.values()).reduce((sum, v) => sum + v, 0);
    return Math.round(total / days);
  }, [revenuePoints]);

  const growthRate = useMemo(() => {
    const sorted = [...revenuePoints].filter((p) => p.date).sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length < 2) return 0;
    const first = sorted[0].amount;
    const last = sorted[sorted.length - 1].amount;
    if (first <= 0) return 0;
    return Math.round(((last - first) / first) * 100);
  }, [revenuePoints]);

  const bySource: Record<RevenueSource, number> = useMemo(() => {
    const base: Record<RevenueSource, number> = { rooms: 0, food_beverage: 0, other: 0 };
    invoiceRecords.forEach((record) => {
      const source = getInvoiceSource(record);
      const amount = typeof record.total === 'number' ? record.total : 0;
      base[source] += amount;
    });
    return base;
  }, [invoiceRecords]);

  const topSource: string = useMemo(() => {
    const entries: [RevenueSource, number][] = Object.entries(bySource) as [RevenueSource, number][];
    if (entries.length === 0) return 'Rooms';
    const [source] = entries.reduce((max, current) => (current[1] > max[1] ? current : max), entries[0]);
    if (source === 'rooms') return 'Rooms';
    if (source === 'food_beverage') return 'Food & Beverage';
    return 'Other Services';
  }, [bySource]);

  const revenueData: RevenueData[] = useMemo(() => {
    if (totalRevenue <= 0) {
      return [
        {
          id: 'rooms',
          source: 'rooms',
          amount: 0,
          date: '',
          description: 'Room bookings and accommodations',
          percentage: 0,
        },
        {
          id: 'food_beverage',
          source: 'food_beverage',
          amount: 0,
          date: '',
          description: 'Restaurant, room service, and bar sales',
          percentage: 0,
        },
        {
          id: 'other',
          source: 'other',
          amount: 0,
          date: '',
          description: 'Other services',
          percentage: 0,
        },
      ];
    }

    const makeItem = (source: RevenueSource, description: string): RevenueData => {
      const amount = bySource[source] || 0;
      const percentage = (amount / totalRevenue) * 100;
      return {
        id: source,
        source,
        amount,
        date: '',
        description,
        percentage: Number(percentage.toFixed(1)),
      };
    };

    return [
      makeItem('rooms', 'Room bookings and accommodations'),
      makeItem('food_beverage', 'Restaurant, room service, and bar sales'),
      makeItem('other', 'Laundry, parking, and miscellaneous'),
    ];
  }, [bySource, totalRevenue]);

  return (
    <div className="space-y-6">
      <RevenueStats
        totalRevenue={totalRevenue}
        averageDaily={averageDaily}
        growthRate={growthRate}
        topSource={topSource}
      />

      <RevenueTrends revenuePoints={revenuePoints} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueSourcesBreakdown revenueData={revenueData} />
        <RevenueDistribution revenueData={revenueData} />
      </div>
    </div>
  );
};

export default RevenueDashboard;