import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

interface PaymentsStatsProps {
  payments: Array<{
    status: string;
    amount: number;
  }>;
}

const statsConfig = [
  {
    title: 'Completed',
    status: 'completed',
    iconBg: 'bg-green-100',
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  },
  {
    title: 'Pending',
    status: 'pending',
    iconBg: 'bg-yellow-100',
    icon: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
      </svg>
    )
  },
  {
    title: 'Failed',
    status: 'failed',
    iconBg: 'bg-red-100',
    icon: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  },
  {
    title: 'Refunded',
    status: 'refunded',
    iconBg: 'bg-blue-100',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  }
];

const PaymentsStats: React.FC<PaymentsStatsProps> = ({ payments }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalCount = payments.length || 1;
  const stats = statsConfig.map((cfg) => {
    const subset = payments.filter(p => p.status === cfg.status);
    const valueAmount = subset.reduce((sum, p) => sum + p.amount, 0);
    const percent = Math.round((subset.length / totalCount) * 100);
    let changeType: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (cfg.status === 'completed') changeType = 'positive';
    if (cfg.status === 'failed') changeType = 'negative';
    // Pending and refunded are neutral
    return {
      ...cfg,
      value: `$${valueAmount.toFixed(2)}`,
      change: `${percent}% of payments`,
      changeType,
    };
  });

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
          <div className="absolute inset-0 transition-opacity duration-500 opacity-40 bg-gradient-to-br from-[#82A33D]/5 via-white/80 to-[#82A33D]/10 rounded-2xl group-hover:opacity-70"></div>
          <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-[#82A33D]/10 to-transparent"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#82A33D]/5 to-transparent"></div>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 15px 15px, rgba(130, 163, 61, 0.2) 2px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-5">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 mr-2 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wide text-gray-700">{stat.title}</p>
              </div>
              <div className="relative">
                <p className="mb-3 text-4xl font-extrabold text-[#82A33D] group-hover:scale-105 transition-transform duration-300">{stat.value}</p>
                <div className="absolute -right-1 -top-1 w-8 h-8 bg-[#82A33D]/5 rounded-full blur-md -z-10 group-hover:bg-[#82A33D]/10 transition-colors duration-300"></div>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm border transition-all duration-300 ${
                  stat.changeType === 'positive'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                    : stat.changeType === 'negative'
                    ? 'bg-red-50 text-red-700 border-red-200/70'
                    : 'bg-gray-50 text-gray-700 border-gray-200/70'
                }`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                      stat.changeType === 'positive' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V8"
                    } />
                  </svg>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="relative">
              <div className={`w-16 h-16 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-md border border-white/70 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                {stat.icon}
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-xl from-white/40"></div>
              </div>
              <div className="absolute transition-all duration-300 opacity-0 -inset-1 bg-gradient-to-r from-[#82A33D]/20 to-emerald-400/20 rounded-xl blur-md group-hover:opacity-100"></div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div 
              className={`h-full ${
                index === 0 ? 'bg-gradient-to-r from-[#82A33D] to-emerald-400' :
                index === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                index === 2 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}
              style={{ width: `${(index + 1) * 25}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentsStats;
export { PaymentsStats };
