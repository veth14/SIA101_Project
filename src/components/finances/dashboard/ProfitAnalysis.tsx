import React, { useMemo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getRevenueData, 
  calculateChartMetrics, 
  formatCurrency 
} from './chartsLogic/revenueAnalyticsLogic';
import { SkeletonMetrics } from '../../universalLoader/SkeletonLoader';

const ProfitAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const revenueData = useMemo(() => getRevenueData('monthly'), []);
  const metrics = useMemo(() => calculateChartMetrics(revenueData), [revenueData]);

  // Simulate loading - synchronized with all components
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonMetrics />;
  }

  return (
    <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="flex items-center justify-center w-12 h-12 shadow-2xl bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral rounded-2xl transition-all duration-300 group-hover:scale-105">
                  <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Profit Overview
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Key Profit Metrics</p>
                  <div className="w-1 h-1 bg-heritage-green rounded-full"></div>
                  <span className="text-sm font-bold text-heritage-green">October 2025</span>
                </div>
              </div>
            </div>
            
            {/* View Details Button */}
            <button 
              onClick={() => navigate('/admin/finances/profit-analysis')}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          {/* Profit Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-heritage-light/30 shadow-lg">
              <div className="text-sm text-gray-500 mb-2">Total Profit</div>
              <div className="text-2xl font-black text-heritage-green mb-1">
                {formatCurrency(metrics.totalProfit)}
              </div>
              <div className="flex items-center text-sm font-medium text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {metrics.profitMargin.toFixed(1)}% margin
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-red-200/30 shadow-lg">
              <div className="text-sm text-gray-500 mb-2">Total Expenses</div>
              <div className="text-2xl font-black text-red-600 mb-1">
                {formatCurrency(metrics.totalExpenses)}
              </div>
              <div className="flex items-center text-sm font-medium text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                {((metrics.totalExpenses / metrics.totalRevenue) * 100).toFixed(1)}% of revenue
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/30 shadow-lg">
              <div className="text-sm text-gray-500 mb-2">Average Revenue</div>
              <div className="text-2xl font-black text-blue-600 mb-1">
                {formatCurrency(metrics.averageRevenue)}
              </div>
              <div className="text-sm text-gray-500">
                Per period
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-200/30 shadow-lg">
              <div className="text-sm text-gray-500 mb-2">Projected Revenue</div>
              <div className="text-2xl font-black text-purple-600 mb-1">
                {formatCurrency(metrics.projectedRevenue)}
              </div>
              <div className="text-sm text-gray-500">
                Next period
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 shadow-inner border border-gray-100">
            <h4 className="font-medium text-gray-700 mb-4">Quick Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-all duration-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-700">Rooms Department</div>
                  <div className="text-sm text-gray-500">Highest profit margin at 58.3%</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-all duration-200">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-700">F&B Department</div>
                  <div className="text-sm text-gray-500">Needs attention: -20% margin</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-all duration-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-700">Staff Costs</div>
                  <div className="text-sm text-gray-500">45% of total expenses</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-all duration-200">
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