import React from 'react';
import type { Payment } from './PaymentList';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

interface PaymentsActivityProps {
  payments: Payment[];
  isLoading: boolean;
}

const statusColor = (status: Payment['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'pending':
      return 'text-yellow-600';
    case 'failed':
      return 'text-red-600';
    case 'refunded':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const statusText = (p: Payment) => {
  switch (p.status) {
    case 'completed':
      return `${p.guestName} paid $${p.amount.toFixed(2)}`;
    case 'pending':
      return `${p.guestName} payment pending`;
    case 'failed':
      return `${p.guestName} payment failed`;
    case 'refunded':
      return `${p.guestName} refunded $${p.amount.toFixed(2)}`;
    default:
      return `${p.guestName} payment updated`;
  }
};

const PaymentsActivity: React.FC<PaymentsActivityProps> = ({ payments, isLoading }) => {
  // Sort by most recent first (descending order)
  const recent = [...payments].sort((a, b) => {
    const dateTimeA = new Date(`${a.transactionDate} ${a.transactionTime}`);
    const dateTimeB = new Date(`${b.transactionDate} ${b.transactionTime}`);
    return dateTimeB.getTime() - dateTimeA.getTime();
  });

  const totalItems = recent.length;

  if (isLoading) {
    return (
      <div className="relative flex flex-col w-full h-full overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-fade-in">
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}} .skeleton-shimmer{background:linear-gradient(90deg,#ececec 0%,#f5f5f5 50%,#ececec 100%);background-size:200% 100%;animation:shimmer 1.6s linear infinite;border-radius:6px}`}</style>
        {/* Header Skeleton - left icon, title, subtitle, search on the right */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-10 h-10 rounded-xl skeleton-shimmer" />
              <div>
                <Skeleton className="h-6 mb-2 rounded-md w-44 skeleton-shimmer" />
                <Skeleton className="h-3 rounded-md w-28 skeleton-shimmer" />
              </div>
            </div>

            <div className="hidden sm:block">
              <Skeleton className="w-56 rounded-full h-9 skeleton-shimmer" />
            </div>
          </div>
        </div>

  {/* Activity List Skeleton (mirrors final Recent Activity card) */}
  <div className="relative z-10 flex-1 px-6 py-6 space-y-4 overflow-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative p-3 bg-white border border-gray-200 rounded-xl">
              {/* Accent bar to the left */}
              <div className="absolute left-0 w-1 bg-gray-100 top-3 bottom-3 rounded-l-xl" />

              <div className="flex items-center gap-3 pl-3">
                {/* Icon */}
                <Skeleton className="w-10 h-10 rounded-lg skeleton-shimmer" />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-20 h-3 rounded-md skeleton-shimmer" />
                      <Skeleton className="w-28 h-2.5 rounded-md skeleton-shimmer" />
                    </div>
                    {/* Right side small ID */}
                    <Skeleton className="w-16 h-3 rounded-md skeleton-shimmer" />
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <Skeleton className="h-3 rounded-md w-36 skeleton-shimmer" />
                    <Skeleton className="w-20 h-3 rounded-md skeleton-shimmer" />
                  </div>
                </div>

                {/* Amount & time column */}
                <div className="flex flex-col items-end flex-shrink-0 gap-2">
                  <Skeleton className="w-16 h-4 rounded-md skeleton-shimmer" />
                  <Skeleton className="w-12 h-3 rounded-md skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`\n        @keyframes fade-in {\n          from {\n            opacity: 0;\n            transform: translateY(10px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n        \n        /* Keep the element visible after the animation and apply initial frame during delay */\n        .animate-fade-in {\n          animation: fade-in 0.5s ease-out;\n          animation-fill-mode: both; /* ensures initial keyframe applies during delay and final state persists */\n        }\n      `}</style>

      <div className="relative overflow-hidden transition-all duration-500 border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-fade-in">
        {/* Header - Matches PaymentList header size */}
        <div className="relative z-10 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-heritage-green">Recent Activity</h3>
              <p className="text-sm text-heritage-neutral/70">{totalItems} recent transactions</p>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="relative z-10 px-6 py-6 space-y-5 overflow-auto">
          {recent.map((p, index) => (
            <div
              key={p.id}
              className="relative p-2.5 transition-all duration-200 bg-white border border-gray-200 cursor-pointer rounded-xl hover:border-heritage-green/50 hover:shadow-sm group animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}>
              {/* Status Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                p.status === 'completed' ? 'bg-green-500' :
                p.status === 'pending' ? 'bg-yellow-500' :
                p.status === 'failed' ? 'bg-red-500' :
                'bg-blue-500'
              }`} />

              <div className="flex items-center gap-2.5 pl-2">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                  p.status === 'completed' ? 'bg-green-100' :
                  p.status === 'pending' ? 'bg-yellow-100' :
                  p.status === 'failed' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {p.status === 'completed' ? (
                    <svg className={`w-5 h-5 ${statusColor(p.status)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : p.status === 'pending' ? (
                    <svg className={`w-5 h-5 ${statusColor(p.status)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : p.status === 'failed' ? (
                    <svg className={`w-5 h-5 ${statusColor(p.status)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className={`w-5 h-5 ${statusColor(p.status)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Status Badge & ID */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      p.status === 'completed' ? 'bg-green-500 text-white' :
                      p.status === 'pending' ? 'bg-yellow-500 text-white' :
                      p.status === 'failed' ? 'bg-red-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {p.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{p.id}</span>
                  </div>

                  {/* Guest Name */}
                  <p className="mb-0.5 text-sm font-semibold text-gray-900 truncate">{p.guestName}</p>
                  {/* Short textual summary for accessibility and to use helper */}
                  <p className="text-[12px] text-gray-500 truncate">{statusText(p)}</p>

                  {/* Room & Payment Method */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">Room {p.roomNumber}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 capitalize">
                      <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>{p.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Time */}
                <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                  <span className={`text-sm font-bold ${statusColor(p.status)}`}>
                    {p.status === 'refunded' ? '-' : ''}${p.amount.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] text-gray-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{p.transactionTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PaymentsActivity;
export { PaymentsActivity };
