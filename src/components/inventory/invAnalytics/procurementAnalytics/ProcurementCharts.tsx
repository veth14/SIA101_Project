import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord } from '../../../../backend/purchaseOrders/purchaseOrdersService';
import { calculateChartMetrics, formatCurrency, formatShortCurrency } from '../../../finances/revenue/chartsLogic/revenueAnalyticsLogic';

// Recharts JSX typing aliases
const RResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<Record<string, unknown>>;
const RAreaChart = AreaChart as unknown as React.ComponentType<Record<string, unknown>>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<Record<string, unknown>>;
const RTooltip = Tooltip as unknown as React.ComponentType<Record<string, unknown>>;
const RArea = Area as unknown as React.ComponentType<Record<string, unknown>>;

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: TooltipPayload[]; label?: string }> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[220px]">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <div key={`tooltip-${String(index)}`} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">Purchase order value</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ProcurementPoint {
  date: string; // ISO string
  amount: number;
}

interface ProcurementDataPoint {
  day: string;
  revenue: number;
}

const buildProcurementData = (
  points: ProcurementPoint[],
  timeframe: 'monthly' | 'yearly'
): ProcurementDataPoint[] => {
  if (!points.length) return [];

  const parsed = points
    .map((p) => {
      const d = new Date(p.date);
      if (Number.isNaN(d.getTime())) return null;
      return { dateObj: d, amount: p.amount };
    })
    .filter((v): v is { dateObj: Date; amount: number } => v !== null);

  if (!parsed.length) return [];

  if (timeframe === 'yearly') {
    const monthTotals = new Map<string, number>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    parsed.forEach(({ dateObj, amount }) => {
      const label = monthNames[dateObj.getMonth()] || String(dateObj.getMonth() + 1);
      monthTotals.set(label, (monthTotals.get(label) || 0) + amount);
    });
    const orderedMonths = monthNames;
    return orderedMonths.map((m) => ({ day: m, revenue: monthTotals.get(m) || 0 }));
  }

  // monthly -> group by week of month
  const weekTotals = new Map<number, number>();
  parsed.forEach(({ dateObj, amount }) => {
    const dayOfMonth = dateObj.getDate();
    const weekOfMonth = Math.min(5, Math.floor((dayOfMonth - 1) / 7) + 1);
    weekTotals.set(weekOfMonth, (weekTotals.get(weekOfMonth) || 0) + amount);
  });

  const sampleDate = parsed[0]?.dateObj;
  const year = sampleDate?.getFullYear() ?? new Date().getFullYear();
  const monthIndex = sampleDate?.getMonth() ?? new Date().getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const maxWeek = Math.min(5, Math.ceil(daysInMonth / 7));

  const result: ProcurementDataPoint[] = [];
  for (let week = 1; week <= maxWeek; week++) {
    result.push({ day: `Week ${week}`, revenue: weekTotals.get(week) || 0 });
  }
  return result;
};

const ProcurementCharts: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrderRecord[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const unsubscribe = subscribeToPurchaseOrders((loaded: PurchaseOrderRecord[]) => {
      setOrders(loaded || []);
    });
    return unsubscribe;
  }, []);

  const procurementPoints: ProcurementPoint[] = useMemo(() => {
    if (!orders.length) return [];

    return orders.map((order) => {
      const amount = order.totalAmount || 0;
      const dateStr = order.orderDate || order.createdAt?.toISOString() || new Date().toISOString();
      return {
        date: dateStr,
        amount,
      };
    });
  }, [orders]);

  const procurementData = useMemo(
    () => buildProcurementData(procurementPoints, activeTimeframe),
    [procurementPoints, activeTimeframe]
  );

  const metrics = useMemo(() => calculateChartMetrics(procurementData), [procurementData]);

  const chartData = procurementData.map((item) => ({
    day: item.day,
    revenue: item.revenue,
  }));

  return (
    <div className="relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-fade-in">
      {/* Background Elements */}
      <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-[#82A33D]" />
                </div>
                <div className="absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Procurement Analytics
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Purchase orders & supplier performance trends</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                  <span className="text-sm font-bold text-heritage-green">Live purchase orders</span>
                </div>
              </div>
            </div>

            {/* Toggle Buttons (Monthly / Yearly) */}
            <div className="flex space-x-4">
              <div className="flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl shadow-inner backdrop-blur-sm border border-heritage-light/30">
                <button
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'monthly'
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('monthly')}
                >
                  Month
                </button>
                <button
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'yearly'
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('yearly')}
                >
                  Year
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="px-4 py-6">
          <div className="h-[320px] w-full">
            <RResponsiveContainer width="100%" height="100%">
              <RAreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="poValueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A33D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ABAD8A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <RCartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />

                <RXAxis
                  dataKey="day"
                  axisLine={{ stroke: '#82A33D', strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#82A33D' }}
                  interval={0}
                />

                <RYAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#82A33D' }}
                  tickFormatter={formatShortCurrency}
                />

                <RTooltip content={<CustomTooltip />} />

                <RArea
                  type="linear"
                  dataKey="revenue"
                  stroke="#82A33D"
                  strokeWidth={3}
                  fill="url(#poValueGradient)"
                  fillOpacity={1}
                  connectNulls
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: '#ABAD8A',
                    strokeWidth: 2,
                    fill: '#ffffff',
                  }}
                />
              </RAreaChart>
            </RResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center pb-2 mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-heritage-green rounded"></div>
              <span>
                {activeTimeframe === 'monthly'
                  ? 'Weekly purchase order value (current month)'
                  : 'Monthly purchase order value (current year)'}
              </span>
            </div>
          </div>

          {/* Stats summary under chart */}
          <div className="grid grid-cols-1 gap-4 px-2 pt-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
              <div className="text-sm font-medium text-gray-500">Total PO Value</div>
              <div className="text-2xl font-bold text-heritage-green">
                {formatCurrency(metrics?.totalRevenue || 0)}
              </div>
            </div>

            <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
              <div className="text-sm font-medium text-gray-500">Average Period Value</div>
              <div className="text-2xl font-bold text-heritage-green">
                {formatCurrency(metrics?.averageRevenue || 0)}
              </div>
              <div className="text-xs text-gray-500">
                {activeTimeframe === 'monthly' ? 'Per week this month' : 'Per month this year'}
              </div>
            </div>

            <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
              <div className="text-sm font-medium text-gray-500">Peak Period</div>
              <div className="text-2xl font-bold text-heritage-green">
                {formatCurrency(metrics?.maxRevenue || 0)}
              </div>
              <div className="text-xs text-gray-500">{metrics?.maxDay || '—'}</div>
            </div>

            <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
              <div className="text-sm font-medium text-gray-500">Projected PO Value</div>
              <div className="text-2xl font-bold text-heritage-green">
                {formatCurrency(metrics?.projectedRevenue || 0)}
              </div>
              <div className="text-xs text-gray-500">
                Based on {metrics?.growthRate ?? 0}% trend
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCharts;