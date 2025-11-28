import React, { useEffect, useMemo, useState } from 'react';
import { formatCurrencyPH } from '../../../lib/utils';
import { subscribeToInvoices, type InvoiceRecord } from '../../../backend/invoices/invoicesService';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../backend/requisitions/requisitionsService';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord } from '../../../backend/purchaseOrders/purchaseOrdersService';
import { expenses as seedExpenses } from '../expenses/expensesData';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
}

const DashboardStats: React.FC = () => {
  const [invoiceRecords, setInvoiceRecords] = useState<InvoiceRecord[]>([]);
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToInvoices(
      (records) => {
        const paid = records.filter((r) => r.status === 'paid' || r.status === 'completed');
        setInvoiceRecords(paid);
      },
      (error) => {
        console.error('Error loading invoices for dashboard stats:', error);
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
        console.error('Error loading requisitions for dashboard stats:', error);
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
        console.error('Error loading purchase orders for dashboard stats:', error);
      }
    );
    return unsubscribe;
  }, []);

  const metrics = useMemo(() => {
    // Revenue: all paid/completed invoices
    const totalRevenue = invoiceRecords.reduce(
      (sum, r) => sum + (typeof r.total === 'number' ? r.total : 0),
      0
    );

    // Base/manual expenses from expensesData: only approved + paid
    const baseApprovedPaid = seedExpenses
      .filter((e) => e.status === 'approved' || e.status === 'paid')
      .reduce((sum, e) => sum + (typeof e.amount === 'number' ? e.amount : 0), 0);

    // Requisition expenses mapped to statuses like in ExpensesPage
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

    // Purchase order expenses mapped to statuses like in ExpensesPage
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

    const totalExpenses = baseApprovedPaid + requisitionApprovedPaid + purchaseOrderApprovedPaid;
    const totalProfit = totalRevenue - totalExpenses;

    return { totalRevenue, totalExpenses, totalProfit };
  }, [invoiceRecords, requisitions, purchaseOrders]);

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: formatCurrencyPH(metrics.totalRevenue),
      change: '+0.0% from last month',
      changeType: 'positive',
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Net Profit',
      value: formatCurrencyPH(metrics.totalProfit),
      change: '+8.3% from last month',
      changeType: 'positive',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Total Expenses',
      value: formatCurrencyPH(metrics.totalExpenses),
      change: '+2.1% from last month',
      changeType: 'positive',
      iconBg: 'bg-orange-100',
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative p-8 overflow-hidden transition-all duration-500 border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 hover:shadow-2xl hover:-translate-y-1 group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Glass morphism effect */}
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-[#82A33D]/10 to-transparent"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#82A33D]/5 to-transparent"></div>
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 15px 15px, rgba(130, 163, 61, 0.2) 2px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
          
          {/* Content container */}
          <div className="relative flex items-start justify-between">
            {/* Left side - text content */}
            <div className="flex-1 mr-5">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">{stat.title}</p>
              </div>
              
              <div className="relative">
                <p className="mb-3 text-4xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">{stat.value}</p>
                <div className="absolute -right-1 -top-1 w-8 h-8 bg-[#82A33D]/5 rounded-full blur-md -z-10 group-hover:bg-[#82A33D]/10 transition-colors duration-300"></div>
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                stat.changeType === 'positive' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                  : stat.changeType === 'negative' 
                  ? 'bg-red-50 text-red-700 border border-red-200/50' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200/50'
              }`}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    stat.changeType === 'positive' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V8"
                  } />
                </svg>
                {stat.change}
              </div>
            </div>
            
            {/* Right side - icon */}
            <div className="relative">
              <div className={`w-16 h-16 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                {stat.icon}
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-xl from-white/40"></div>
              </div>
              
              {/* Subtle glow effect on hover */}
              <div className="absolute transition-all duration-300 opacity-0 -inset-1 bg-gradient-to-r from-[#82A33D]/20 to-emerald-400/20 rounded-xl blur-md group-hover:opacity-100"></div>
            </div>
          </div>
          
          {/* Bottom progress indicator - different for each card */}
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div 
              className={`h-full ${
                index === 0 ? 'bg-gradient-to-r from-[#82A33D] to-emerald-400' :
                index === 1 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                'bg-gradient-to-r from-purple-400 to-purple-600'
              }`}
              style={{ width: `${(index + 1) * 25}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
export { DashboardStats };