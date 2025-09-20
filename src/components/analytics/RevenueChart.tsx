import { useState } from 'react';

// Mock data for the chart - in a real app, this would come from your analytics service
const generateMockData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic revenue data with some variation
    const baseRevenue = 15000 + Math.random() * 10000;
    const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1;
    const revenue = Math.round(baseRevenue * weekendMultiplier);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue,
      bookings: Math.floor(revenue / 3500) + Math.floor(Math.random() * 3),
    });
  }
  
  return data;
};

export const RevenueChart = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [metric, setMetric] = useState('revenue');
  
  const data = generateMockData();
  const maxValue = Math.max(...data.map(d => metric === 'revenue' ? d.revenue : d.bookings));
  const minValue = Math.min(...data.map(d => metric === 'revenue' ? d.revenue : d.bookings));
  
  // Calculate trend
  const firstWeek = data.slice(0, 7).reduce((sum, d) => sum + (metric === 'revenue' ? d.revenue : d.bookings), 0);
  const lastWeek = data.slice(-7).reduce((sum, d) => sum + (metric === 'revenue' ? d.revenue : d.bookings), 0);
  const trend = ((lastWeek - firstWeek) / firstWeek) * 100;
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              metric === 'revenue'
                ? 'bg-heritage-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setMetric('bookings')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              metric === 'bookings'
                ? 'bg-heritage-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bookings
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
          </span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-heritage-green"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 bg-gray-50 rounded-lg p-4">
        <div className="flex items-end justify-between h-full space-x-1">
          {data.map((point, index) => {
            const value = metric === 'revenue' ? point.revenue : point.bookings;
            const height = ((value - minValue) / (maxValue - minValue)) * 100;
            const isWeekend = new Date(point.date).getDay() === 0 || new Date(point.date).getDay() === 6;
            
            return (
              <div
                key={point.date}
                className="flex-1 flex flex-col items-center group relative"
              >
                {/* Bar */}
                <div
                  className={`w-full rounded-t-sm transition-all duration-200 group-hover:opacity-80 ${
                    isWeekend ? 'bg-heritage-green' : 'bg-blue-500'
                  }`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                ></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    <div className="font-medium">
                      {new Date(point.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div>
                      {metric === 'revenue' 
                        ? `₱${point.revenue.toLocaleString()}`
                        : `${point.bookings} bookings`
                      }
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1"></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
          <span>
            {metric === 'revenue' 
              ? `₱${Math.round(maxValue / 1000)}k`
              : maxValue
            }
          </span>
          <span>
            {metric === 'revenue' 
              ? `₱${Math.round((maxValue + minValue) / 2000)}k`
              : Math.round((maxValue + minValue) / 2)
            }
          </span>
          <span>
            {metric === 'revenue' 
              ? `₱${Math.round(minValue / 1000)}k`
              : minValue
            }
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Weekdays</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-heritage-green rounded"></div>
          <span className="text-gray-600">Weekends</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {metric === 'revenue' 
              ? `₱${data.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}`
              : data.reduce((sum, d) => sum + d.bookings, 0).toLocaleString()
            }
          </div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {metric === 'revenue' 
              ? `₱${Math.round(data.reduce((sum, d) => sum + d.revenue, 0) / data.length).toLocaleString()}`
              : Math.round(data.reduce((sum, d) => sum + d.bookings, 0) / data.length).toLocaleString()
            }
          </div>
          <div className="text-sm text-gray-500">Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {metric === 'revenue' 
              ? `₱${Math.max(...data.map(d => d.revenue)).toLocaleString()}`
              : Math.max(...data.map(d => d.bookings)).toLocaleString()
            }
          </div>
          <div className="text-sm text-gray-500">Peak</div>
        </div>
      </div>
    </div>
  );
};
