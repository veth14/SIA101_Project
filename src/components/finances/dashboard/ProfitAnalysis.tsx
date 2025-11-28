import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  calculateChartMetrics, 
  formatCurrency 
} from './chartsLogic/revenueAnalyticsLogic';
import { subscribeToInvoices, type InvoiceRecord } from '../../../backend/invoices/invoicesService';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../backend/requisitions/requisitionsService';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord } from '../../../backend/purchaseOrders/purchaseOrdersService';
import { expenses as seedExpenses } from '../expenses/expensesData';

interface RevenuePoint {
  date: string;
  amount: number;
}

const ProfitAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [invoiceRecords, setInvoiceRecords] = useState<InvoiceRecord[]>([]);
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);

  // Subscribe to revenue and expense sources
  useEffect(() => {
    const unsubscribe = subscribeToInvoices(
      (records) => {
        const paid = records.filter((r) => r.status === 'paid' || r.status === 'completed');
        setInvoiceRecords(paid);
      },
      (error) => {
        console.error('Error loading invoices for profit overview:', error);
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
        console.error('Error loading requisitions for profit overview:', error);
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
        console.error('Error loading purchase orders for profit overview:', error);
      }
    );
    return unsubscribe;
  }, []);

  const revenuePoints: RevenuePoint[] = useMemo(
    () =>
      invoiceRecords.map((record) => ({
        date:
          record.transactionDate ||
          record.dueDate ||
          (record.createdAt ? record.createdAt.toISOString().split('T')[0] : ''),
        amount: typeof record.total === 'number' ? record.total : 0,
      })),
    [invoiceRecords]
  );

  const revenueData = useMemo(
    () => revenuePoints.map((p) => ({ day: p.date, revenue: p.amount })),
    [revenuePoints]
  );

  const revenueMetrics = useMemo(
    () =>
      calculateChartMetrics(
        revenueData.map((item) => ({
          day: item.day,
          revenue: item.revenue,
          expenses: 0,
          profit: item.revenue,
        }))
      ),
    [revenueData]
  );

  // Expenses: match Expense Management definition (approved + paid only)
  const totalExpenses = useMemo(() => {
    // Base/manual expenses from seed data
    const baseApprovedPaid = seedExpenses
      .filter((e) => e.status === 'approved' || e.status === 'paid')
      .reduce((sum, e) => sum + (typeof e.amount === 'number' ? e.amount : 0), 0);

    // Requisitions mapped to statuses approved/paid
    let requisitionApprovedPaid = 0;
    requisitions.forEach((req) => {
      const rawStatus = (req.status || '').toString().toLowerCase();
      let status: 'approved' | 'paid' | 'rejected' | 'pending';
      if (rawStatus === 'approved') status = 'approved';
      else if (rawStatus === 'fulfilled') status = 'paid';
      else if (rawStatus === 'rejected') status = 'rejected';
      else status = 'pending';

      if (status === 'approved' || status === 'paid') {
        const amount = typeof req.totalEstimatedCost === 'number' ? req.totalEstimatedCost : 0;
        requisitionApprovedPaid += amount;
      }
    });

    // Purchase orders mapped to statuses approved/paid
    let purchaseOrderApprovedPaid = 0;
    purchaseOrders.forEach((po) => {
      const rawStatus = (po.status || '').toString().toLowerCase();
      let status: 'approved' | 'paid' | 'rejected' | 'pending';
      if (rawStatus === 'approved') status = 'approved';
      else if (rawStatus === 'received') status = 'paid';
      else if (rawStatus === 'cancelled') status = 'rejected';
      else status = 'pending';

      if (status === 'approved' || status === 'paid') {
        const amount = typeof po.totalAmount === 'number' ? po.totalAmount : 0;
        purchaseOrderApprovedPaid += amount;
      }
    });

    return baseApprovedPaid + requisitionApprovedPaid + purchaseOrderApprovedPaid;
  }, [requisitions, purchaseOrders]);

  const totalRevenue = revenueMetrics.totalRevenue;
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const expensesShare = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const now = new Date();
  const currentMonthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

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
                  <span className="text-sm font-bold text-heritage-green">{currentMonthLabel}</span>
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
        <div className="px-8 py-4 md:py-5">
          {/* Profit Metrics */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
            {/* Profit Margin */}
            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-heritage-light/30">
              <div className="mb-2 text-sm text-gray-500">Profit Margin</div>
              <div className="mb-1 text-2xl font-black text-heritage-green">
                {profitMargin.toFixed(1)}%
              </div>
              <div className="flex items-center text-sm font-medium text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {formatCurrency(totalProfit)} net profit
              </div>
            </div>

            {/* Expense Ratio */}
            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-red-200/30">
              <div className="mb-2 text-sm text-gray-500">Expense Ratio</div>
              <div className="mb-1 text-2xl font-black text-red-600">
                {expensesShare.toFixed(1)}%
              </div>
              <div className="flex items-center text-sm font-medium text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                {formatCurrency(totalExpenses)} total expenses
              </div>
            </div>

            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-blue-200/30">
              <div className="mb-2 text-sm text-gray-500">Average Revenue</div>
              <div className="mb-1 text-2xl font-black text-blue-600">
                {formatCurrency(revenueMetrics.averageRevenue)}
              </div>
              <div className="text-sm text-gray-500">
                Per period
              </div>
            </div>

            <div className="p-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-xl border-purple-200/30">
              <div className="mb-2 text-sm text-gray-500">Projected Revenue</div>
              <div className="mb-1 text-2xl font-black text-purple-600">
                {formatCurrency(revenueMetrics.projectedRevenue)}
              </div>
              <div className="text-sm text-gray-500">
                Next period
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="p-4 md:p-5 border border-gray-100 shadow-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h4 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Quick Insights</h4>
              <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
                Snapshot of current performance
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-2">
              {/* Rooms Department */}
              <div className="flex items-start gap-3 p-3 transition-all duration-200 bg-white/70 border border-emerald-50 rounded-xl hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-sm">
                  <span className="text-xs font-bold text-white">RM</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Rooms Department</div>
                  <div className="text-xs font-medium text-emerald-700">Highest profit margin at 58.3%</div>
                </div>
              </div>

              {/* F&B Department */}
              <div className="flex items-start gap-3 p-3 transition-all duration-200 bg-white/70 border border-red-50 rounded-xl hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-400 shadow-sm">
                  <span className="text-xs font-bold text-white">F&B</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">F&amp;B Department</div>
                  <div className="text-xs font-medium text-red-600">Needs attention: -20% margin</div>
                </div>
              </div>

              {/* Net Profit Highlight */}
              <div className="flex items-start gap-3 p-3 transition-all duration-200 bg-white/70 border border-blue-50 rounded-xl hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 shadow-sm">
                  <span className="text-xs font-bold text-white">NP</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Net Profit</div>
                  <div className="text-xs font-medium text-blue-700">
                    {formatCurrency(totalProfit)} at {profitMargin.toFixed(1)}% margin
                  </div>
                </div>
              </div>

              {/* Growth Rate */}
              <div className="flex items-start gap-3 p-3 transition-all duration-200 bg-white/70 border border-amber-50 rounded-xl hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 shadow-sm">
                  <span className="text-xs font-bold text-white">GR</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Growth Rate</div>
                  <div className="text-xs font-medium text-amber-700">{revenueMetrics.growthRate.toFixed(1)}% this period</div>
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