import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export interface RevenueData {
  id: string;
  source: 'rooms' | 'food_beverage' | 'other';
  amount: number;
  date: string;
  description: string;
  percentage: number;
}

interface RevenueSourcesBreakdownProps {
  revenueData: RevenueData[];
}

const RevenueSourcesBreakdown: React.FC<RevenueSourcesBreakdownProps> = ({ revenueData }) => {
  const getSourceConfig = (source: string) => {
    switch (source) {
      case 'rooms':
        return {
          icon: '🏨',
          name: 'Room Revenue',
          gradient: 'from-blue-500 via-blue-600 to-blue-700',
          bgGradient: 'from-blue-50 to-blue-100/50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
      case 'food_beverage':
        return {
          icon: '🍽️',
          name: 'Food & Beverage',
          gradient: 'from-orange-500 via-orange-600 to-orange-700',
          bgGradient: 'from-orange-50 to-orange-100/50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700'
        };
      case 'other':
        return {
          icon: '📦',
          name: 'Other Services',
          gradient: 'from-gray-500 via-gray-600 to-gray-700',
          bgGradient: 'from-gray-50 to-gray-100/50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700'
        };
      default:
        return {
          icon: '💰',
          name: 'Unknown',
          gradient: 'from-heritage-green via-heritage-green to-heritage-neutral',
          bgGradient: 'from-heritage-light/30 to-heritage-light/50',
          borderColor: 'border-heritage-light',
          textColor: 'text-heritage-green'
        };
    }
  };

  const totalAmount = revenueData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-white to-heritage-light/10 rounded-3xl opacity-60"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-[#82A33D]" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Revenue by Source
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-semibold text-gray-600">Detailed Breakdown</p>
                <div className="w-1 h-1 bg-heritage-green rounded-full"></div>
                <span className="text-sm font-bold text-heritage-green">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Source Cards */}
        <div className="p-8 space-y-4">
          {revenueData.map((item, index) => {
            const config = getSourceConfig(item.source);
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    {/* Icon */}
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 text-3xl bg-white rounded-2xl shadow-lg ring-2 ring-white/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {config.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h5 className={`text-lg font-bold ${config.textColor} mb-1`}>
                        {config.name}
                      </h5>
                      <p className="text-sm text-gray-600 font-medium">{item.description}</p>
                      
                      {/* Progress bar */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 bg-white/60 rounded-full h-2.5 overflow-hidden shadow-inner">
                          <div
                            className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-bold ${config.textColor} min-w-[45px] text-right`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount Display */}
                  <div className="text-right ml-6">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <TrendingUp className={`w-4 h-4 ${config.textColor}`} />
                      <p className={`text-2xl font-black ${config.textColor}`}>
                        ${item.amount.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold">
                      {((item.amount / totalAmount) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueSourcesBreakdown;
