import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getRevenueData, 
  calculateChartMetrics, 
  formatCurrency 
} from './chartsLogic/revenueAnalyticsLogic';

const ProfitAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const revenueData = useMemo(() => getRevenueData('monthly'), []);
  const metrics = useMemo(() => calculateChartMetrics(revenueData), [revenueData]);

  return (
    <div className="relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-fade-in">
      {/* Background Elements */}
      <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h7m0 0v7m0-7l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Profit Overview
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Key Profit Metrics</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                  <span className="text-sm font-bold text-heritage-green">October 2025</span>
                </div>
              </div>
            </div>
            
            {/* View Details Button */}
            <button 
              onClick={() => navigate('/admin/income?tab=profit')}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-2xl hover:shadow-xl hover:scale-105"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          {/* Profit Metrics */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-heritage-light/30">
              <div className="mb-2 text-sm text-gray-500">Total Profit</div>
              <div className="mb-1 text-2xl font-black text-heritage-green">
                {formatCurrency(metrics.totalProfit)}
              </div>
              <div className="flex items-center text-sm font-medium text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {metrics.profitMargin.toFixed(1)}% margin
              </div>
            </div>

            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-red-200/30">
              <div className="mb-2 text-sm text-gray-500">Total Expenses</div>
              <div className="mb-1 text-2xl font-black text-red-600">
                {formatCurrency(metrics.totalExpenses)}
              </div>
              <div className="flex items-center text-sm font-medium text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                {((metrics.totalExpenses / metrics.totalRevenue) * 100).toFixed(1)}% of revenue
              </div>
            </div>

            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-blue-200/30">
              <div className="mb-2 text-sm text-gray-500">Average Revenue</div>
              <div className="mb-1 text-2xl font-black text-blue-600">
                {formatCurrency(metrics.averageRevenue)}
              </div>
              <div className="text-sm text-gray-500">
                Per period
              </div>
            </div>

            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-purple-200/30">
              <div className="mb-2 text-sm text-gray-500">Projected Revenue</div>
              <div className="mb-1 text-2xl font-black text-purple-600">
                {formatCurrency(metrics.projectedRevenue)}
              </div>
              <div className="text-sm text-gray-500">
                Next period
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="p-5 border border-gray-100 shadow-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl">
            <h4 className="mb-4 font-medium text-gray-700">Quick Insights</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:bg-white">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-700">Rooms Department</div>
                  <div className="text-sm text-gray-500">Highest profit margin at 58.3%</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:bg-white">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-700">F&B Department</div>
                  <div className="text-sm text-gray-500">Needs attention: -20% margin</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:bg-white">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-700">Staff Costs</div>
                  <div className="text-sm text-gray-500">45% of total expenses</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:bg-white">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-700">Growth Rate</div>
                  <div className="text-sm text-gray-500">{metrics.growthRate.toFixed(1)}% this period</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAnalysis;