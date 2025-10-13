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
    <div className="bg-white border border-gray-100 shadow-lg rounded-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600">{totalItems} events</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors border border-gray-200 rounded-lg hover:text-gray-800 hover:bg-gray-50">
              Export Log
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable List to match table height */}
      <div className="max-h-[600px] overflow-y-auto">
        <ul className="p-4 space-y-4">
          {recent.map((p) => (
            <li key={p.id} className="flex items-start justify-between p-3 transition-colors border-l-4 rounded-md hover:bg-gray-50 group bg-gray-50/30">
              <div className="flex items-center gap-3">
                <span className={`${statusColor(p.status)} text-lg leading-none`}>●</span>
                <div>
                  <p className="font-medium text-gray-900">{statusText(p)}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Room {p.roomNumber}</span>
                    <span className="capitalize">{p.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{p.transactionDate} {p.transactionTime}</p>
                <p className="text-xs text-gray-400">{p.id}</p>
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
