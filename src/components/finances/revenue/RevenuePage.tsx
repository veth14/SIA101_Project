import React, { useState, Suspense, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RevenueDashboard from './RevenueDashboard';

// OverviewCards is a named export — map it to default for React.lazy
const OverviewCards = React.lazy(() => import('../profitAnalytics/OverviewCards').then((m) => ({ default: m.OverviewCards })));
const ProfitAnalysisCharts = React.lazy(() => import('../profitAnalytics/ProfitAnalysisCharts'));

// Analytics helpers (reuse same logic as ProfitAnalysisPage)
import { getRevenueData, calculateChartMetrics } from '../dashboard/chartsLogic/revenueAnalyticsLogic';

export const RevenuePage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'revenue' | 'profit'>('revenue');
  const [activeTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  // Compute revenue metrics for the Profit tab and pass to components
  const revenueData = useMemo(() => getRevenueData(activeTimeframe), [activeTimeframe]);
  const metrics = useMemo(() => calculateChartMetrics(revenueData), [revenueData]);

  const costAnalysis = useMemo(() => [
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
  ], [metrics.totalExpenses]);

  const departmentProfits = useMemo(() => [
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
  ], [metrics.totalRevenue, metrics.totalExpenses]);

  // Read ?tab= or #hash on mount and switch tabs accordingly
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'profit') {
        setActiveTab('profit');
        return;
      }
      if (location.hash === '#profit') {
        setActiveTab('profit');
      }
    } catch (e) {
      // ignore malformed URL
    }
  }, [location.search, location.hash]);

  // no inline net pill; header will provide an action to open profit tab

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
  <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl opacity-30"></div>
  <div className="absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl"></div>
  <div className="absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full px-2 py-4 space-y-6 sm:px-4 lg:px-6">

        {/* Tabs - segmented control matching page header style */}
        <div className="relative flex justify-center mb-6">
          <div className="w-full max-w-4xl p-2 border shadow-lg rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-green-100/20 border-emerald-200/40 backdrop-blur-sm">
            <div className="relative flex items-center justify-center px-3 py-3 overflow-hidden rounded-2xl bg-gradient-to-b from-white/50 to-emerald-50/30">
                {/* Sliding indicator - enhanced with better gradients and shadow */}
                <div
                  aria-hidden
                  className={`absolute top-1.5 bottom-1.5 w-1/2 rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${
                    activeTab === 'revenue' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                  style={{
                    left: 6,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 100%)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255,255,255,0.5)'
                  }}
                />

                <div role="tablist" aria-label="Revenue tabs" className="relative z-10 flex items-center justify-center w-full gap-3">
                <button
                  role="tab"
                  aria-selected={activeTab === 'revenue'}
                  tabIndex={0}
                  onClick={() => {
                    setActiveTab('revenue');
                    navigate(location.pathname, { replace: false });
                  }}
                    className={`group z-20 flex items-center justify-center flex-1 text-center px-10 py-3.5 text-[15px] font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${
                      activeTab === 'revenue' 
                        ? 'text-emerald-900 scale-[1.02]' 
                        : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'
                    }`}
                >
                    <span className="font-extrabold tracking-wide">Revenue</span>
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'profit'}
                  tabIndex={0}
                  onClick={() => {
                    setActiveTab('profit');
                    // deep-link the profit tab so layout/topbar can detect it
                    navigate(`${location.pathname}?tab=profit`, { replace: false });
                  }}
                  title="Net profit and margin analytics"
                  className={`group z-20 flex items-center justify-center flex-1 text-center px-10 py-3.5 text-[15px] font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${
                    activeTab === 'profit' 
                      ? 'text-emerald-900 scale-[1.02]' 
                      : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'
                  }`}
                >
                  <span className="font-extrabold tracking-wide">Profit & Margin</span>
                </button>
              </div>
            </div>
          </div>
        </div>

          <div>
            {activeTab === 'revenue' && (
              <RevenueDashboard />
            )}

            {activeTab === 'profit' && (
              <Suspense fallback={null}>
                <div className="space-y-6">
                  {/* KPI / Overview cards - pass computed metrics */}
                  <OverviewCards
                    totalRevenue={metrics.totalRevenue}
                    totalExpenses={metrics.totalExpenses}
                    netProfit={metrics.totalProfit}
                  />

                  {/* Charts and trends - pass cost/department data */}
                  <ProfitAnalysisCharts costAnalysis={costAnalysis} departmentProfits={departmentProfits} />
                </div>
              </Suspense>
            )}
          </div>
        </div>
      </div>
  );
};

export default RevenuePage;