import React, { useState } from 'react';

interface ChartDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const DashboardCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');

  const chartData: ChartDataPoint[] = [
    { month: 'Jan', revenue: 45000, expenses: 28000, profit: 17000 },
    { month: 'Feb', revenue: 52000, expenses: 31000, profit: 21000 },
    { month: 'Mar', revenue: 48000, expenses: 29000, profit: 19000 },
    { month: 'Apr', revenue: 61000, expenses: 35000, profit: 26000 },
    { month: 'May', revenue: 55000, expenses: 33000, profit: 22000 },
    { month: 'Jun', revenue: 67000, expenses: 38000, profit: 29000 }
  ];

  const maxValue = Math.max(...chartData.flatMap(d => [d.revenue, d.expenses, d.profit]));

  const periods = ['1M', '3M', '6M', '1Y'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trends Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Revenue Trends</h3>
            <p className="text-sm text-gray-600">Monthly revenue vs expenses</p>
          </div>
          <div className="flex gap-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  selectedPeriod === period
                    ? 'bg-[#82A33D] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-8 text-xs font-medium text-gray-600">{data.month}</div>
              
              <div className="flex-1 relative">
                {/* Revenue Bar */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-full bg-gray-100 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="bg-[#82A33D] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(data.revenue / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-16 text-right">
                    ${data.revenue.toLocaleString()}
                  </span>
                </div>
                
                {/* Expenses Bar */}
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-full h-2 relative overflow-hidden">
                    <div
                      className="bg-orange-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(data.expenses / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-16 text-right">
                    ${data.expenses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#82A33D] rounded-full"></div>
            <span className="text-xs font-medium text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      {/* Revenue Sources Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Revenue Sources</h3>
          <p className="text-sm text-gray-600">Breakdown by category</p>
        </div>

        <div className="flex flex-col items-center">
          {/* Simple Donut Chart Representation */}
          <div className="relative w-40 h-40 mb-6">
            <div className="w-full h-full border-8 border-[#82A33D] rounded-full relative">
              <div className="absolute inset-2 border-4 border-emerald-400 rounded-full">
                <div className="absolute inset-2 border-4 border-orange-300 rounded-full">
                  <div className="absolute inset-2 border-4 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600">Total</p>
                      <p className="text-lg font-bold text-[#82A33D]">$245K</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 w-full">
            {[
              { name: 'Room Bookings', value: '$150,000', percentage: '61%', color: 'bg-[#82A33D]' },
              { name: 'Events & Conferences', value: '$45,000', percentage: '18%', color: 'bg-emerald-400' },
              { name: 'Dining Services', value: '$30,000', percentage: '12%', color: 'bg-orange-300' },
              { name: 'Other Services', value: '$20,800', percentage: '9%', color: 'bg-gray-300' }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{source.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{source.value}</p>
                  <p className="text-xs text-gray-500">{source.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;