import React from 'react';

interface DepartmentProfit {
  department: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  status: 'excellent' | 'good' | 'poor' | 'critical';
}

interface RecentTransactionsProps {
  departmentProfits: DepartmentProfit[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ departmentProfits }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return '✓';
      case 'good':
        return '↗';
      case 'poor':
        return '⚠';
      case 'critical':
        return '⨯';
      default:
        return '•';
    }
  };

  const getTrendArrow = (margin: number) => {
    return margin >= 0 ? '↗' : '↘';
  };

  return (
    <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Department Performance
              </h3>
              <p className="text-xs font-semibold text-gray-600">Financial overview by department</p>
            </div>
          </div>
        </div>
      
        {/* Department List */}
        <div className="space-y-3">
          {departmentProfits.map((dept, index) => (
            <div 
              key={index} 
              className="group relative p-4 bg-white/80 border border-heritage-light/30 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in hover:bg-white/90"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 ${
                      dept.status === 'excellent' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                      dept.status === 'good' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                      dept.status === 'poor' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      'bg-gradient-to-br from-red-400 to-red-600'
                    }`}>
                      {dept.status === 'excellent' && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {dept.status === 'good' && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      )}
                      {dept.status === 'poor' && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {dept.status === 'critical' && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">{dept.department}</p>
                    <p className="text-xs font-medium text-gray-600">{formatCurrency(dept.revenue)} revenue</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-black mb-1 ${dept.profit >= 0 ? 'text-heritage-green' : 'text-red-600'}`}>
                    {formatCurrency(dept.profit)}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
                      dept.margin >= 20 ? 'bg-emerald-100 text-emerald-700' :
                      dept.margin >= 0 ? 'bg-blue-100 text-blue-700' :
                      dept.margin >= -20 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {dept.margin >= 0 && (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      )}
                      {dept.margin < 0 && (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {Math.abs(dept.margin).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
