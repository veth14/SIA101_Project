import { useState, useEffect } from 'react';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export const EarningsChart = () => {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    // TODO: Fetch from Firestore
    // For now, using dummy data
    setChartData([
      { month: 'Jan', income: 165000, expenses: 45000 },
      { month: 'Feb', income: 180000, expenses: 52000 },
      { month: 'Mar', income: 175000, expenses: 48000 },
      { month: 'Apr', income: 190000, expenses: 55000 },
      { month: 'May', income: 185000, expenses: 50000 },
      { month: 'Jun', income: 200000, expenses: 58000 },
      { month: 'Jul', income: 195000, expenses: 53000 },
      { month: 'Aug', income: 210000, expenses: 60000 },
      { month: 'Sep', income: 205000, expenses: 57000 },
      { month: 'Oct', income: 220000, expenses: 62000 },
      { month: 'Nov', income: 215000, expenses: 59000 },
      { month: 'Dec', income: 230000, expenses: 65000 },
    ]);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...chartData.flatMap(item => [item.income, item.expenses]));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Earnings Overview</h3>
          <p className="text-sm text-gray-500">Monthly income vs expenses comparison</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#82A33D] rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ABAD8A] rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      {/* Custom Bar Chart */}
      <div className="h-64 flex items-end justify-between gap-1 px-4 py-4 bg-gradient-to-t from-gray-50 to-white rounded-xl border border-gray-100">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            {/* Bars Container */}
            <div className="flex items-end gap-0.5 h-48">
              {/* Income Bar */}
              <div 
                className="bg-gradient-to-t from-[#82A33D] to-[#9bb347] rounded-t-lg w-4 transition-all duration-500 hover:opacity-80 relative group shadow-sm"
                style={{ height: `${(item.income / maxValue) * 100}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Income: {formatCurrency(item.income)}
                </div>
              </div>
              
              {/* Expenses Bar */}
              <div 
                className="bg-gradient-to-t from-[#ABAD8A] to-[#c4c19a] rounded-t-lg w-4 transition-all duration-500 hover:opacity-80 relative group shadow-sm"
                style={{ height: `${(item.expenses / maxValue) * 100}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Expenses: {formatCurrency(item.expenses)}
                </div>
              </div>
            </div>
            
            {/* Month Label */}
            <span className="text-xs text-gray-600 font-medium">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Avg Monthly Income</p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.income, 0) / chartData.length || 0)}
          </p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Avg Monthly Expenses</p>
          <p className="text-lg font-bold text-orange-600">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.expenses, 0) / chartData.length || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
