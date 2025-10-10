import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { formatCurrency } from '../dashboard/chartsLogic/revenueAnalyticsLogic';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

interface Metrics {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: number;
}

interface ProfitMetricsProps {
  metrics: Metrics;
}

export const ProfitMetrics: React.FC<ProfitMetricsProps> = ({ metrics }) => {
  const [isLoading, setIsLoading] = useState(true);
  const profitMarginPercentage = ((metrics.totalProfit / metrics.totalRevenue) * 100).toFixed(1);

  // Simulate loading - synchronized with all components
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const statsData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: '+12.5% from last period',
      changeType: 'positive' as const,
      iconBg: 'bg-green-100',
      icon: <DollarSign className="w-6 h-6 text-green-600" strokeWidth={2.5} />,
      progressColor: 'bg-gradient-to-r from-[#82A33D] to-emerald-400'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(metrics.totalExpenses),
      change: '+8.3% from last period',
      changeType: 'positive' as const,
      iconBg: 'bg-orange-100',
      icon: <TrendingDown className="w-6 h-6 text-orange-600" strokeWidth={2.5} />,
      progressColor: 'bg-gradient-to-r from-orange-400 to-orange-600'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(metrics.totalProfit),
      change: '+15.2% from last period',
      changeType: 'positive' as const,
      iconBg: 'bg-blue-100',
      icon: <TrendingUp className="w-6 h-6 text-blue-600" strokeWidth={2.5} />,
      progressColor: 'bg-gradient-to-r from-blue-400 to-blue-600'
    },
    {
      title: 'Profit Margin',
      value: `${profitMarginPercentage}%`,
      change: '+2.1% from last period',
      changeType: 'positive' as const,
      iconBg: 'bg-purple-100',
      icon: <Percent className="w-6 h-6 text-purple-600" strokeWidth={2.5} />,
      progressColor: 'bg-gradient-to-r from-purple-400 to-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="overflow-hidden relative p-8 rounded-2xl border shadow-lg backdrop-blur-xl bg-white/95 border-white/50">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-5">
                <div className="flex items-center mb-3">
                  <Skeleton className="w-1 h-5 mr-2 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-28 mb-3" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="w-16 h-16 rounded-xl" />
            </div>
            <div className="absolute right-0 bottom-0 left-0 h-1">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
      {statsData.map((stat, index) => (
        <div 
          key={index} 
          className="overflow-hidden relative p-8 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-500 bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group animate-fade-in"
          style={{ animationDelay: `${(index + 2) * 100}ms` }}
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
          <div className="flex relative justify-between items-start">
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
                <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    stat.changeType === 'positive' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V8"
                  } />
                </svg>
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
          <div className="overflow-hidden absolute right-0 bottom-0 left-0 h-1">
            <div 
              className={`h-full ${stat.progressColor}`}
              style={{ width: `${(index + 1) * 25}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
