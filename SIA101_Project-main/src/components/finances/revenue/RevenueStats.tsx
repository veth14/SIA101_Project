import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
}

interface RevenueStatsProps {
  totalRevenue: number;
  averageDaily: number;
  growthRate: number;
  topSource: string;
}

const RevenueStats: React.FC<RevenueStatsProps> = ({
  totalRevenue,
  averageDaily,
  growthRate,
  topSource
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: `+${growthRate}% from last month`,
      changeType: 'positive',
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Average Daily',
      value: `$${averageDaily.toLocaleString()}`,
      change: 'Daily revenue average',
      changeType: 'neutral',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Growth Rate',
      value: `+${growthRate}%`,
      change: 'Month over month',
      changeType: 'positive',
      iconBg: 'bg-purple-100',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Top Source',
      value: topSource,
      change: 'Highest performer',
      changeType: 'neutral',
      iconBg: 'bg-orange-100',
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative p-8 overflow-hidden border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-5">
                <div className="flex items-center mb-3">
                  <Skeleton className="w-1 h-5 mr-2 rounded-full" />
                  <Skeleton className="w-24 h-4" />
                </div>
                <Skeleton className="h-10 mb-3 w-28" />
                <Skeleton className="w-32 h-6 rounded-full" />
              </div>
              <Skeleton className="w-16 h-16 rounded-xl" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative p-8 overflow-hidden transition-all duration-500 border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Glass morphism effect */}
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-[#82A33D]/10 to-transparent"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#82A33D]/5 to-transparent"></div>
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 15px 15px, rgba(130, 163, 61, 0.2) 2px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
          
          {/* Content container */}
          <div className="relative flex items-start justify-between">
            {/* Left side - text content */}
            <div className="flex-1 mr-5">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">{stat.title}</p>
              </div>
              
              <div className="relative">
                <p className="mb-3 text-4xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">{stat.value}</p>
                <div className="absolute -right-1 -top-1 w-8 h-8 bg-[#82A33D]/5 rounded-full blur-md -z-10 group-hover:bg-[#82A33D]/10 transition-colors duration-300"></div>
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                stat.changeType === 'positive' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                  : stat.changeType === 'negative' 
                  ? 'bg-red-50 text-red-700 border border-red-200/50' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200/50'
              }`}>
                {stat.changeType !== 'neutral' && (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                      stat.changeType === 'positive' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V8"
                    } />
                  </svg>
                )}
                {stat.change}
              </div>
            </div>
            
            {/* Right side - icon */}
            <div className="relative">
              <div className={`w-16 h-16 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                {stat.icon}
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-xl from-white/40"></div>
              </div>
              
              {/* Subtle glow effect on hover */}
              <div className="absolute transition-all duration-300 opacity-0 -inset-1 bg-gradient-to-r from-[#82A33D]/20 to-emerald-400/20 rounded-xl blur-md group-hover:opacity-100"></div>
            </div>
          </div>
          
          {/* Bottom progress indicator - different for each card */}
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div 
              className={`h-full ${
                index === 0 ? 'bg-gradient-to-r from-[#82A33D] to-emerald-400' :
                index === 1 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                index === 2 ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                'bg-gradient-to-r from-orange-400 to-orange-600'
              }`}
              style={{ width: `${(index + 1) * 25}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevenueStats;
