import React from 'react';
import type { Invoice } from './InvoiceList';

interface InvoiceStatsProps {
  invoices: Invoice[];
  isLoading: boolean;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
  count: number;
}

const InvoiceStats: React.FC<InvoiceStatsProps> = ({ invoices, isLoading }) => {

  // Calculate stats
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const stats: StatCard[] = [
    {
      title: 'Paid Invoices',
      value: `$${paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}`,
      change: `+${((paidInvoices.length / invoices.length) * 100).toFixed(1)}% from last month`,
      changeType: 'positive',
      iconBg: 'bg-emerald-100',
      count: paidInvoices.length,
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: 'Pending',
      value: `$${pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}`,
      change: `+${((pendingInvoices.length / invoices.length) * 100).toFixed(1)}% from last month`,
      changeType: 'neutral',
      iconBg: 'bg-amber-100',
      count: pendingInvoices.length,
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Overdue',
      value: `$${overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}`,
      change: `-${((overdueInvoices.length / invoices.length) * 100).toFixed(1)}% from last month`,
      changeType: 'negative',
      iconBg: 'bg-red-100',
      count: overdueInvoices.length,
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      change: `+12.5% from last month`,
      changeType: 'positive',
      iconBg: 'bg-green-100',
      count: invoices.length,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative p-6 overflow-hidden border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="w-24 h-4 mb-2 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-8 mb-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-full h-1 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative p-6 overflow-hidden transition-all duration-300 border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50 hover:shadow-xl group"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-[#82A33D]/20 to-transparent"></div>
          
          {/* Content */}
          <div className="relative">
            {/* Header with title and icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    index === 0 ? 'bg-emerald-500' :
                    index === 1 ? 'bg-amber-500' :
                    index === 2 ? 'bg-red-500' : 
                    'bg-green-500'
                  }`}></div>
                  <h3 className="text-sm font-semibold text-gray-700">{stat.title}</h3>
                </div>
                
                {/* Value */}
                <div className="mb-3">
                  <p className="text-3xl font-bold text-[#82A33D]">{stat.value}</p>
                </div>
                
                {/* Change indicator */}
                <div className="flex items-center text-xs">
                  <svg 
                    className={`w-3 h-3 mr-1 ${
                      stat.changeType === 'positive' ? 'text-emerald-600' :
                      stat.changeType === 'negative' ? 'text-red-600' :
                      'text-gray-600'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={stat.changeType === 'positive' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V8"} 
                    />
                  </svg>
                  <span className={`font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <div className="w-6 h-6">
                  {stat.icon}
                </div>
              </div>
            </div>
            
            {/* Bottom progress bar */}
            <div className="w-full h-1 overflow-hidden bg-gray-100 rounded-full">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  index === 0 ? 'bg-emerald-500' :
                  index === 1 ? 'bg-amber-500' :
                  index === 2 ? 'bg-red-500' : 
                  'bg-green-500'
                }`}
                style={{ 
                  width: `${(index + 1) * 25}%`,
                  animationDelay: `${index * 200}ms`
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceStats;