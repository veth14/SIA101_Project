import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/universalLoader/SkeletonLoader';
import type { Expense } from './types';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
}

const currency = (n: number) => `$${n.toFixed(2)}`;

type Props = { expenses: Expense[] };

const computeTotals = (items: Expense[]) => ({
  pending: items.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
  approved: items.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
  paid: items.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0),
  rejected: items.filter(e => e.status === 'rejected').reduce((s, e) => s + e.amount, 0),
});

// stats are built inside the component where totals are known

const ExpensesStats: React.FC<Props> = ({ expenses }) => {
  const [isLoading, setIsLoading] = useState(true);
  const totals = computeTotals(expenses);
  const overall = Object.values(totals).reduce((s, v) => s + v, 0);
  const stats: StatCard[] = [
    {
      title: 'Pending',
      value: currency(totals.pending),
      change: 'Awaiting approval',
      changeType: 'neutral',
      iconBg: 'bg-yellow-100',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Approved',
      value: currency(totals.approved),
      change: 'Ready for payment',
      changeType: 'positive',
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: 'Paid',
      value: currency(totals.paid),
      change: 'Completed payments',
      changeType: 'positive',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.105 0-2 .672-2 1.5S10.895 11 12 11s2 .672 2 1.5S13.105 14 12 14m0-6v8m0 0v1m0-1c-1.105 0-2-.672-2-1.5" />
        </svg>
      )
    },
    {
      title: 'Rejected',
      value: currency(totals.rejected),
      change: 'Not approved',
      changeType: 'negative',
      iconBg: 'bg-red-100',
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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

  // Include Overall Total as a separate card at the end
  const displayStats: StatCard[] = [
    ...stats,
    {
      title: 'Overall Total',
      value: currency(overall),
      change: 'Sum of all amounts',
      changeType: 'neutral',
      iconBg: 'bg-gray-100',
      icon: (
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
      {displayStats.map((stat, index) => (
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
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 15px 15px, rgba(130, 163, 61, 0.2) 2px, transparent 0)',
              backgroundSize: '30px 30px'
            }}
          ></div>

          {/* Content container */}
          <div className="relative flex items-start justify-between">
            {/* Left side - text content */}
            <div className="flex-1 mr-5">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">{stat.title}</p>
              </div>

              <div className="relative">
                <p className="mb-3 text-4xl font-extrabold text-[#82A33D] transition-transform duration-300 group-hover:scale-105">{stat.value}</p>
                <div className="absolute -right-1 -top-1 w-8 h-8 bg-[#82A33D]/5 rounded-full blur-md -z-10 transition-colors duration-300 group-hover:bg-[#82A33D]/10"></div>
              </div>

              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  stat.changeType === 'positive'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                    : stat.changeType === 'negative'
                    ? 'bg-red-50 text-red-700 border border-red-200/50'
                    : 'bg-gray-50 text-gray-700 border border-gray-200/50'
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.changeType === 'positive' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V8'}
                  />
                </svg>
                {stat.change}
              </div>
            </div>

            {/* Right side - icon */}
            <div className="relative">
              <div
                className={`w-16 h-16 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-md border border-white/70 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}
              >
                {stat.icon}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl"></div>
              </div>

              {/* Subtle glow effect on hover */}
              <div className="absolute transition-all duration-300 opacity-0 -inset-1 bg-gradient-to-r from-[#82A33D]/20 to-emerald-400/20 rounded-xl blur-md group-hover:opacity-100"></div>
            </div>
          </div>

          {/* Bottom progress indicator - different for each card */}
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div
              className={`h-full ${
                index % 5 === 0
                  ? 'bg-gradient-to-r from-[#82A33D] to-emerald-400'
                  : index % 5 === 1
                  ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                  : index % 5 === 2
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                  : index % 5 === 3
                  ? 'bg-gradient-to-r from-red-400 to-red-600'
                  : 'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}
              style={{ width: `${(index + 1) * 25}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpensesStats;
export { ExpensesStats };
