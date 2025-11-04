import React, { useMemo } from 'react';
import { 
  getRevenueData, 
  calculateChartMetrics
} from '../dashboard/chartsLogic/revenueAnalyticsLogic';
import { ProfitAnalysisHeader } from './ProfitAnalysisHeader';
import { ProfitAnalysisCharts } from './ProfitAnalysisCharts';

const ProfitAnalysisPage: React.FC = () => {
  const activeTimeframe: 'monthly' | 'yearly' = 'monthly';
  
  // Get data from revenue analytics for calculations
  const revenueData = useMemo(() => getRevenueData(activeTimeframe), [activeTimeframe]);
  const metrics = useMemo(() => calculateChartMetrics(revenueData), [revenueData]);
  
  // Cost breakdown analysis
  const costAnalysis = [
    {
      category: 'Staff Costs',
      amount: Math.round(metrics.totalExpenses * 0.45),
      percentage: 45,
      trend: 'up' as const,
      change: '+3.2%',
      color: '#EF4444',
      icon: '👥',
      description: 'Salaries, benefits, training',
      status: 'high' as const
    },
    {
      category: 'Utilities & Maintenance',
      amount: Math.round(metrics.totalExpenses * 0.25),
      percentage: 25,
      trend: 'down' as const,
      change: '-1.8%',
      color: '#F59E0B',
      icon: '⚡',
      description: 'Electricity, water, repairs',
      status: 'medium' as const
    },
    {
      category: 'Food & Beverage Costs',
      amount: Math.round(metrics.totalExpenses * 0.20),
      percentage: 20,
      trend: 'up' as const,
      change: '+2.1%',
      color: '#8B5CF6',
      icon: '🍽️',
      description: 'Ingredients, supplies, waste',
      status: 'medium' as const
    },
    {
      category: 'Marketing & Operations',
      amount: Math.round(metrics.totalExpenses * 0.10),
      percentage: 10,
      trend: 'down' as const,
      change: '-0.5%',
      color: '#10B981',
      icon: '📢',
      description: 'Advertising, admin, insurance',
      status: 'low' as const
    }
  ];

  // Department profit analysis
  const departmentProfits = [
    {
      department: 'Rooms',
      revenue: Math.round(metrics.totalRevenue * 0.60),
      costs: Math.round(metrics.totalExpenses * 0.35),
      profit: Math.round(metrics.totalRevenue * 0.60) - Math.round(metrics.totalExpenses * 0.35),
      margin: 58.3,
      status: 'excellent' as const
    },
    {
      department: 'Food & Beverage',
      revenue: Math.round(metrics.totalRevenue * 0.25),
      costs: Math.round(metrics.totalExpenses * 0.30),
      profit: Math.round(metrics.totalRevenue * 0.25) - Math.round(metrics.totalExpenses * 0.30),
      margin: -20.0,
      status: 'poor' as const
    },
    {
      department: 'Events',
      revenue: Math.round(metrics.totalRevenue * 0.10),
      costs: Math.round(metrics.totalExpenses * 0.15),
      profit: Math.round(metrics.totalRevenue * 0.10) - Math.round(metrics.totalExpenses * 0.15),
      margin: -50.0,
      status: 'poor' as const
    },
    {
      department: 'Other Services',
      revenue: Math.round(metrics.totalRevenue * 0.05),
      costs: Math.round(metrics.totalExpenses * 0.20),
      profit: Math.round(metrics.totalRevenue * 0.05) - Math.round(metrics.totalExpenses * 0.20),
      margin: -300.0,
      status: 'critical' as const
    }
  ];

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements - Matching Financial Dashboard */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
  <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl opacity-30"></div>
  <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl delay-1000 opacity-25"></div>
  <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container - Matching Financial Dashboard */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <ProfitAnalysisHeader />

        {/* Enhanced Dashboard Content */}
        <ProfitAnalysisCharts 
          costAnalysis={costAnalysis} 
          departmentProfits={departmentProfits} 
        />
      </div>
    </div>
  );
};

export default ProfitAnalysisPage;
