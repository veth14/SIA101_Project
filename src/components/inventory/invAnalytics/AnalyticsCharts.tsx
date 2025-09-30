import React from 'react';

interface ChartData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

const categoryData: ChartData[] = [
  { category: 'Linens & Textiles', value: 45000, percentage: 35, color: 'bg-heritage-green' },
  { category: 'Food & Beverage', value: 32000, percentage: 25, color: 'bg-blue-500' },
  { category: 'Cleaning Supplies', value: 28000, percentage: 22, color: 'bg-purple-500' },
  { category: 'Maintenance', value: 15000, percentage: 12, color: 'bg-orange-500' },
  { category: 'Office Supplies', value: 8000, percentage: 6, color: 'bg-gray-500' }
];

const monthlyTrends = [
  { month: 'Jan', consumption: 45000, procurement: 52000, variance: 7000 },
  { month: 'Feb', consumption: 52000, procurement: 48000, variance: -4000 },
  { month: 'Mar', consumption: 48000, procurement: 61000, variance: 13000 },
  { month: 'Apr', consumption: 61000, procurement: 55000, variance: -6000 },
  { month: 'May', consumption: 55000, procurement: 58000, variance: 3000 },
  { month: 'Jun', consumption: 58000, procurement: 62000, variance: 4000 }
];

export const AnalyticsCharts: React.FC = () => {
  const maxValue = Math.max(...monthlyTrends.flatMap(d => [d.consumption, d.procurement]));
  const maxCategoryValue = Math.max(...categoryData.map(d => d.value));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
          <p className="text-sm text-gray-500 mt-1">Inventory value by category</p>
        </div>
        
        <div className="space-y-4">
          {categoryData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">₱{(item.value / 1000).toFixed(0)}k</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`${item.color} h-3 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${(item.value / maxCategoryValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                <span className="text-xs text-gray-600 truncate">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          <p className="text-sm text-gray-500 mt-1">Consumption vs procurement trends</p>
        </div>
        
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-heritage-green rounded-full"></div>
              <span className="text-sm text-gray-600">Consumption</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Procurement</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Variance</span>
            </div>
          </div>

          {/* Chart Bars */}
          <div className="space-y-3">
            {monthlyTrends.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.month}</span>
                  <div className="flex space-x-4">
                    <span className="text-heritage-green">₱{(item.consumption / 1000).toFixed(0)}k</span>
                    <span className="text-blue-500">₱{(item.procurement / 1000).toFixed(0)}k</span>
                    <span className={`${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variance >= 0 ? '+' : ''}₱{(item.variance / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-heritage-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.consumption / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.procurement / maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
