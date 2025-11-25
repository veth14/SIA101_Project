import React from 'react';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  time: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  method: 'cash' | 'card' | 'transfer' | 'check' | 'gcash';
  guestName?: string;
  userEmail?: string;
  hasInvoice?: boolean;
  bookingId?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onTransactionSelect: (transaction: Transaction) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalItems: number;
  itemsPerPage: number;
  showAll: boolean;
  onToggleShowAll: () => void;
  isLoading: boolean;
  statusFilter: string;
  typeFilter: string;
  categoryFilter: string;
  onStatusFilterChange: (status: string) => void;
  onTypeFilterChange: (type: string) => void;
  onCategoryFilterChange: (category: string) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
  onTransactionSelect,
  searchTerm,
  onSearchChange,
  totalItems,
  itemsPerPage,
  showAll,
  onToggleShowAll,
  isLoading,
  statusFilter,
  typeFilter,
  categoryFilter,
  onStatusFilterChange,
  onTypeFilterChange,
  onCategoryFilterChange
}) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state is managed by parent component (skeleton removed)
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70">
      {/* Header with Search and Controls */}
      <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
              <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Recent Transactions
            </h3>
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                {showAll
                  ? `All ${totalItems}`
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
              </span>
              <span className="text-gray-400">•</span>
              <span>{showAll ? 'All transactions' : 'Paginated view'}</span>
            </p>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
            />
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Description
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                Amount
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Invoice Status
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                onClick={() => onTransactionSelect(transaction)}
                style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                className="group cursor-pointer transition-all duration-300 hover:shadow-sm animate-fade-in hover:bg-gray-50"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    {transaction.guestName && (
                      <div className="text-xs font-medium text-gray-600">
                        Guest: {transaction.guestName}
                      </div>
                    )}
                    {transaction.userEmail && (
                      <div className="text-xs font-medium text-gray-500">
                        Email: {transaction.userEmail}
                      </div>
                    )}
                    <div className="text-sm font-bold text-gray-900 group-hover:text-[#82A33D] transition-colors">
                      {transaction.description}
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      Ref: {transaction.reference}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right whitespace-nowrap">
                  <div className="text-sm font-bold">
                    <span
                      className={
                        transaction.type === 'credit'
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }
                    >
                      {transaction.type === 'debit' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-gray-500 capitalize">
                    {transaction.method}
                  </div>
                </td>
                <td className="px-6 py-5 text-center whitespace-nowrap">
                  {transaction.hasInvoice ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Invoiced
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 shadow-sm">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M4 6h16M4 10h16M4 14h8"
                        />
                      </svg>
                      No Invoice
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-center whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaction.date}</div>
                  <div className="text-xs font-medium text-gray-500">{transaction.time}</div>
                </td>
              </tr>
            ))}

            {/* Fill empty rows to always show itemsPerPage rows when paginated */}
            {!showAll &&
              Array.from({ length: Math.max(0, itemsPerPage - transactions.length) }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  style={{ height: '74px' }}
                  className="border-gray-200 border-dashed bg-gray-50/30"
                >
                  <td className="px-6 py-5" colSpan={4}>
                    <div className="flex items-center justify-center text-sm font-medium text-gray-300 opacity-60">
                      <div className="w-2 h-2 mr-2 bg-gray-300 rounded-full opacity-40"></div>
                      Empty slot {index + 1}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {totalItems === 0 && !isLoading && (
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-gray-400">🔍</div>
          <p className="font-medium text-gray-500">No transactions found</p>
          <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {!showAll && totalPages > 1 && (
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                      onClick={() => onPageChange(pageNum)}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-all ${
                        pageNum === currentPage
                          ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      aria-current={pageNum === currentPage ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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

export default RecentTransactions;
