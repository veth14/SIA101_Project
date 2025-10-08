import React, { useState } from 'react';

export interface Payment {
  id: string;
  guestName: string;
  roomNumber: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'digital' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionDate: string;
  transactionTime: string;
  reference: string;
  description: string;
}

interface PaymentListProps {
  onPaymentSelect: (payment: Payment) => void;
  selectedPayment: Payment | null;
}

const PaymentList: React.FC<PaymentListProps> = ({ onPaymentSelect, selectedPayment }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    method: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  // Sample payment data
  const payments: Payment[] = [
    {
      id: 'PAY-2024-001',
      guestName: 'John Smith',
      roomNumber: '204',
      amount: 580.50,
      paymentMethod: 'card',
      status: 'completed',
      transactionDate: '2024-10-07',
      transactionTime: '14:30:00',
      reference: 'TXN-4567890123',
      description: 'Room booking payment for 2 nights'
    },
    {
      id: 'PAY-2024-002',
      guestName: 'Sarah Johnson',
      roomNumber: '301',
      amount: 420.75,
      paymentMethod: 'digital',
      status: 'pending',
      transactionDate: '2024-10-08',
      transactionTime: '09:15:00',
      reference: 'TXN-4567890124',
      description: 'Room service and accommodation charges'
    },
    {
      id: 'PAY-2024-003',
      guestName: 'Michael Brown',
      roomNumber: '105',
      amount: 890.25,
      paymentMethod: 'cash',
      status: 'completed',
      transactionDate: '2024-10-06',
      transactionTime: '16:45:00',
      reference: 'TXN-4567890125',
      description: 'Full payment including spa services'
    },
    {
      id: 'PAY-2024-004',
      guestName: 'Emily Davis',
      roomNumber: '208',
      amount: 125.00,
      paymentMethod: 'card',
      status: 'failed',
      transactionDate: '2024-10-08',
      transactionTime: '11:20:00',
      reference: 'TXN-4567890126',
      description: 'Room service payment - card declined'
    },
    {
      id: 'PAY-2024-005',
      guestName: 'Robert Wilson',
      roomNumber: '402',
      amount: 320.00,
      paymentMethod: 'bank_transfer',
      status: 'refunded',
      transactionDate: '2024-10-05',
      transactionTime: '13:10:00',
      reference: 'TXN-4567890127',
      description: 'Cancelled booking refund'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">✓ Completed</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-bold text-yellow-800 bg-yellow-100 rounded-full">⏳ Pending</span>;
      case 'failed':
        return <span className="px-3 py-1 text-xs font-bold text-red-800 bg-red-100 rounded-full">✗ Failed</span>;
      case 'refunded':
        return <span className="px-3 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">↺ Refunded</span>;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return (
          <div className="p-2 rounded-lg bg-blue-50">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        );
      case 'cash':
        return (
          <div className="p-2 rounded-lg bg-green-50">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'digital':
        return (
          <div className="p-2 rounded-lg bg-purple-50">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="p-2 rounded-lg bg-indigo-50">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-green-500 bg-green-50/30';
      case 'pending':
        return 'border-l-yellow-500 bg-yellow-50/30';
      case 'failed':
        return 'border-l-red-500 bg-red-50/30';
      case 'refunded':
        return 'border-l-blue-500 bg-blue-50/30';
      default:
        return 'border-l-gray-500 bg-gray-50/30';
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-2xl">
      {/* Header with Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Payment Transactions</h3>
            <p className="text-sm text-gray-600">{payments.length} transactions found</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors">
              Process Payment
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors border border-gray-200 rounded-lg hover:text-gray-800 hover:bg-gray-50">
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search payments..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={filters.method}
            onChange={(e) => setFilters({...filters, method: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Methods</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="digital">Digital Wallet</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Payment List */}
      <div className="max-h-[600px] overflow-y-auto">
        {payments.map((payment) => (
          <div
            key={payment.id}
            onClick={() => onPaymentSelect(payment)}
            className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedPayment?.id === payment.id ? 'bg-[#82A33D]/5 border-l-[#82A33D]' : getStatusColor(payment.status)
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getMethodIcon(payment.paymentMethod)}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-gray-900">{payment.id}</h4>
                    {getStatusBadge(payment.status)}
                  </div>
                  <p className="mb-1 font-medium text-gray-700">{payment.guestName}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Room {payment.roomNumber}</span>
                    <span>{payment.transactionDate} at {payment.transactionTime}</span>
                    <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${
                  payment.status === 'refunded' ? 'text-blue-600' : 
                  payment.status === 'failed' ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {payment.status === 'refunded' ? '-' : ''}${payment.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{payment.reference}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-lg font-bold text-green-600">
              ${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-lg font-bold text-yellow-600">
              ${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-lg font-bold text-red-600">
              ${payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Refunded</p>
            <p className="text-lg font-bold text-blue-600">
              ${payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;