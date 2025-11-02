import React from 'react';

interface DepartmentProfit {
  department: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  status: 'excellent' | 'good' | 'poor' | 'critical';
}

interface DepartmentCardsProps {
  departmentProfits: DepartmentProfit[];
  isLoading?: boolean;
}

export const DepartmentCards: React.FC<DepartmentCardsProps> = ({ departmentProfits, isLoading = false }) => {
  return (
    <div className="lg:col-span-2 relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-heritage-light/10 to-heritage-green/5 rounded-3xl opacity-50"></div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          {isLoading ? (
            <>
              <div className="w-12 h-12 bg-gray-300 rounded-2xl animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-6 w-56 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-heritage-green via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green/20 to-emerald-600/20 rounded-2xl blur-lg opacity-60"></div>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Department Performance</h3>
                <p className="text-sm font-semibold text-gray-600">Revenue and profitability overview</p>
              </div>
            </>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            // Skeleton Loader
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative overflow-hidden bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/60 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      <div className="h-3 w-20 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    </div>
                    <div className="pt-3 border-t border-gray-200/60">
                      <div className="flex justify-between">
                        <div className="h-3 w-14 bg-gray-200 rounded"></div>
                        <div className="h-5 w-16 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            departmentProfits.map((dept, index) => (
            <div 
              key={dept.department} 
              className="group relative overflow-hidden bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/60 hover:border-heritage-green/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/0 to-heritage-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              <div className="relative z-10">
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform duration-300 ${
                      dept.department === 'Rooms' ? 'bg-gradient-to-br from-teal-400 to-teal-600' :
                      dept.department === 'Food & Beverage' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      dept.department === 'Events' ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 
                      'bg-gradient-to-br from-red-400 to-red-600'
                    }`}>
                      {dept.department === 'Rooms' ? '🏨' :
                       dept.department === 'Food & Beverage' ? '🍽️' :
                       dept.department === 'Events' ? '🎉' : '⚡'}
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm group-hover:text-heritage-green transition-colors">{dept.department}</p>
                      <p className="text-xs text-gray-500 font-medium">Department</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                    dept.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                    dept.status === 'good' ? 'bg-blue-100 text-blue-700' :
                    dept.status === 'poor' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {dept.status.toUpperCase()}
                  </span>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Revenue</span>
                    <span className="text-base font-bold text-gray-900">${dept.revenue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Profit</span>
                    <span className={`text-base font-black ${dept.profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {dept.profit > 0 ? '+' : ''}${dept.profit.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200/60">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Margin</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${dept.margin > 0 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                        <span className={`text-xl font-black ${dept.margin > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {dept.margin > 0 ? '+' : ''}{dept.margin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
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
