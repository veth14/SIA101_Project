import React, { useEffect, useState } from 'react';

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
  payments: Payment[];
  onPaymentSelect: (payment: Payment) => void;
  selectedPayment: Payment | null;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, onPaymentSelect, selectedPayment }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    method: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  // Local pagination state (header + pagination from transactions design)
  // Display All/Paginate removed; always paginate with itemsPerPage.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Derived filtered payments based on existing filters
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = filters.status === 'all' || p.status === filters.status;
    const matchesMethod = filters.method === 'all' || p.paymentMethod === filters.method;
    const term = filters.searchTerm.trim().toLowerCase();
    const matchesSearch = term === ''
      || p.id.toLowerCase().includes(term)
      || p.guestName.toLowerCase().includes(term)
      || p.reference.toLowerCase().includes(term)
      || `${p.roomNumber}`.toLowerCase().includes(term);
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const totalItems = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    // Clamp current page if filters/search changed
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

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

  // Removed unused getStatusColor after redesign to card-style rows.

  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-2xl">
      {/* Header (Transactions-style) */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-heritage-green">Payment Transactions</h3>
              <p className="text-sm text-heritage-neutral/70">
                {`Showing ${Math.min(totalItems, startIndex + 1)} to ${Math.min(totalItems, startIndex + itemsPerPage)} of ${totalItems} transactions`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-heritage-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search payments..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="py-3 pl-10 pr-4 transition-all duration-300 border shadow-sm w-80 border-heritage-neutral/30 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green placeholder-heritage-neutral/50 focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 focus:bg-white hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment List */}
  <div className="px-2 py-2 space-y-2">
        {visiblePayments.map((payment) => (
          <div
            key={payment.id}
            onClick={() => onPaymentSelect(payment)}
            className={`group bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-1 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#82A33D]/40 ${
              selectedPayment?.id === payment.id ? 'ring-2 ring-[#82A33D]/40 border-[#82A33D]' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-[100px]">
                <div className="flex items-center justify-center border border-gray-200 rounded-lg w-9 h-9 bg-gray-50">
                  {getMethodIcon(payment.paymentMethod)}
                </div>
                <div>
                  <h4 className="text-base font-semibold tracking-tight text-gray-900">{payment.id}</h4>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
              <div className="flex flex-col items-end min-w-[100px]">
                <p className={`text-xl font-bold tracking-wide ${
                  payment.status === 'refunded' ? 'text-blue-600' : 
                  payment.status === 'failed' ? 'text-red-600' : 'text-heritage-green'
                }`}>
                  {payment.status === 'refunded' ? '-' : ''}${payment.amount.toFixed(2)}
                </p>
                <p className="text-[11px] text-gray-400">{payment.reference}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-gray-600">
              <div className="flex flex-col">
                <span className="font-medium">{payment.guestName}</span>
                <span className="text-[11px] text-gray-400">Room {payment.roomNumber}</span>
              </div>
              <div className="flex flex-col items-end">
                <span>{payment.transactionDate} at {payment.transactionTime}</span>
                <span className="capitalize text-[11px] text-gray-400">{payment.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    pageNum = start + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                        pageNum === currentPage ? 'bg-heritage-green text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentList;