import React, { useState, useMemo } from 'react';
import type { Expense } from './types';
import { TrendingUp, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  calculateChartMetrics,
  type DataPoint,
} from '../dashboard/chartsLogic/revenueAnalyticsLogic';



// PHP currency helpers for this view
const phpFormatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);

const phpFormatShortCurrency = (amount: number) => {
  if (!Number.isFinite(amount)) return '₱0';
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `₱${(amount / 1_000).toFixed(1)}K`;
  return phpFormatCurrency(amount);
};

// Tooltip payload shape
interface TooltipPayload {
  dataKey: string;
  value: number;
  color?: string;
}

// Custom tooltip component with proper typing
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${String(index)}`} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 capitalize">{entry.dataKey}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {phpFormatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Recharts aliases to avoid JSX typing conflicts
const RResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<Record<string, unknown>>;
const RAreaChart = AreaChart as unknown as React.ComponentType<Record<string, unknown>>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<Record<string, unknown>>;
const RTooltip = Tooltip as unknown as React.ComponentType<Record<string, unknown>>;
const RArea = Area as unknown as React.ComponentType<Record<string, unknown>>;

interface ExpenseAnalyticsProps {
  expenses?: Expense[];
  staffFromPayroll?: number;
}

const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({ expenses, staffFromPayroll }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'month' | 'year'>('month');
  
  // Normalize and filter expenses: only approved and paid
  const filteredExpenses = useMemo(() => {
    const list = expenses ?? [];
    return list.filter((e) => e && (e.status === 'approved' || e.status === 'paid'));
  }, [expenses]);

  // Build data points from real expenses
  // Month view: current month split into weeks 1–4, plus week 5 if there are days 29–31 with expenses
  // Year view: current year split into months Jan–Dec
  const revenueData = useMemo<DataPoint[]>(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based

    if (!filteredExpenses.length) {
      return [];
    }

    if (activeTimeframe === 'month') {
      const weekTotals = [0, 0, 0, 0, 0];
      let hasWeek5 = false;

      filteredExpenses.forEach((e) => {
        if (!e.date) return;
        const d = new Date(e.date);
        if (Number.isNaN(d.getTime())) return;
        if (d.getFullYear() !== currentYear || d.getMonth() !== currentMonth) return;

        const dayOfMonth = d.getDate();
        let weekIndex = 0;
        if (dayOfMonth <= 7) weekIndex = 0;
        else if (dayOfMonth <= 14) weekIndex = 1;
        else if (dayOfMonth <= 21) weekIndex = 2;
        else if (dayOfMonth <= 28) weekIndex = 3;
        else {
          weekIndex = 4;
          hasWeek5 = true;
        }

        weekTotals[weekIndex] += typeof e.amount === 'number' ? e.amount : 0;
      });

      const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const points: DataPoint[] = labels.map((label, idx) => ({
        day: label,
        revenue: weekTotals[idx],
        expenses: weekTotals[idx],
        profit: 0,
      }));

      if (hasWeek5 || weekTotals[4] > 0) {
        points.push({
          day: 'Week 5',
          revenue: weekTotals[4],
          expenses: weekTotals[4],
          profit: 0,
        });
      }

      return points;
    }

    // Year view: bucket by month (Jan–Dec) for current year
    const monthTotals = new Array(12).fill(0);

    filteredExpenses.forEach((e) => {
      if (!e.date) return;
      const d = new Date(e.date);
      if (Number.isNaN(d.getTime())) return;
      if (d.getFullYear() !== currentYear) return;
      const m = d.getMonth();
      monthTotals[m] += typeof e.amount === 'number' ? e.amount : 0;
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return monthLabels.map((label, idx) => ({
      day: label,
      revenue: monthTotals[idx],
      expenses: monthTotals[idx],
      profit: 0,
    }));
  }, [activeTimeframe, filteredExpenses]);

  const metrics = useMemo(() => calculateChartMetrics(revenueData.length ? revenueData : [{ day: '', revenue: 0, expenses: 0, profit: 0 }]), [revenueData]);

  const currentMonthLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, []);

  // Transform data for recharts
  const chartData = revenueData.map((item: any) => ({
    day: item.day,
    revenue: item.revenue
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
                  <svg className="w-6 h-6 text-[#82A33D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8V6a2 2 0 00-2-2h-3a2 2 0 00-2 2v2H10V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M8 16h6" />
                  </svg>
                </div>
                <div className="absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Expense Analytics
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Performance Metrics</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                  <span className="text-sm font-bold text-heritage-green">{currentMonthLabel}</span>
                </div>
              </div>
            </div>
            
            {/* Toggle Buttons */}
            <div className="flex space-x-4">
              <div className="flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl shadow-inner backdrop-blur-sm border border-heritage-light/30">
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'month' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('month')}
                >
                  Month
                </button>
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'year' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('year')}
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
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={phpFormatShortCurrency}
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
                  fill="url(#colorRevenue)" 
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
              <span>
                {activeTimeframe === 'month' ? 'Weekly Expenses (Current Month)' : 'Monthly Expenses (Current Year)'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats and Insights Section */}
        <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
                <div className="text-sm font-medium text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold text-heritage-green">
              {phpFormatCurrency(metrics?.totalRevenue ?? 0)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>{(metrics?.growthRate ?? 0).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Average</div>
            <div className="text-2xl font-bold text-heritage-green">
              {phpFormatCurrency(metrics?.averageRevenue ?? 0)}
            </div>
            <div className="text-xs text-gray-500">Per day</div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Highest Day</div>
            <div className="text-2xl font-bold text-heritage-green">
              {phpFormatCurrency(metrics?.maxRevenue ?? 0)}
            </div>
            <div className="text-xs text-gray-500">{metrics?.maxDay ?? ''}</div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Projected</div>
            <div className="text-2xl font-bold text-heritage-green">
              {phpFormatCurrency(metrics?.projectedRevenue ?? 0)}
            </div>
            <div className="text-xs text-gray-500">Next week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
