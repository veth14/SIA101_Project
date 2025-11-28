import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrencyPH, formatShortCurrencyPH } from '../../../lib/utils';
import { subscribeToInvoices, type InvoiceRecord } from '../../../backend/invoices/invoicesService';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../backend/requisitions/requisitionsService';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord } from '../../../backend/purchaseOrders/purchaseOrdersService';

// Workaround: Recharts JSX types sometimes conflict with the project's React typings.
// Create safe aliases typed as React.ComponentType<any> and use them in JSX to avoid typing issues.
const RResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<Record<string, unknown>>;
const RAreaChart = AreaChart as unknown as React.ComponentType<Record<string, unknown>>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<Record<string, unknown>>;
const RTooltip = Tooltip as unknown as React.ComponentType<Record<string, unknown>>;
const RArea = Area as unknown as React.ComponentType<Record<string, unknown>>;

// Tooltip payload shape used by Recharts tooltip entries
interface TooltipPayload {
  dataKey: string;
  value: number;
  color?: string;
}

const formatCurrency = formatCurrencyPH;
const formatShortCurrency = formatShortCurrencyPH;

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <div key={`tooltip-${String(index)}`} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 capitalize">{entry.dataKey}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ProfitTrendsChartProps {
  className?: string;
}

const ProfitTrendsChart: React.FC<ProfitTrendsChartProps> = ({ className = "" }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const currentMonthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
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
        console.error('Error loading invoices for profit analysis chart:', error);
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
        console.error('Error loading requisitions for profit analysis chart:', error);
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
        console.error('Error loading purchase orders for profit analysis chart:', error);
      }
    );

    return unsubscribe;
  }, []);
  
  // Build profit data from live invoices (revenue) and requisitions/POs (expenses)
  const profitData = useMemo(() => {
    // Helper to accumulate revenue/expenses per key
    type Bucket = { revenue: number; expenses: number; profit: number };
    const buckets = new Map<string, Bucket>();

    const ensureBucket = (key: string): Bucket => {
      const existing = buckets.get(key);
      if (existing) return existing;
      const created: Bucket = { revenue: 0, expenses: 0, profit: 0 };
      buckets.set(key, created);
      return created;
    };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const withinScope = (d: Date) => {
      if (activeTimeframe === 'yearly') {
        // For year view, include all data for the current year only
        return d.getFullYear() === currentYear;
      }
      // For month view, restrict to the current month of the current year
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    };

    // Revenue from invoices
    invoiceRecords.forEach((record) => {
      const rawDate = record.transactionDate || record.dueDate || record.createdAt?.toISOString().split('T')[0];
      if (!rawDate) return;
      const d = new Date(rawDate);
      if (Number.isNaN(d.getTime()) || !withinScope(d)) return;

      let key: string;
      if (activeTimeframe === 'yearly') {
        // Bucket by month index (0-11) for year view
        key = String(d.getMonth());
      } else {
        const dayOfMonth = d.getDate();
        const weekOfMonth = Math.min(5, Math.floor((dayOfMonth - 1) / 7) + 1);
        key = `Week ${weekOfMonth}`;
      }

      const bucket = ensureBucket(key);
      const amount = typeof record.total === 'number' ? record.total : 0;
      bucket.revenue += amount;
      bucket.profit = bucket.revenue - bucket.expenses;
    });

    // Expenses from requisitions
    requisitions.forEach((req) => {
      const rawStatus = (req.status || '').toString().toLowerCase();
      const allowedStatus = rawStatus === 'approved' || rawStatus === 'fulfilled' || rawStatus === 'pending';
      if (!allowedStatus) return;
      const dateSource = req.approvedDate || req.requiredDate || req.requestDate;
      if (!dateSource) return;
      const d = new Date(dateSource as unknown as string);
      if (Number.isNaN(d.getTime()) || !withinScope(d)) return;

      let key: string;
      if (activeTimeframe === 'yearly') {
        key = String(d.getMonth());
      } else {
        const dayOfMonth = d.getDate();
        const weekOfMonth = Math.min(5, Math.floor((dayOfMonth - 1) / 7) + 1);
        key = `Week ${weekOfMonth}`;
      }

      const bucket = ensureBucket(key);
      const amount = typeof req.totalEstimatedCost === 'number' ? req.totalEstimatedCost : 0;
      bucket.expenses += amount;
      bucket.profit = bucket.revenue - bucket.expenses;
    });

    // Expenses from purchase orders
    purchaseOrders.forEach((po) => {
      const rawStatus = (po.status || '').toString().toLowerCase();
      const allowedStatus = rawStatus === 'approved' || rawStatus === 'received' || rawStatus === 'pending';
      if (!allowedStatus) return;
      const dateSource = po.approvedDate || po.expectedDelivery || po.orderDate;
      if (!dateSource) return;
      const d = new Date(dateSource as unknown as string);
      if (Number.isNaN(d.getTime()) || !withinScope(d)) return;

      let key: string;
      if (activeTimeframe === 'yearly') {
        key = String(d.getFullYear());
      } else {
        const dayOfMonth = d.getDate();
        const weekOfMonth = Math.min(5, Math.floor((dayOfMonth - 1) / 7) + 1);
        key = `Week ${weekOfMonth}`;
      }

      const bucket = ensureBucket(key);
      const amount = typeof po.totalAmount === 'number' ? po.totalAmount : 0;
      bucket.expenses += amount;
      bucket.profit = bucket.revenue - bucket.expenses;
    });

    // Order buckets for chart
    if (activeTimeframe === 'yearly') {
      // Aggregate by month name within the current year
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames.map((label, index) => {
        const key = String(index); // use month index as bucket key
        const bucket = buckets.get(key) || { revenue: 0, expenses: 0, profit: 0 };
        const displayProfit = Math.max(0, bucket.profit);
        return { period: label, ...bucket, displayProfit };
      });
    }

    // Monthly: always show Week 1..Week N (4 or 5) for the current month
    const sampleDate = invoiceRecords[0]?.transactionDate
      ? new Date(invoiceRecords[0].transactionDate as string)
      : new Date();
    const year = sampleDate.getFullYear();
    const monthIndex = sampleDate.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const maxWeek = Math.min(5, Math.ceil(daysInMonth / 7));

    const result: { period: string; revenue: number; expenses: number; profit: number; displayProfit: number }[] = [];
    for (let week = 1; week <= maxWeek; week++) {
      const key = `Week ${week}`;
      const bucket = buckets.get(key) || { revenue: 0, expenses: 0, profit: 0 };
      const displayProfit = Math.max(0, bucket.profit);
      result.push({ period: key, ...bucket, displayProfit });
    }
    return result;
  }, [invoiceRecords, requisitions, purchaseOrders, activeTimeframe]);
  
  const metrics = useMemo(() => {
    const totalRevenue = profitData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = profitData.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
    const averageProfit = totalProfit / profitData.length;
    const maxProfit = Math.max(...profitData.map(item => item.profit));
    const maxProfitPeriod = profitData.find(item => item.profit === maxProfit)?.period || '';
    const profitMargin = (totalProfit / totalRevenue) * 100;
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageProfit,
      maxProfit,
      maxProfitPeriod,
      profitMargin
    };
  }, [profitData]);

  const yAxisDomain = useMemo(() => {
    if (!profitData.length) return [0, 0] as [number, number];
    const profits = profitData.map((p) => p.profit);
    const dataMax = Math.max(...profits, 0);

    // Small padding so line is not stuck to the top
    const padding = Math.max(1, Math.round(dataMax * 0.05));

    return [0, dataMax + padding] as [number, number];
  }, [profitData]);

  // Render immediately — removed artificial loading/skeleton

  const isProfitable = metrics.totalProfit > 0;

  return (
    <div className={`overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-[#82A33D]" />
                </div>
                <div className={`absolute -inset-2 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${
                  isProfitable 
                    ? 'bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20' 
                    : 'bg-gradient-to-r from-red-500/20 to-red-600/20'
                }`}></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Profit Analysis
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Performance Metrics</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                  <span className="text-sm font-bold text-heritage-green">{currentMonthLabel}</span>
                </div>
              </div>
            </div>
            
            {/* Toggle Buttons */}
            <div className="flex space-x-4">
              <div className="flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl shadow-inner backdrop-blur-sm border border-heritage-light/30">
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'monthly' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('monthly')}
                >
                  Month
                </button>
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'yearly' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('yearly')}
                >
                  Year
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Area */}
        <div className="px-4 py-6">
          <div className="h-[320px] w-full">
            <RResponsiveContainer width="100%" height="100%">
              <RAreaChart
                data={profitData}
                margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A33D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ABAD8A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <RXAxis 
                  dataKey="period" 
                  tick={{ fill: '#82A33D', fontSize: 12 }}
                  axisLine={{ stroke: '#82A33D', strokeWidth: 1 }}
                  tickLine={false}
                  interval={0}
                  padding={{ left: 0, right: 0 }}
                />

                <RYAxis 
                  tickFormatter={formatShortCurrency}
                  tick={{ fill: '#82A33D', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={yAxisDomain as unknown as [number, number]}
                />

                <RCartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#ABAD8A" 
                />
                <RTooltip content={<CustomTooltip />} />

                {/* Profit Area - Primary (Top Layer) */}
                <RArea 
                  type="linear" 
                  dataKey="displayProfit" 
                  stroke="#82A33D" 
                  fillOpacity={1}
                  fill="url(#colorProfit)" 
                  strokeWidth={3}
                  baseValue={0}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#ABAD8A',
                    strokeWidth: 2,
                    fill: 'white'
                  }}
                />
                
                {/* Expenses removed — use the dedicated Expenses page for expense charts */}
              </RAreaChart>
            </RResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center pb-2 mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-heritage-green rounded"></div>
              <span className="font-semibold">Net Profit</span>
            </div>
          </div>
        </div>
        
        {/* Stats and Insights Section */}
          <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Total Profit</div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-heritage-green' : 'text-red-600'}`}>
              {formatCurrency(metrics.totalProfit)}
            </div>
            <div className={`flex gap-1 items-center mt-1 text-xs font-medium ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isProfitable ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
              </svg>
              <span>{metrics.profitMargin.toFixed(1)}% margin</span>
            </div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Average Profit</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics.averageProfit)}
            </div>
            <div className="text-xs text-gray-500">
              Per {activeTimeframe === 'monthly' ? 'week' : 'year'}
            </div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Best Period</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics.maxProfit)}
            </div>
            <div className="text-xs text-gray-500">{metrics.maxProfitPeriod}</div>
          </div>

          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Projected</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics.totalProfit * 1.08)}
            </div>
            <div className="text-xs text-gray-500">Next period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitTrendsChart;
