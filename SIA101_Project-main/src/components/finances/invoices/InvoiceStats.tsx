import React from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';
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
      value: `$${paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      change: `${paidInvoices.length} invoices paid`,
      changeType: 'positive',
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: 'Pending',
      value: `$${pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      change: `${pendingInvoices.length} awaiting payment`,
      changeType: 'neutral',
      iconBg: 'bg-yellow-100',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Overdue',
      value: `$${overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      change: `${overdueInvoices.length} past due`,
      changeType: 'negative',
      iconBg: 'bg-red-100',
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      change: `${invoices.length} total invoices`,
      changeType: 'positive',
      iconBg: 'bg-purple-100',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative p-8 overflow-hidden border shadow-lg rounded-2xl backdrop-blur-xl bg-white/95 border-white/50">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-5">
                <div className="flex items-center mb-3">
                  <Skeleton className="w-1 h-5 mr-2 rounded-full" />
                  <Skeleton className="w-24 h-4" />
                </div>
                <Skeleton className="h-10 mb-3 w-28" />
                <Skeleton className="w-32 h-6 rounded-full" />
              </div>
              <Skeleton className="w-16 h-16 rounded-xl" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <Skeleton className="w-full h-full" />
            </div>
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

export default InvoiceStats;