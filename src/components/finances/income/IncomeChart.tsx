import { useState, useEffect } from 'react';

interface MonthlyData {
  month: string;
  income: number;
}

export const IncomeChart = () => {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [viewType, setViewType] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [yearComparison, setYearComparison] = useState<'current' | 'previous'>('current');

  useEffect(() => {
    // TODO: Fetch from Firestore
    // For now, using dummy data
    setChartData([
      { month: 'Jan', income: 165000 },
      { month: 'Feb', income: 180000 },
      { month: 'Mar', income: 175000 },
      { month: 'Apr', income: 190000 },
      { month: 'May', income: 185000 },
      { month: 'Jun', income: 200000 },
      { month: 'Jul', income: 195000 },
      { month: 'Aug', income: 210000 },
      { month: 'Sep', income: 205000 },
      { month: 'Oct', income: 220000 },
      { month: 'Nov', income: 215000 },
      { month: 'Dec', income: 230000 },
    ]);
  }, [viewType, yearComparison]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...chartData.map(item => item.income));

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-full flex flex-col">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#82A33D]">Revenue Overview</h3>
          <p className="text-sm text-gray-500">Monthly income trends and analysis</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* View Type Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  viewType === type
                    ? 'bg-[#82A33D] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          {/* Year Comparison Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['current', 'previous'] as const).map((year) => (
              <button
                key={year}
                onClick={() => setYearComparison(year)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  yearComparison === year
                    ? 'bg-[#82A33D] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {year} Year
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-end justify-between gap-1 px-3 py-4 bg-gradient-to-t from-gray-50 to-white rounded-xl border border-gray-100 mb-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-end h-48">
              <div 
                className="bg-gradient-to-t from-[#82A33D] to-[#9bb347] rounded-t-lg w-4 transition-all duration-500 hover:opacity-80 relative group shadow-sm"
                style={{ height: `${(item.income / maxValue) * 100}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {formatCurrency(item.income)}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">{item.month}</span>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center py-2 px-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Total Revenue</p>
          <p className="text-base font-bold text-[#82A33D]">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.income, 0))}
          </p>
        </div>
        <div className="text-center py-2 px-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Average Monthly</p>
          <p className="text-base font-bold text-blue-600">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.income, 0) / chartData.length || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
