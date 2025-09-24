import { useState, useEffect } from 'react';

interface StatsData {
  totalIncome: number;
  avgDailyIncome: number;
  growthPercentage: number;
  bestPerformingSource: string;
}

export const IncomeStats = () => {
  const [statsData, setStatsData] = useState<StatsData>({
    totalIncome: 0,
    avgDailyIncome: 0,
    growthPercentage: 0,
    bestPerformingSource: '',
  });

  useEffect(() => {
    // TODO: Fetch from Firestore
    // For now, using dummy data
    setStatsData({
      totalIncome: 240000,
      avgDailyIncome: 8000,
      growthPercentage: 12.5,
      bestPerformingSource: 'Rooms',
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{value}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income This Month */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Income</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#82A33D]">{formatCurrency(statsData.totalIncome)}</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>
      </div>

      {/* Average Daily Income */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Daily Income</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#82A33D]">{formatCurrency(statsData.avgDailyIncome)}</p>
          <p className="text-xs text-gray-500">Per day average</p>
        </div>
      </div>

      {/* Growth Percentage */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Growth Rate</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#82A33D]">{Math.abs(statsData.growthPercentage)}%</span>
            {formatPercentage(statsData.growthPercentage)}
          </div>
          <p className="text-xs text-gray-500">vs last month</p>
        </div>
      </div>

      {/* Best Performing Source */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top Source</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#82A33D]">{statsData.bestPerformingSource}</p>
          <p className="text-xs text-gray-500">Best performer</p>
        </div>
      </div>
    </div>
  );
};
