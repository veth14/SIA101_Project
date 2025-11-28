import React, { useState, Suspense, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RevenueDashboard from './RevenueDashboard';

// OverviewCards is a named export — map it to default for React.lazy
const OverviewCards = React.lazy(() => import('../profitAnalytics/OverviewCards').then((m) => ({ default: m.OverviewCards })));
const ProfitAnalysisCharts = React.lazy(() => import('../profitAnalytics/ProfitAnalysisCharts'));

// Live data from Firestore services
import { subscribeToInvoices, type InvoiceRecord } from '../../../backend/invoices/invoicesService';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../backend/requisitions/requisitionsService';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord } from '../../../backend/purchaseOrders/purchaseOrdersService';

export const RevenuePage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'revenue' | 'profit'>('revenue');
  const [activeTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const [invoiceRecords, setInvoiceRecords] = useState<InvoiceRecord[]>([]);
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);

  // Subscribe to live financial data
  useEffect(() => {
    const unsubscribe = subscribeToInvoices(
      (records) => {
        const paid = records.filter((r) => r.status === 'paid' || r.status === 'completed');
        setInvoiceRecords(paid);
      },
      (error) => {
        console.error('Error loading invoices for revenue/profit analytics:', error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToRequisitions(
      (loaded) => {
        setRequisitions(loaded);
      },
      (error) => {
        console.error('Error loading requisitions for revenue/profit analytics:', error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPurchaseOrders(
      (loaded) => {
        setPurchaseOrders(loaded);
      },
      (error) => {
        console.error('Error loading purchase orders for revenue/profit analytics:', error);
      }
    );

    return unsubscribe;
  }, []);

  // Compute revenue/expense/profit metrics for the Profit tab from live data
  const metrics = useMemo(() => {
    if (!invoiceRecords.length && !requisitions.length && !purchaseOrders.length) {
      return { totalRevenue: 0, totalExpenses: 0, totalProfit: 0 };
    }

    // Align revenue with the Revenue tab: sum of paid/completed invoices
    const totalRevenue = invoiceRecords.reduce(
      (sum, r) => sum + (typeof r.total === 'number' ? r.total : 0),
      0
    );

    // Expenses from requisitions
    const relevantRequisitions = requisitions.filter((req) => {
      const rawStatus = (req.status || '').toString().toLowerCase();
      const allowedStatus =
        rawStatus === 'approved' || rawStatus === 'fulfilled' || rawStatus === 'pending';
      const dateSource = req.approvedDate || req.requiredDate || req.requestDate;
      return allowedStatus && !!dateSource;
    });

    const requisitionExpenses = relevantRequisitions.reduce(
      (sum, req) =>
        sum + (typeof req.totalEstimatedCost === 'number' ? req.totalEstimatedCost : 0),
      0
    );

    // Expenses from purchase orders
    const relevantPurchaseOrders = purchaseOrders.filter((po) => {
      const rawStatus = (po.status || '').toString().toLowerCase();
      const allowedStatus =
        rawStatus === 'approved' || rawStatus === 'received' || rawStatus === 'pending';
      const dateSource = po.approvedDate || po.expectedDelivery || po.orderDate;
      return allowedStatus && !!dateSource;
    });

    const purchaseOrderExpenses = relevantPurchaseOrders.reduce(
      (sum, po) => sum + (typeof po.totalAmount === 'number' ? po.totalAmount : 0),
      0
    );

    const totalExpenses = requisitionExpenses + purchaseOrderExpenses;
    const totalProfit = totalRevenue - totalExpenses;

    return { totalRevenue, totalExpenses, totalProfit };
  }, [invoiceRecords, requisitions, purchaseOrders, activeTimeframe]);

  // Cost analysis breakdown: derive category amounts from total expenses
  const costAnalysis = useMemo(() => {
    const total = metrics.totalExpenses;
    if (total <= 0) {
      return [] as {
        category: string;
        amount: number;
        percentage: number;
        trend: 'up' | 'down';
        change: string;
        color: string;
        icon: string;
        description: string;
        status: 'high' | 'medium' | 'low';
      }[];
    }

    // Split expenses into three high-level buckets for analysis
    const maintenanceAmount = Math.round(total * 0.3);
    const fnbAmount = Math.round(total * 0.45);
    const operationsAmount = Math.max(0, total - maintenanceAmount - fnbAmount);

    const makeItem = (
      category: string,
      amount: number,
      color: string,
      icon: string,
      description: string,
      status: 'high' | 'medium' | 'low'
    ) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      trend: 'up' as const,
      change: '+0.0%',
      color,
      icon,
      description,
      status,
    });

    return [
      makeItem('Maintenance', maintenanceAmount, '#F59E0B', '🛠️', 'Repairs, maintenance supplies, property upkeep', 'medium'),
      makeItem('Food & Beverage Costs', fnbAmount, '#8B5CF6', '🍽️', 'Ingredients, kitchen supplies, minibar and restaurant costs', 'medium'),
      makeItem('Operations', operationsAmount, '#10B981', '🏨', 'Front office, housekeeping, admin and other operating expenses', 'low'),
    ];
  }, [metrics.totalExpenses]);

  // Only keep Rooms and Food & Beverage departments; remove Events/Other Services.
  const departmentProfits = useMemo(() => {
    const roomsRevenue = Math.round(metrics.totalRevenue * 0.7);
    const roomsCosts = Math.round(metrics.totalExpenses * 0.4);
    const roomsProfit = roomsRevenue - roomsCosts;

    const fnbRevenue = Math.max(0, metrics.totalRevenue - roomsRevenue);
    const fnbCosts = Math.max(0, metrics.totalExpenses - roomsCosts);
    const fnbProfit = fnbRevenue - fnbCosts;

    return [
      {
        department: 'Rooms',
        revenue: roomsRevenue,
        costs: roomsCosts,
        profit: roomsProfit,
        margin: roomsRevenue > 0 ? (roomsProfit / roomsRevenue) * 100 : 0,
        status: roomsProfit >= 0 ? ('excellent' as const) : ('poor' as const),
      },
      {
        department: 'Food & Beverage',
        revenue: fnbRevenue,
        costs: fnbCosts,
        profit: fnbProfit,
        margin: fnbRevenue > 0 ? (fnbProfit / fnbRevenue) * 100 : 0,
        status: fnbProfit >= 0 ? ('good' as const) : ('poor' as const),
      },
    ];
  }, [metrics.totalRevenue, metrics.totalExpenses]);

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