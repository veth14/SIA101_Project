import React from 'react';
import { OverviewCards } from './OverviewCards';
import ProfitTrendsChart from './ProfitTrendsChart';
import { TopSalesProduct } from './TopSalesProduct';
import { RecentTransactions } from './RecentTransactions';

interface CostAnalysis {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  change: string;
  status: 'high' | 'medium' | 'low';
  description: string;
}

interface DepartmentProfit {
  department: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  status: 'excellent' | 'good' | 'poor' | 'critical';
}

interface ProfitAnalysisChartsProps {
  costAnalysis: CostAnalysis[];
  departmentProfits: DepartmentProfit[];
}

export const ProfitAnalysisCharts: React.FC<ProfitAnalysisChartsProps> = ({
  costAnalysis,
  departmentProfits
}) => {
  // Calculate totals from data
  const totalExpenses = costAnalysis.reduce((sum, cost) => sum + cost.amount, 0);
  const totalRevenue = departmentProfits.reduce((sum, dept) => sum + dept.revenue, 0);
  const netProfit = departmentProfits.reduce((sum, dept) => sum + dept.profit, 0);
  const monthlyTarget = 2000000; // Set monthly target

  return (
    <div className="space-y-6">
      {/* Stats Cards - Matching Financial Dashboard */}
      <OverviewCards 
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        monthlyTarget={monthlyTarget}
      />

      {/* Main Profit Trends Chart - Full Width */}
      <div className="mb-6">
        <ProfitTrendsChart />
      </div>

      {/* Secondary Charts Section - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sales Performance */}
        <TopSalesProduct departmentProfits={departmentProfits} />
        
        {/* Recent Transactions */}
        <RecentTransactions departmentProfits={departmentProfits} />
        
        {/* Quick Insights */}
        <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative group">
                <div className="flex items-center justify-center w-12 h-12 shadow-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Quick Insights
                </h3>
                <p className="text-sm font-semibold text-gray-600">Key performance indicators</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center p-4 bg-white/60 border border-heritage-light/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                  <span className="font-medium text-gray-700">Best Performer</span>
                </div>
                <span className="font-bold text-heritage-green text-lg">
                  {departmentProfits.reduce((best, dept) => dept.margin > best.margin ? dept : best).department}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/60 border border-heritage-light/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  <span className="font-medium text-gray-700">Average Margin</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">
                  {(departmentProfits.reduce((sum, dept) => sum + dept.margin, 0) / departmentProfits.length).toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/60 border border-heritage-light/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                  <span className="font-medium text-gray-700">Total Departments</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">{departmentProfits.length}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/60 border border-heritage-light/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                  <span className="font-medium text-gray-700">Profit Growth</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="font-bold text-emerald-600 text-lg">+8.7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cost Breakdown */}
        <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative group">
                <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Cost Breakdown
                </h3>
                <p className="text-xs font-semibold text-gray-600">Expense distribution analysis</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="group p-4 bg-white/60 border border-heritage-light/30 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in hover:bg-white/80" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">Staff Costs</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-red-600 text-lg group-hover:scale-105 transition-transform duration-300 inline-block">45%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden" style={{ width: '45%' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 bg-white/60 border border-heritage-light/30 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in hover:bg-white/80" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">Utilities & Maintenance</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-orange-600 text-lg group-hover:scale-105 transition-transform duration-300 inline-block">25%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden" style={{ width: '25%' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 bg-white/60 border border-heritage-light/30 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in hover:bg-white/80" style={{ animationDelay: '300ms' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">F&B Costs</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-purple-600 text-lg group-hover:scale-105 transition-transform duration-300 inline-block">20%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden" style={{ width: '20%' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 bg-white/60 border border-heritage-light/30 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in hover:bg-white/80" style={{ animationDelay: '400ms' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-bold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">Marketing & Operations</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-600 text-lg group-hover:scale-105 transition-transform duration-300 inline-block">10%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden" style={{ width: '10%' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
