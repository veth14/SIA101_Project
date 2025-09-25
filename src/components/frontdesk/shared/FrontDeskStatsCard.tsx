import React from 'react';

interface FrontDeskStatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'yellow' | 'green' | 'gray' | 'purple' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const FrontDeskStatsCard: React.FC<FrontDeskStatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'bg-blue-100 text-blue-600',
      accent: 'bg-blue-50 border-blue-200'
    },
    yellow: {
      bg: 'from-yellow-500 to-orange-500',
      icon: 'bg-yellow-100 text-yellow-600',
      accent: 'bg-yellow-50 border-yellow-200'
    },
    green: {
      bg: 'from-heritage-green to-emerald-600',
      icon: 'bg-green-100 text-green-600',
      accent: 'bg-green-50 border-green-200'
    },
    gray: {
      bg: 'from-gray-500 to-gray-600',
      icon: 'bg-gray-100 text-gray-600',
      accent: 'bg-gray-50 border-gray-200'
    },
    purple: {
      bg: 'from-purple-500 to-violet-600',
      icon: 'bg-purple-100 text-purple-600',
      accent: 'bg-purple-50 border-purple-200'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'bg-red-100 text-red-600',
      accent: 'bg-red-50 border-red-200'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentColor.bg} opacity-5 rounded-2xl`}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${currentColor.icon} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{icon}</span>
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d={trend.isPositive 
                  ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                } clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <div className={`w-full ${currentColor.accent} rounded-full h-2 mt-3`}>
            <div 
              className={`bg-gradient-to-r ${currentColor.bg} h-2 rounded-full transition-all duration-1000 shadow-sm`}
              style={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskStatsCard;
