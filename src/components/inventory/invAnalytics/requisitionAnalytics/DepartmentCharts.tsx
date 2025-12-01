import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../../backend/requisitions/requisitionsService';
import { calculateChartMetrics, formatCurrency, formatShortCurrency } from '../../../finances/revenue/chartsLogic/revenueAnalyticsLogic';

// Recharts JSX typing aliases to avoid strict return-type JSX errors
const RResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<Record<string, unknown>>;
const RAreaChart = AreaChart as unknown as React.ComponentType<Record<string, unknown>>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<Record<string, unknown>>;
const RTooltip = Tooltip as unknown as React.ComponentType<Record<string, unknown>>;
const RArea = Area as unknown as React.ComponentType<Record<string, unknown>>;

// Department performance data (kept static)
const departmentPerformance = [
  { name: 'Housekeeping', requests: 156, avgTime: '2.1h', approval: 94, color: 'bg-blue-500' },
  { name: 'Front Office', requests: 89, avgTime: '1.8h', approval: 97, color: 'bg-green-500' },
  { name: 'Food & Beverage', requests: 134, avgTime: '2.5h', approval: 91, color: 'bg-orange-500' },
  { name: 'Maintenance', requests: 78, avgTime: '3.2h', approval: 88, color: 'bg-red-500' },
  { name: 'Security', requests: 45, avgTime: '1.5h', approval: 98, color: 'bg-purple-500' }
];

// Tooltip typings aligned with AnalyticsChart style
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
              <span className="text-sm text-gray-600">Department requisition value</span>
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

interface DepartmentPoint {
  date: string;
  amount: number;
}

interface DepartmentDataPoint {
  day: string;
  revenue: number;
}

const DepartmentCharts: React.FC = () => {
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const unsubscribe = subscribeToRequisitions((loaded: RequisitionRecord[]) => {
      setRequisitions(loaded || []);
    });
    return unsubscribe;
  }, []);

  const buildDepartmentData = (
    points: DepartmentPoint[],
    timeframe: 'monthly' | 'yearly'
  ): DepartmentDataPoint[] => {
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
      return monthNames.map((m) => ({ day: m, revenue: monthTotals.get(m) || 0 }));
    }

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

    const result: DepartmentDataPoint[] = [];
    for (let week = 1; week <= maxWeek; week++) {
      result.push({ day: `Week ${week}`, revenue: weekTotals.get(week) || 0 });
    }
    return result;
  };

  const departmentPoints: DepartmentPoint[] = useMemo(() => {
    if (!requisitions.length) return [];
    return requisitions.map((req) => {
      const amount = req.totalEstimatedCost || 0;
      const dateStr = req.requestDate || req.createdAt?.toISOString() || new Date().toISOString();
      return { date: dateStr, amount };
    });
  }, [requisitions]);

  const departmentData = useMemo(
    () => buildDepartmentData(departmentPoints, activeTimeframe),
    [departmentPoints, activeTimeframe]
  );

  const metrics = useMemo(() => calculateChartMetrics(departmentData), [departmentData]);

  const chartData = departmentData.map((item) => ({
    day: item.day,
    revenue: item.revenue,
  }));

  return (
    <div className="w-full space-y-8">
      {/* Department Requisition Analytics Chart */}
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
                    <TrendingUp className="w-6 h-6 text-[#82A33D]" />
                  </div>
                  <div className="absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                    Department Requisition Analytics
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-semibold text-gray-600">Requisition value across departments</p>
                    <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                    <span className="text-sm font-bold text-heritage-green">Live requisitions</span>
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
                  margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="deptValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82A33D" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ABAD8A" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <RXAxis
                    dataKey="day"
                    tick={{ fill: '#82A33D', fontSize: 12 }}
                    axisLine={{ stroke: '#82A33D', strokeWidth: 1 }}
                    tickLine={false}
                    interval={0}
                    padding={{ left: 0, right: 0 }}
                  />
                  <RYAxis
                    tickFormatter={formatShortCurrency}
                    tick={{ fill: '#82A33D', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RCartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#ABAD8A"
                  />
                  <RTooltip content={<CustomTooltip />} />
                  <RArea
                    type="linear"
                    dataKey="revenue"
                    stroke="#82A33D"
                    fillOpacity={1}
                    fill="url(#deptValue)"
                    strokeWidth={3}
                    connectNulls
                    dot={false}
                    activeDot={{
                      r: 6,
                      stroke: '#ABAD8A',
                      strokeWidth: 2,
                      fill: 'white',
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
                    ? 'Weekly requisition value (current month)'
                    : 'Monthly requisition value (current year)'}
                </span>
              </div>
            </div>

            {/* Stats and Insights Section */}
            <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
              <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
                <div className="text-sm font-medium text-gray-500">Total Requisition Value</div>
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
                <div className="text-sm font-medium text-gray-500">Projected Value</div>
                <div className="text-2xl font-bold text-heritage-green">
                  {formatCurrency(metrics?.projectedRevenue || 0)}
                </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default DepartmentCharts;