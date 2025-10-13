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
    .sort((a, b) => `${b.transactionDate} ${b.transactionTime}`.localeCompare(`${a.transactionDate} ${a.transactionTime}`))
    .slice(0, 5);

  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Recent Activity</h3>
      <ul className="space-y-3">
        {recent.map((p) => (
          <li key={p.id} className="flex items-center gap-3 text-sm text-gray-700">
            <span className={`${statusColor(p.status)}`}>●</span>
            <span className="flex-1">{statusText(p)}</span>
            <span className="text-xs text-gray-500">{p.transactionDate} {p.transactionTime}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentsActivity;
export { PaymentsActivity };
