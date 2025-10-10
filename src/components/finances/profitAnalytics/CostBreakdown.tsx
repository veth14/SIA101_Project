import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../dashboard/chartsLogic/revenueAnalyticsLogic';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

interface CostAnalysisItem {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down';
  change: string;
  color: string;
  icon: string;
  description: string;
  status: 'high' | 'medium' | 'low';
}

interface CostBreakdownProps {
  costAnalysis: CostAnalysisItem[];
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ costAnalysis }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading - synchronized with all components
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div>
        {/* Section Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
        </div>

        {/* Cost Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="overflow-hidden relative p-8 rounded-2xl border shadow-lg backdrop-blur-xl bg-white/95 border-white/50"
            >
              <div className="relative">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Amount and Progress Skeleton */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full mb-4" />
                </div>

                {/* Status Badge Skeleton */}
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cost Breakdown Analysis</h2>
            <p className="text-sm text-gray-600">Detailed expense categories and trends</p>
          </div>
        </div>
      </div>

      {/* Cost Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {costAnalysis.map((cost, index) => (
          <div 
            key={cost.category}
            className="overflow-hidden relative p-8 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-500 bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group animate-fade-in"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            {/* Glass morphism effect */}
            <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-[#82A33D]/10 to-transparent"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#82A33D]/5 to-transparent"></div>
            
            {/* Content container */}
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: `${cost.color}20`, color: cost.color }}
                  >
                    {cost.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{cost.category}</h3>
                    <p className="text-sm text-gray-600">{cost.description}</p>
                  </div>
                </div>
                
                {/* Trend Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  cost.trend === 'up' ? 'bg-red-50 text-red-700 border border-red-200/50' : 'bg-green-50 text-green-700 border border-green-200/50'
                }`}>
                  {cost.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {cost.change}
                </div>
              </div>

              {/* Amount and Percentage */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">
                    {formatCurrency(cost.amount)}
                  </span>
                  <span className="text-xl font-bold text-gray-600">
                    {cost.percentage}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${cost.percentage}%`,
                      backgroundColor: cost.color
                    }}
                  ></div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                cost.status === 'high' ? 'bg-red-50 text-red-700 border border-red-200/50' :
                cost.status === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200/50' :
                'bg-green-50 text-green-700 border border-green-200/50'
              }`}>
                {cost.status === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {cost.status === 'low' && <CheckCircle className="w-3 h-3 mr-1" />}
                {cost.status.toUpperCase()} PRIORITY
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
