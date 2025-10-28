import React, { useEffect, useState } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

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
  isLoading: boolean;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, onPaymentSelect, selectedPayment, isLoading }) => {
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

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-2xl">
        {/* Header Skeleton */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div>
                <Skeleton className="h-8 w-56 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-12 w-80 rounded-2xl" />
          </div>
        </div>

        {/* List Skeleton */}
        <div className="px-6 py-4 space-y-2.5">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3.5 flex-1">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="hidden lg:flex flex-col items-center">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex flex-col items-end">
                  <Skeleton className="h-6 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

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
        
        /* Ensure the element becomes visible after animation and during delayed start */
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
          animation-fill-mode: both; /* keep both initial and final states during delay and after end */
        }
      `}</style>
      <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-fade-in">
        <div className="relative z-10">
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
  <div className="px-6 py-6 space-y-4">
        {visiblePayments.map((payment, index) => (
          <div
            key={payment.id}
            onClick={() => onPaymentSelect(payment)}
            className={`group relative overflow-hidden bg-gradient-to-r from-white via-white to-gray-50/40 rounded-xl border backdrop-blur-sm p-4 cursor-pointer transition-all duration-300 animate-fade-in ${
              selectedPayment?.id === payment.id 
                ? 'ring-2 ring-heritage-green/50 border-heritage-green shadow-lg scale-[1.01]' 
                : 'border-gray-200/80 hover:border-heritage-green/60 hover:shadow-md hover:scale-[1.005]'
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            {/* Accent Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
              selectedPayment?.id === payment.id ? 'bg-heritage-green' : 'bg-transparent group-hover:bg-heritage-green/50'
            }`}></div>

            <div className="flex items-center justify-between gap-6">
              {/* Left: Icon + Payment Info */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  {getMethodIcon(payment.paymentMethod)}
                  {/* Status Indicator Dot */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    payment.status === 'completed' ? 'bg-green-500' :
                    payment.status === 'pending' ? 'bg-yellow-500' :
                    payment.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                </div>
                
                <div className="flex flex-col min-w-0 gap-0.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-gray-900 tracking-tight">{payment.id}</span>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium truncate">{payment.guestName}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {payment.roomNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Date/Time */}
              <div className="hidden lg:flex flex-col items-center px-4 py-1.5 bg-gray-50/80 rounded-lg border border-gray-200/60 min-w-[150px]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {payment.transactionDate}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {payment.transactionTime}
                </div>
              </div>

              {/* Right: Amount + Reference */}
              <div className="flex flex-col items-end min-w-[130px] gap-1">
                <span className={`text-xl font-extrabold tracking-tight ${
                  payment.status === 'refunded' ? 'text-blue-600' : 
                  payment.status === 'failed' ? 'text-red-600' : 'text-heritage-green'
                }`}>
                  {payment.status === 'refunded' ? '-' : ''}${payment.amount.toFixed(2)}
                </span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{payment.reference}</span>
                </div>
              </div>
            </div>

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/0 via-heritage-green/0 to-heritage-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
          </div>
        ))}
      </div>
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
    </>
  );
};

export default PaymentList;