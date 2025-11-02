import React from 'react';

interface OverviewCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  monthlyTarget: number;
  isLoading?: boolean;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  monthlyTarget,
  isLoading = false
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const achievementPercentage = (netProfit / monthlyTarget) * 100;
  const profitMargin = ((netProfit / totalRevenue) * 100);
  const isPositiveGrowth = netProfit > monthlyTarget * 0.8;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="overflow-hidden relative p-6 rounded-2xl border shadow-lg backdrop-blur-xl bg-white/95 border-white/50 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl"></div>
            <div className="flex relative justify-between items-start">
              <div className="flex-1 mr-4">
                <div className="flex items-center mb-2">
                  <div className="w-1 h-4 mr-2 rounded-full bg-gray-300"></div>
                  <div className="h-4 w-28 bg-gray-300 rounded"></div>
                </div>
                <div className="h-9 w-36 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Revenue Card */}
        <div className="overflow-hidden relative p-6 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-500 bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="flex relative justify-between items-start">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Total Revenue</p>
              </div>
              
              <p className="mb-2 text-3xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                {formatCurrency(totalRevenue)}
              </p>
              
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +12.3% from last month
              </div>
            </div>
            
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="overflow-hidden relative p-6 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-500 bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="flex relative justify-between items-start">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Net Profit</p>
              </div>
              
              <p className="mb-2 text-3xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                {formatCurrency(netProfit)}
              </p>
              
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +8.7% growth
              </div>
            </div>
            
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="overflow-hidden relative p-6 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-500 bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="flex relative justify-between items-start">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Total Expenses</p>
              </div>
              
              <p className="mb-2 text-3xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                {formatCurrency(totalExpenses)}
              </p>
              
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200/50">
                <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
                </svg>
                +5.2% increase
              </div>
            </div>
            
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="overflow-hidden relative p-6 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-500 bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          <div className="flex relative justify-between items-start">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-2">
                <div className="w-1 h-4 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">Profit Margin</p>
              </div>
              
              <p className="mb-2 text-3xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                {profitMargin.toFixed(1)}%
              </p>
              
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +2.1% improvement
              </div>
            </div>
            
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
    </div>
  );
};
