import React from 'react';

interface CostBreakdownProps {
  isLoading?: boolean;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ isLoading = false }) => {
  const costs = [
    { 
      label: 'Staff Costs', 
      percentage: 45, 
      gradient: 'from-red-500 to-red-600',
      dotColor: 'bg-red-500',
      textColor: 'text-red-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      label: 'Utilities', 
      percentage: 25, 
      gradient: 'from-orange-500 to-orange-600',
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: 'F&B Costs', 
      percentage: 20, 
      gradient: 'from-purple-500 to-purple-600',
      dotColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      label: 'Marketing', 
      percentage: 10, 
      gradient: 'from-emerald-500 to-emerald-600',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-heritage-light/10 to-blue-500/5 rounded-3xl opacity-50"></div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          {isLoading ? (
            <>
              <div className="w-12 h-12 bg-gray-300 rounded-2xl animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 rounded-2xl blur-lg opacity-60"></div>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Cost Breakdown</h3>
                <p className="text-sm font-semibold text-gray-600">Expense distribution</p>
              </div>
            </>
          )}
        </div>

        {/* Cost Items */}
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton Loader
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative overflow-hidden bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/60 animate-pulse">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-xl"></div>
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="h-5 w-12 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gray-300 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            costs.map((cost, index) => (
            <div 
              key={cost.label} 
              className="group relative overflow-hidden bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/60 hover:border-heritage-green/40 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/0 to-heritage-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              <div className="relative z-10">
                {/* Label and Percentage */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${cost.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {cost.icon}
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm group-hover:text-heritage-green transition-colors">{cost.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${cost.dotColor} animate-pulse`}></div>
                    <span className={`font-black ${cost.textColor} text-xl`}>{cost.percentage}%</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative w-full bg-gray-200 rounded-full h-2.5 shadow-inner overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${cost.gradient} h-2.5 rounded-full relative overflow-hidden transition-all duration-1000 shadow-sm`}
                    style={{ width: `${cost.percentage}%` }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
