import React from 'react';
import type { Payment } from './PaymentList';

interface PaymentsActivityProps {
  payments: Payment[];
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

const PaymentsActivity: React.FC<PaymentsActivityProps> = ({ payments }) => {
  const recent = [...payments]
    .sort((a, b) => `${b.transactionDate} ${b.transactionTime}`.localeCompare(`${a.transactionDate} ${a.transactionTime}`));

  const totalItems = recent.length;

  return (
    <div className="flex flex-col w-full min-h-full py-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 shadow bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-heritage-green">Recent Activity</h3>
              <p className="text-xs text-heritage-neutral/70">{totalItems} events</p>
            </div>
          </div>
          <button className="flex items-center px-3 py-1 space-x-2 text-xs transition-all duration-300 border rounded-lg shadow-sm border-heritage-green/30 bg-white/90 text-heritage-green hover:bg-heritage-green hover:text-white hover:shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
            </svg>
            <span className="font-medium">Export Log</span>
          </button>
        </div>
      </div>

      {/* List fills available space */}
      <div className="flex-1 overflow-auto">
        <ul className="px-2 py-2 space-y-2">
          {recent.map((p) => (
            <li key={p.id} className={`relative flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer transition-all duration-200 bg-gradient-to-r from-[#82A33D]/5 via-white to-white hover:shadow-lg hover:border-[#82A33D]/40`}>
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
                style={{
                  background: p.status === 'completed' ? 'linear-gradient(to bottom, #82A33D, #22c55e)' :
                              p.status === 'pending' ? 'linear-gradient(to bottom, #facc15, #eab308)' :
                              p.status === 'failed' ? 'linear-gradient(to bottom, #ef4444, #dc2626)' :
                              p.status === 'refunded' ? 'linear-gradient(to bottom, #3b82f6, #2563eb)' :
                              '#d1d5db'
                }}
              />
              <div className="flex items-center gap-3 min-w-[100px]">
                <span className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 text-lg font-bold ${statusColor(p.status)}`}>{
                  p.status === 'completed' ? <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> :
                  p.status === 'pending' ? <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg> :
                  p.status === 'failed' ? <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> :
                  p.status === 'refunded' ? <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> :
                  <span>●</span>
                }</span>
                <div>
                  <p className="mb-1 text-base font-semibold tracking-tight text-gray-900">{statusText(p)}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span className="inline-block px-2 py-1 border border-gray-200 rounded bg-gray-50">Room {p.roomNumber}</span>
                    <span className="inline-block px-2 py-1 capitalize border border-gray-200 rounded bg-gray-50">{p.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end min-w-[100px]">
                <span className={`text-xl font-bold tracking-wide ${
                  p.status === 'refunded' ? 'text-blue-600' : 
                  p.status === 'failed' ? 'text-red-600' : 'text-heritage-green'
                }`}>
                  {p.status === 'refunded' ? '-' : ''}{p.status === 'refunded' ? `-$${p.amount.toFixed(2)}` : p.status === 'failed' ? `$${p.amount.toFixed(2)}` : p.status === 'completed' ? `$${p.amount.toFixed(2)}` : ''}
                </span>
                <span className="text-[11px] text-gray-400">{p.id}</span>
                <span className="text-xs text-gray-500">{p.transactionDate} {p.transactionTime}</span>
              </div>
            </li>
          ))}
        </ul>
  </div>

    </div>
  );
};

export default PaymentsActivity;
export { PaymentsActivity };
