import React, { useState } from 'react';

interface RevenueData {
  id: string;
  source: 'rooms' | 'food_beverage' | 'spa_services' | 'events' | 'other';
  amount: number;
  date: string;
  description: string;
  percentage: number;
}

const RevenueDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedSource, setSelectedSource] = useState('all');

  // Sample revenue data
  const revenueData: RevenueData[] = [
    {
      id: '1',
      source: 'rooms',
      amount: 45800,
      date: '2024-10-08',
      description: 'Room bookings and accommodations',
      percentage: 62.5
    },
    {
      id: '2',
      source: 'food_beverage',
      amount: 18600,
      date: '2024-10-08',
      description: 'Restaurant, room service, and bar sales',
      percentage: 25.4
    },
    {
      id: '3',
      source: 'spa_services',
      amount: 6200,
      date: '2024-10-08',
      description: 'Spa treatments and wellness services',
      percentage: 8.5
    },
    {
      id: '4',
      source: 'events',
      amount: 2100,
      date: '2024-10-08',
      description: 'Conference rooms and event hosting',
      percentage: 2.9
    },
    {
      id: '5',
      source: 'other',
      amount: 580,
      date: '2024-10-08',
      description: 'Laundry, parking, and miscellaneous',
      percentage: 0.7
    }
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'rooms':
        return '🏨';
      case 'food_beverage':
        return '🍽️';
      case 'spa_services':
        return '💆';
      case 'events':
        return '🎪';
      case 'other':
        return '📦';
      default:
        return '💰';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'rooms':
        return 'from-blue-500 to-blue-600';
      case 'food_beverage':
        return 'from-orange-500 to-orange-600';
      case 'spa_services':
        return 'from-purple-500 to-purple-600';
      case 'events':
        return 'from-pink-500 to-pink-600';
      case 'other':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  const getSourceName = (source: string) => {
    switch (source) {
      case 'rooms':
        return 'Room Revenue';
      case 'food_beverage':
        return 'Food & Beverage';
      case 'spa_services':
        return 'Spa Services';
      case 'events':
        return 'Events & Conferences';
      case 'other':
        return 'Other Services';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <p className="text-sm text-gray-600">Track revenue streams and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
            >
              <option value="all">All Sources</option>
              <option value="rooms">Rooms</option>
              <option value="food_beverage">Food & Beverage</option>
              <option value="spa_services">Spa Services</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-[#82A33D] to-[#6d8735] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+12.5% vs last period</span>
                </div>
              </div>
              <div className="text-4xl opacity-70">💰</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Daily</p>
              <p className="text-2xl font-bold text-gray-900">${(totalRevenue / 30).toFixed(0)}</p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">+12.5%</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Top Source</p>
              <p className="text-lg font-bold text-gray-900">Rooms</p>
            </div>
            <div className="text-2xl">🏨</div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Revenue by Source</h4>
          <div className="space-y-4">
            {revenueData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getSourceIcon(item.source)}</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{getSourceName(item.source)}</h5>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${item.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Revenue Chart (Simplified) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Revenue Distribution</h4>
          <div className="space-y-4">
            {revenueData.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{getSourceName(item.source)}</span>
                  <span className="text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${getSourceColor(item.source)} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-bold text-gray-900">Revenue Trends</h4>
            <p className="text-sm text-gray-600">Historical performance and forecasting</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors">
            View Detailed Analytics
          </button>
        </div>

        {/* Simplified trend indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-lg font-bold text-green-600">+15.2%</p>
            <p className="text-sm text-gray-600">vs Last Month</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-lg font-bold text-blue-600">95.3%</p>
            <p className="text-sm text-gray-600">Target Achievement</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl mb-2">🔮</div>
            <p className="text-lg font-bold text-purple-600">$78.2K</p>
            <p className="text-sm text-gray-600">Next Month Forecast</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;