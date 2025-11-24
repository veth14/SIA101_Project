import React from 'react';
import { PieChart } from 'lucide-react';

interface CostItem {
  label: string;
  percentage: number;
  gradient?: string;
  dotColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

interface CostBreakdownProps {
  costAnalysis?: Array<{
    category: string;
    amount: number;
    percentage: number;
    color?: string;
    icon?: React.ReactNode;
  }>;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ costAnalysis }) => {
  const defaultCosts: CostItem[] = [
    { 
      label: 'Staff Costs', 
      percentage: 45, 
      gradient: 'from-red-500 to-red-600',
      dotColor: 'bg-red-500',
      textColor: 'text-red-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      label: 'Utilities', 
      percentage: 25, 
      gradient: 'from-orange-500 to-orange-600',
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: 'F&B Costs', 
      percentage: 20, 
      gradient: 'from-purple-500 to-purple-600',
      dotColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      label: 'Marketing', 
      percentage: 10, 
      gradient: 'from-emerald-500 to-emerald-600',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    }
  ];

  const costs: CostItem[] = costAnalysis && costAnalysis.length > 0
    ? costAnalysis.map(c => ({
        label: c.category,
        percentage: c.percentage,
        gradient: 'from-gray-400 to-gray-500',
        dotColor: 'bg-gray-400',
        textColor: 'text-gray-700',
        icon: c.icon || undefined
      }))
    : defaultCosts;

  return (
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-heritage-light/10 to-heritage-green/5 rounded-3xl opacity-50"></div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center space-x-5">
          <div className="relative group">
            <div className="p-2 bg-[#82A33D]/10 rounded-xl">
              <PieChart className="w-6 h-6 text-[#82A33D]" />
            </div>
            <div className="absolute -inset-2 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20"></div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
              Cost Analysis
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-semibold text-gray-600">Expense breakdown by category</p>
              <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
              <span className="text-sm font-bold text-heritage-green">November 2025</span>
            </div>
          </div>
        </div>

        {/* Cost Items */}
        <div className="space-y-4">
          {costs.map((cost, index) => (
            <div
              key={cost.label}
              className="group relative overflow-hidden bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/60 hover:border-heritage-green/40 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/0 to-heritage-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              <div className="relative z-10">
                {/* Label and Percentage */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`relative w-10 h-10 bg-gradient-to-br ${cost.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {cost.icon}
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 text-sm group-hover:text-heritage-green transition-colors block">{cost.label}</span>
                      <span className="text-xs text-gray-500 font-medium">Cost Category</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${cost.dotColor} shadow-sm`}></div>
                      <span className={`font-black ${cost.textColor} text-2xl`}>{cost.percentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full bg-gray-200/80 rounded-full h-3 shadow-inner overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${cost.gradient} h-3 rounded-full relative overflow-hidden transition-all duration-1000 shadow-md`}
                    style={{ width: `${cost.percentage}%` }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                    {/* Inner highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
