import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  getRevenueData, 
  calculateChartMetrics, 
  formatCurrency, 
  formatShortCurrency
} from './chartsLogic/revenueAnalyticsLogic';
import { SkeletonChart } from '../../universalLoader/SkeletonLoader';

// Define types for tooltip data
interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

// Custom tooltip component with proper typing
const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: TooltipPayload[], label: string }) => {
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

const RevenueTrends: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [isLoading, setIsLoading] = useState(true);
  
  // Get data and metrics
  const revenueData = useMemo(() => getRevenueData(activeTimeframe), [activeTimeframe]);
  const metrics = useMemo(() => calculateChartMetrics(revenueData), [revenueData]);

  // Initial loading only
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Transform data for recharts
  const chartData = revenueData.map((item) => ({
    day: item.day,
    revenue: item.revenue
  }));

  if (isLoading) {
    return <SkeletonChart />;
  }

  return (
    <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="flex items-center justify-center w-12 h-12 shadow-2xl bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral rounded-2xl transition-all duration-300 group-hover:scale-105">
                  <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Revenue Analytics
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Performance Metrics</p>
                  <div className="w-1 h-1 bg-heritage-green rounded-full"></div>
                  <span className="text-sm font-bold text-heritage-green">October 2025</span>
                </div>
              </div>
            </div>
            
            {/* Toggle Buttons */}
            <div className="flex space-x-4">
              <div className="flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl shadow-inner backdrop-blur-sm border border-heritage-light/30">
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'weekly' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('weekly')}
                >
                  Weekly
                </button>
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
            {/* @ts-expect-error - Recharts types are complex */}
            <ResponsiveContainer width="100%" height="100%">
              {/* @ts-expect-error - Recharts types are complex */}
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A33D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ABAD8A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                {/* @ts-expect-error - Recharts types are complex */}
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#82A33D', fontSize: 12 }}
                  axisLine={{ stroke: '#82A33D', strokeWidth: 1 }}
                  tickLine={false}
                  interval={0}
                  padding={{ left: 0, right: 0 }}
                />
                {/* @ts-expect-error - Recharts types are complex */}
                <YAxis 
                  tickFormatter={formatShortCurrency}
                  tick={{ fill: '#82A33D', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#ABAD8A" 
                />
                {/* @ts-expect-error - Recharts types are complex */}
                <Tooltip content={<CustomTooltip />} />
                {/* @ts-expect-error - Recharts types are complex */}
                <Area 
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center mt-2 pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-heritage-green rounded"></div>
              <span>Daily Revenue</span>
            </div>
          </div>
        </div>
        
        {/* Stats and Insights Section */}
        <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.totalRevenue || 85800)}
            </div>
            <div className="flex gap-1 items-center mt-1 text-xs font-medium text-emerald-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{metrics?.growthRate || 4}%</span>
            </div>
          </div>
          
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Average</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.averageRevenue || 12257)}
            </div>
            <div className="text-xs text-gray-500">Per day</div>
          </div>
          
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Highest Day</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.maxRevenue || 15400)}
            </div>
            <div className="text-xs text-gray-500">{metrics?.maxDay || "Friday"}</div>
          </div>
          
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Projected</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.projectedRevenue || 92500)}
            </div>
            <div className="text-xs text-gray-500">Next week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrends;
