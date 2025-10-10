import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../dashboard/chartsLogic/revenueAnalyticsLogic';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

interface DepartmentProfit {
  department: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  status: 'excellent' | 'good' | 'poor' | 'critical';
}

interface DepartmentProfitabilityProps {
  departmentProfits: DepartmentProfit[];
}

export const DepartmentProfitability: React.FC<DepartmentProfitabilityProps> = ({ departmentProfits }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading - synchronized with all components
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-700 bg-green-50 border-green-200/50';
      case 'good': return 'text-blue-700 bg-blue-50 border-blue-200/50';
      case 'poor': return 'text-orange-700 bg-orange-50 border-orange-200/50';
      case 'critical': return 'text-red-700 bg-red-50 border-red-200/50';
      default: return 'text-gray-700 bg-gray-50 border-gray-200/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-3 h-3" />;
      case 'good': return <TrendingUp className="w-3 h-3" />;
      case 'poor': return <TrendingDown className="w-3 h-3" />;
      case 'critical': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div>
        {/* Section Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>

        {/* Department Cards Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="overflow-hidden relative p-8 rounded-2xl border shadow-lg backdrop-blur-xl bg-white/95 border-white/50"
            >
              <div className="relative">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="space-y-4">
                  {/* Revenue/Costs Skeleton */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  {/* Divider */}
                  <Skeleton className="h-px w-full" />

                  {/* Profit Skeleton */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-28" />
                  </div>

                  {/* Margin Skeleton */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>

                  {/* Progress Bar Skeleton */}
                  <Skeleton className="h-2 w-full rounded-full" />

                  {/* Recommendation Skeleton */}
                  <div className="mt-4 p-3 rounded-lg border border-gray-200/50">
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Department Profitability</h2>
            <p className="text-sm text-gray-600">Revenue, costs, and profit margins by department</p>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departmentProfits.map((dept, index) => (
          <div 
            key={dept.department}
            className="overflow-hidden relative p-8 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-500 bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group animate-fade-in"
            style={{ animationDelay: `${(index + 6) * 100}ms` }}
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
                <h3 className="text-xl font-bold text-gray-900">{dept.department}</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(dept.status)}`}>
                  {getStatusIcon(dept.status)}
                  <span className="ml-1">{dept.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Revenue */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Revenue</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(dept.revenue)}</span>
                </div>

                {/* Costs */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Costs</span>
                  <span className="text-lg font-bold text-red-600">{formatCurrency(dept.costs)}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200/50"></div>

                {/* Profit */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Net Profit</span>
                  <span className={`text-2xl font-extrabold ${dept.profit >= 0 ? 'text-[#82A33D]' : 'text-red-600'} group-hover:scale-105 transition-transform duration-300`}>
                    {formatCurrency(dept.profit)}
                  </span>
                </div>

                {/* Profit Margin */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Profit Margin</span>
                  <div className="flex items-center space-x-2">
                    {dept.margin >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-lg font-bold ${dept.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dept.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Margin */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      dept.margin >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(dept.margin), 100)}%`
                    }}
                  ></div>
                </div>

                {/* Recommendations */}
                <div className={`mt-4 p-3 rounded-lg border ${
                  dept.status === 'excellent' ? 'bg-green-50 border-green-200/50' :
                  dept.status === 'good' ? 'bg-blue-50 border-blue-200/50' :
                  dept.status === 'poor' ? 'bg-orange-50 border-orange-200/50' :
                  'bg-red-50 border-red-200/50'
                }`}>
                  <p className="text-xs font-medium text-gray-700">
                    {dept.status === 'excellent' && '✅ Excellent performance. Continue current strategies.'}
                    {dept.status === 'good' && '📈 Good performance. Look for optimization opportunities.'}
                    {dept.status === 'poor' && '⚠️ Needs attention. Review cost structure and pricing.'}
                    {dept.status === 'critical' && '🚨 Critical. Immediate action required to reduce losses.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
