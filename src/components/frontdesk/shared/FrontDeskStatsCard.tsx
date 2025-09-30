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
  // Convert emoji icons to SVG icons
  const getIconSvg = (iconEmoji: string) => {
    switch (iconEmoji) {
      case '📋':
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case '⏳':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case '🏨':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case '✅':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case '❌':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getIconBg = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100';
      case 'yellow': return 'bg-yellow-100';
      case 'green': return 'bg-green-100';
      case 'gray': return 'bg-gray-100';
      case 'purple': return 'bg-purple-100';
      case 'red': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getChangeText = () => {
    if (!trend) return 'No change data';
    return `${trend.isPositive ? '+' : '-'}${trend.value}% from last month`;
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500"></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full"></div>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</p>
          </div>
          <p className="text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500">{value}</p>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
            trend?.isPositive 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : trend?.isPositive === false
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            {getChangeText()}
          </div>
        </div>
        <div className="relative">
          <div className={`w-20 h-20 ${getIconBg(color)} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            {getIconSvg(icon)}
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskStatsCard;
