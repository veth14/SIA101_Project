import React from 'react';

interface DepartmentProfit {
  department: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  status: 'excellent' | 'good' | 'poor' | 'critical';
}

interface TopSalesProductProps {
  departmentProfits: DepartmentProfit[];
}

export const TopSalesProduct: React.FC<TopSalesProductProps> = ({ departmentProfits }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral rounded-xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Top Performers
              </h3>
              <p className="text-xs font-semibold text-gray-600">Best performing departments</p>
            </div>
          </div>
        </div>
        
        {/* Performance List */}
        <div className="space-y-3">
          {departmentProfits.slice(0, 4).map((dept, index) => (
            <div 
              key={index} 
              className="group relative p-4 bg-white/80 border border-heritage-light/30 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md transition-all duration-300 group-hover:scale-105 ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                    index === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 
                    'bg-gradient-to-br from-heritage-green to-heritage-neutral'
                  }`}>
                    {index === 0 && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                    {index !== 0 && <span>{index + 1}</span>}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">{dept.department}</p>
                    <p className="text-xs font-medium text-gray-600">{formatCurrency(dept.revenue)} revenue</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-black mb-1 ${dept.margin >= 0 ? 'text-heritage-green' : 'text-red-600'}`}>
                    {dept.margin.toFixed(1)}%
                  </p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
                    dept.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                    dept.status === 'good' ? 'bg-blue-100 text-blue-700' :
                    dept.status === 'poor' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {dept.status.toUpperCase()}
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
