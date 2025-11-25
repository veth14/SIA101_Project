import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Recharts JSX typing aliases to avoid strict return-type JSX errors
const RResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<Record<string, unknown>>;
const RAreaChart = AreaChart as unknown as React.ComponentType<Record<string, unknown>>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<Record<string, unknown>>;
const RTooltip = Tooltip as unknown as React.ComponentType<Record<string, unknown>>;
const RArea = Area as unknown as React.ComponentType<Record<string, unknown>>;

// Type definitions
interface TransactionDataPoint {
  day: string;
  transactions: number;
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

// Build chart data from real transactions
const buildTransactionData = (
  transactions: { date: string; amount: number; status: string; category: string }[],
  timeframe: 'monthly' | 'yearly',
  filters: { status: string; category: string }
): TransactionDataPoint[] => {
  const filtered = transactions.filter((t) => {
    const matchesStatus = filters.status === 'all' || t.status === filters.status;
    const matchesCategory = filters.category === 'all' || t.category === filters.category;
    return matchesStatus && matchesCategory;
  });

  const parsed = filtered
    .map((t) => {
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) return null;
      return { dateObj: d, amount: t.amount };
    })
    .filter((v): v is { dateObj: Date; amount: number } => v !== null);

  if (parsed.length === 0) {
    return [];
  }

  // For yearly: group by calendar month (Jan, Feb, ...)
  if (timeframe === 'yearly') {
    const monthTotals = new Map<string, number>();
    parsed.forEach(({ dateObj, amount }) => {
      const monthIndex = dateObj.getMonth(); // 0-11
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = monthNames[monthIndex] || String(monthIndex + 1);
      monthTotals.set(label, (monthTotals.get(label) || 0) + amount);
    });

    const orderedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return orderedMonths
      .filter((m) => monthTotals.has(m))
      .map((m) => ({ day: m, transactions: monthTotals.get(m) || 0 }));
  }

  // For monthly: group by week-of-month (Week 1-5)
  const weekTotals = new Map<number, number>();
  parsed.forEach(({ dateObj, amount }) => {
    const dayOfMonth = dateObj.getDate();
    const weekOfMonth = Math.min(5, Math.floor((dayOfMonth - 1) / 7) + 1); // 1-5
    weekTotals.set(weekOfMonth, (weekTotals.get(weekOfMonth) || 0) + amount);
  });

  const result: TransactionDataPoint[] = [];
  for (let week = 1; week <= 5; week++) {
    if (weekTotals.has(week)) {
      result.push({ day: `Week ${week}`, transactions: weekTotals.get(week) || 0 });
    }
  }

  return result;
};

const calculateChartMetrics = (data: TransactionDataPoint[]) => {
  const total = data.reduce((sum, item) => sum + item.transactions, 0);
  const average = Math.round(total / data.length);
  const max = Math.max(...data.map(item => item.transactions));
  const maxDay = data.find(item => item.transactions === max)?.day || '';
  
  return {
    totalTransactions: total,
    averageTransactions: average,
    maxTransactions: max,
    maxDay: maxDay,
    projectedTransactions: Math.round(total * 1.08)
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatShortCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `₱${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `₱${(amount / 1000).toFixed(0)}K`;
  }
  return `₱${amount}`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <div key={`tooltip-${String(index)}`} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 capitalize">{entry.dataKey}</span>
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

interface TransactionFilters {
  category: string;
  status: string;
}

interface TransactionAnalyticsProps {
  filters: {
    status: string;
    category: string;
  };
  onFiltersChange: (filters: TransactionFilters) => void;
  isLoading: boolean;
  transactions: {
    date: string;
    amount: number;
    status: string;
    category: string;
  }[];
}

const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({ filters, onFiltersChange, isLoading, transactions }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  
  // Get data and metrics
  const transactionData = useMemo(
    () => buildTransactionData(transactions, activeTimeframe, filters),
    [transactions, activeTimeframe, filters]
  );
  const metrics = useMemo(() => calculateChartMetrics(transactionData), [transactionData]);

  // Transform data for recharts
  const chartData = transactionData.map((item) => ({
    day: item.day,
    transactions: item.transactions
  }));

  return (
    <>
      <style>{`
        @keyframes slide-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out;
        }
      `}</style>
      <div className="relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-slide-in-up">
      {/* Background Elements */}
      <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
              <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V7a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2"
                />
              </svg>
            </div>
                <div className="absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Transaction Analytics
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Performance Metrics</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                  <span className="text-sm font-bold text-heritage-green">October 2024</span>
                </div>
              </div>
            </div>
            
            {/* Toggle Buttons */}
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
                  Monthly
                </button>
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'yearly' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('yearly')}
                >
                  Yearly
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
                margin={{ top: 20, right: 40, left: 10, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A33D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ABAD8A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                
                <RXAxis 
                  dataKey="day" 
                  tick={{ fill: '#82A33D', fontSize: 11 }}
                  axisLine={{ stroke: '#82A33D', strokeWidth: 1 }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  height={40}
                  padding={{ left: 20, right: 20 }}
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
                  dataKey="transactions" 
                  stroke="#82A33D" 
                  fillOpacity={1}
                  fill="url(#colorTransactions)" 
                  strokeWidth={3}
                  connectNulls={true}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#ABAD8A',
                    strokeWidth: 2,
                    fill: 'white'
                  }}
                />
              </RAreaChart>
            </RResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center pb-2 mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-heritage-green rounded"></div>
              <span>Daily Transactions</span>
            </div>
          </div>
        </div>
        
        {/* Stats and Insights Section */}
        <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Total Volume</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.totalTransactions || 98016)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>12.5%</span>
            </div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Average</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.averageTransactions || 14002)}
            </div>
            <div className="text-xs text-gray-500">Per Week</div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Highest Day</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.maxTransactions || 25000)}
            </div>
            <div className="text-xs text-gray-500">{metrics?.maxDay || "Friday"}</div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Projected</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.projectedTransactions || 105857)}
            </div>
            <div className="text-xs text-gray-500">Next week</div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TransactionAnalytics;
