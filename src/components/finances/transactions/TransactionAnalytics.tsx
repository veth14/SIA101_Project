import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

// Sample transaction data for the chart
const getTransactionData = (timeframe: 'weekly' | 'monthly' | 'yearly') => {
  const weeklyData = [
    { day: 'Monday', transactions: 15254 },
    { day: 'Tuesday', transactions: 8254 },
    { day: 'Wednesday', transactions: 18254 },
    { day: 'Thursday', transactions: 3254 },
    { day: 'Friday', transactions: 25000 },
    { day: 'Saturday', transactions: 12000 },
    { day: 'Sunday', transactions: 16000 }
  ];

  const monthlyData = [
    { day: 'Week 1', transactions: 85000 },
    { day: 'Week 2', transactions: 92000 },
    { day: 'Week 3', transactions: 78000 },
    { day: 'Week 4', transactions: 95000 }
  ];

  const yearlyData = [
    { day: 'Q1', transactions: 250000 },
    { day: 'Q2', transactions: 280000 },
    { day: 'Q3', transactions: 320000 },
    { day: 'Q4', transactions: 290000 }
  ];

  switch (timeframe) {
    case 'monthly': return monthlyData;
    case 'yearly': return yearlyData;
    default: return weeklyData;
  }
};

const calculateChartMetrics = (data: any[]) => {
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
const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any[], label: string }) => {
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
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface TransactionAnalyticsProps {
  filters: {
    status: string;
    category: string;
  };
  onFiltersChange: (filters: any) => void;
}

const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({ filters, onFiltersChange }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [isLoading, setIsLoading] = useState(true);
  
  // Get data and metrics
  const transactionData = useMemo(() => getTransactionData(activeTimeframe), [activeTimeframe]);
  const metrics = useMemo(() => calculateChartMetrics(transactionData), [transactionData]);

  // Initial loading only
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Transform data for recharts
  const chartData = transactionData.map((item) => ({
    day: item.day,
    transactions: item.transactions
  }));

  if (isLoading) {
    return (
      <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60"></div>
        
        <div className="relative z-10">
          {/* Header Skeleton */}
          <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="w-1 h-1 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl">
                  <Skeleton className="h-10 w-20 rounded-xl mr-2" />
                  <Skeleton className="h-10 w-20 rounded-xl mr-2" />
                  <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="px-8 py-4 bg-gradient-to-r from-heritage-light/20 to-heritage-light/30 border-b border-gray-200/30">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
          </div>
          
          {/* Chart Skeleton */}
          <div className="px-4 py-6">
            <div className="h-[320px] w-full">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
            <div className="flex items-center justify-center mt-2 pb-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
      <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-slide-in-up">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="flex items-center justify-center w-12 h-12 shadow-2xl bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral rounded-2xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Transaction Analytics
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Performance Metrics</p>
                  <div className="w-1 h-1 bg-heritage-green rounded-full"></div>
                  <span className="text-sm font-bold text-heritage-green">October 2024</span>
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
        
        {/* Filters Section */}
        <div className="px-8 py-4 bg-gradient-to-r from-heritage-light/20 to-heritage-light/30 border-b border-gray-200/30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-600">Filters:</span>
            <select 
              value={filters.status}
              onChange={(e) => onFiltersChange({...filters, status: e.target.value})}
              className="px-4 py-2 text-sm font-bold rounded-xl bg-white/80 text-heritage-green border border-heritage-neutral/30 outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select 
              value={filters.category}
              onChange={(e) => onFiltersChange({...filters, category: e.target.value})}
              className="px-4 py-2 text-sm font-bold rounded-xl bg-white/80 text-heritage-green border border-heritage-neutral/30 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="booking">Booking</option>
              <option value="service">Service</option>
              <option value="food">Food & Beverage</option>
              <option value="event">Events</option>
            </select>
          </div>
        </div>
        
        {/* Chart Area */}
        <div className="px-4 py-6">
          <div className="h-[320px] w-full">
            {/* @ts-ignore */}
            <ResponsiveContainer width="100%" height="100%">
              {/* @ts-ignore */}
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 40, left: 10, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A33D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ABAD8A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                {/* @ts-ignore */}
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#82A33D', fontSize: 11 }}
                  axisLine={{ stroke: '#82A33D', strokeWidth: 1 }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  height={40}
                  padding={{ left: 20, right: 20 }}
                />
                {/* @ts-ignore */}
                <YAxis 
                  tickFormatter={formatShortCurrency}
                  tick={{ fill: '#82A33D', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                {/* @ts-ignore */}
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#ABAD8A" 
                />
                {/* @ts-ignore */}
                <Tooltip content={<CustomTooltip />} />
                {/* @ts-ignore */}
                <Area 
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center mt-2 pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-heritage-green rounded"></div>
              <span>Daily Transactions</span>
            </div>
          </div>
        </div>
        
        {/* Stats and Insights Section */}
        <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Total Volume</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.totalTransactions || 98016)}
            </div>
            <div className="flex gap-1 items-center mt-1 text-xs font-medium text-emerald-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>12.5%</span>
            </div>
          </div>
          
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Average</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.averageTransactions || 14002)}
            </div>
            <div className="text-xs text-gray-500">Per day</div>
          </div>
          
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Highest Day</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics?.maxTransactions || 25000)}
            </div>
            <div className="text-xs text-gray-500">{metrics?.maxDay || "Friday"}</div>
          </div>
          
          <div className="p-4 bg-white/80 border rounded-xl shadow-sm border-heritage-light">
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
