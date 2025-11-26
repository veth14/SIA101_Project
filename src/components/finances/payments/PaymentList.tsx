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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtering
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = filters.status === 'all' || p.status === filters.status;
    const matchesMethod = filters.method === 'all' || p.paymentMethod === filters.method;

    const term = filters.searchTerm.trim().toLowerCase();
    const matchesSearch =
      term === '' ||
      p.id.toLowerCase().includes(term) ||
      p.guestName.toLowerCase().includes(term) ||
      p.reference.toLowerCase().includes(term) ||
      `${p.roomNumber}`.toLowerCase().includes(term);

    // Date range filter (optional quality-of-life)
    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const txDate = new Date(p.transactionDate);
      if (!Number.isNaN(txDate.getTime())) {
        const now = new Date();
        if (filters.dateRange === 'today') {
          matchesDate =
            txDate.getFullYear() === now.getFullYear() &&
            txDate.getMonth() === now.getMonth() &&
            txDate.getDate() === now.getDate();
        } else if (filters.dateRange === 'week') {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          matchesDate = txDate >= sevenDaysAgo && txDate <= now;
        } else if (filters.dateRange === 'month') {
          matchesDate =
            txDate.getFullYear() === now.getFullYear() &&
            txDate.getMonth() === now.getMonth();
        }
      }
    }

    return matchesStatus && matchesMethod && matchesSearch && matchesDate;
  });

  const totalItems = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">✓ Completed</span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 text-xs font-bold text-yellow-800 bg-yellow-100 rounded-full">⏳ Pending</span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 text-xs font-bold text-red-800 bg-red-100 rounded-full">✗ Failed</span>
        );
      case 'refunded':
        return (
          <span className="px-3 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">↺ Refunded</span>
        );
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
        );
      case 'cash':
        return (
          <div className="p-2 rounded-lg bg-green-50">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        );
      case 'digital':
        return (
          <div className="p-2 rounded-lg bg-purple-50">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="p-2 rounded-lg bg-indigo-50">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const from = totalItems === 0 ? 0 : startIndex + 1;
  const to = totalItems === 0 ? 0 : Math.min(totalItems, startIndex + visiblePayments.length);

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
          animation-fill-mode: both;
        }
      `}</style>

      <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-fade-in">
        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-heritage-green">Payment Transactions</h3>
                  <p className="text-sm text-heritage-neutral/70">
                    {`Showing ${from} to ${to} of ${totalItems} transactions`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-heritage-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="w-full py-3 pl-10 pr-4 text-sm font-medium transition-all duration-300 border shadow-sm border-heritage-neutral/30 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green placeholder-heritage-neutral/50 focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 focus:bg-white hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-2">
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={filters.method}
                  onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green"
                >
                  <option value="all">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="digital">Digital</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-4 py-4">
            {totalItems === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-gray-500">No payments found</p>
                <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white/80 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                        Ref #
                      </th>
                      <th className="px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                        Guest
                      </th>
                      <th className="px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                        Room
                      </th>
                      <th className="px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                        Method
                      </th>
                      <th className="px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                        Date / Time
                      </th>
                      <th className="px-6 py-4 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {visiblePayments.map((payment, index) => (
                      <tr
                        key={payment.id}
                        onClick={() => onPaymentSelect(payment)}
                        style={{ animationDelay: `${index * 50}ms` }}
                        className={`group cursor-pointer transition-all duration-300 hover:bg-gray-50/80 animate-fade-in ${
                          selectedPayment?.id === payment.id
                            ? 'bg-gradient-to-r from-[#82A33D]/10 via-[#82A33D]/5 to-transparent border-l-4 border-l-[#82A33D] shadow-sm'
                            : ''
                        }`}
                      >
                        {/* Ref # */}
                        <td className="px-6 py-4 text-xs font-mono font-bold text-gray-600 whitespace-nowrap">
                          {payment.id}
                        </td>

                        {/* Guest + description */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 group-hover:text-heritage-green transition-colors">
                            {payment.guestName}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="truncate">{payment.description}</span>
                          </div>
                        </td>

                        {/* Room */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {payment.roomNumber}
                        </td>

                        {/* Method */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-800">
                            {getMethodIcon(payment.paymentMethod)}
                            <span className="text-xs font-semibold text-gray-700">
                              {payment.paymentMethod === 'cash'
                                ? 'Cash'
                                : payment.paymentMethod === 'card'
                                ? 'Credit Card'
                                : payment.paymentMethod === 'digital'
                                ? 'GCash'
                                : payment.paymentMethod === 'bank_transfer'
                                ? 'Bank Transfer'
                                : 'Cash'}
                            </span>
                          </div>
                        </td>

                        {/* Date / Time */}
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span>{payment.transactionDate}</span>
                            <span className="text-xs text-gray-500">{payment.transactionTime}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            ₱{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                      </tr>
                    ))}

                    {/* Placeholder rows to keep table height consistent */}
                    {Array.from({ length: Math.max(0, itemsPerPage - visiblePayments.length) }).map((_, index) => (
                      <tr
                        key={`empty-${index}`}
                        style={{ height: '72px' }}
                        className="border-gray-200 border-dashed bg-gray-50/40"
                      >
                        <td className="px-6 py-4" colSpan={7}>
                          <div className="flex items-center justify-center text-xs font-medium text-gray-300 opacity-60">
                            <div className="w-2 h-2 mr-2 bg-gray-300 rounded-full opacity-40" />
                            Empty slot {index + 1}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
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
                            pageNum === currentPage
                              ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
      </div>
    </>
  );
};

export default PaymentList;