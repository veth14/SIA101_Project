/**
 * RoomStats Component
 * 
 * Premium modern statistics cards with beautiful gradients and animations.
 * Provides an engaging overview of room management statistics.
 */

import React from 'react';

/**
 * Statistics component for Room Management dashboard
 */
const RoomStats: React.FC = () => {
  const statsData = [
    {
      title: 'Total Rooms',
      value: 50,
      icon: '🏨',
      color: 'blue' as const,
      trend: { value: 2, isPositive: true }
    },
    {
      title: 'Available',
      value: 32,
      icon: '✅',
      color: 'green' as const,
      trend: { value: 64, isPositive: true }
    },
    {
      title: 'Occupied',
      value: 18,
      icon: '👥',
      color: 'orange' as const,
      trend: { value: 36, isPositive: true }
    },
    {
      title: 'Maintenance',
      value: 0,
      icon: '🔧',
      color: 'purple' as const,
      trend: { value: 0, isPositive: true }
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'bg-blue-100 text-blue-600',
      accent: 'bg-blue-50 border-blue-200'
    },
    green: {
      bg: 'from-heritage-green to-emerald-600',
      icon: 'bg-green-100 text-green-600',
      accent: 'bg-green-50 border-green-200'
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      icon: 'bg-orange-100 text-orange-600',
      accent: 'bg-orange-50 border-orange-200'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'bg-purple-100 text-purple-600',
      accent: 'bg-purple-50 border-purple-200'
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsData.map((stat) => {
        const currentColor = colorClasses[stat.color];
        
        return (
          <div 
            key={stat.title}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentColor.bg} opacity-5 rounded-2xl`}></div>
            
            {/* Floating Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${currentColor.icon} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                {stat.trend && (
                  <div className={`flex items-center space-x-1 ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={stat.trend.isPositive 
                        ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                      } clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">{Math.abs(stat.trend.value)}%</span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <div className={`w-full ${currentColor.accent} rounded-full h-2 mt-3`}>
                  <div 
                    className={`bg-gradient-to-r ${currentColor.bg} h-2 rounded-full transition-all duration-1000 shadow-sm`}
                    style={{ width: `${Math.min((stat.value / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomStats;
