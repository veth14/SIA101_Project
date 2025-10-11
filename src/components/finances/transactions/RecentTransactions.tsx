import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

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
  method: 'cash' | 'card' | 'transfer' | 'check';
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
  itemsPerPage
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Slightly longer for table
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <style>{`
          @keyframes table-slide-in {
            0% {
              opacity: 0;
              transform: translateX(-30px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          
          .animate-table-slide-in {
            animation: table-slide-in 0.7s ease-out;
          }
        `}</style>
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-6 h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-64 rounded-xl" />
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-heritage-neutral/20">
            <table className="w-full">
              <thead className="bg-heritage-light/30">
                <tr>
                  <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
                  <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
                  <th className="px-6 py-4"><Skeleton className="h-4 w-12" /></th>
                  <th className="px-6 py-4"><Skeleton className="h-4 w-10" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-neutral/20">
                {Array.from({ length: 6 }, (_, index) => (
                  <tr key={index} className="h-16">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-18" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes table-slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-table-slide-in {
          animation: table-slide-in 0.7s ease-out;
        }
      `}</style>
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl animate-table-slide-in group hover:shadow-3xl transition-all duration-500">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-heritage-light/20 to-heritage-green/3 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-heritage-green/10 to-transparent"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-heritage-light/30 to-transparent"></div>
        
        <div className="relative z-10 p-8 h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-heritage-green">Recent Transactions</h2>
                <p className="text-sm text-heritage-neutral/70">Track and manage your financial activities</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-heritage-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 border border-heritage-neutral/30 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green placeholder-heritage-neutral/50 focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-heritage-neutral/10 shadow-inner bg-white/50 backdrop-blur-sm">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-heritage-light/40 to-heritage-green/10 border-b border-heritage-neutral/10">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-bold text-heritage-green tracking-wide">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Description</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-heritage-green tracking-wide">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-heritage-green tracking-wide">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-heritage-green tracking-wide">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Date</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-neutral/10 bg-white/30">
                {Array.from({ length: 6 }, (_, index) => {
                  const transaction = transactions[index];
                  return transaction ? (
                    <tr 
                      key={transaction.id} 
                      className="hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-heritage-light/20 transition-all duration-300 cursor-pointer h-20 group border-l-4 border-transparent hover:border-heritage-green"
                      onClick={() => onTransactionSelect(transaction)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-heritage-green/20 to-heritage-neutral/20 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-heritage-green group-hover:text-heritage-green/80 transition-colors">{transaction.description}</p>
                            <p className="text-sm text-heritage-neutral/70">Transaction #{transaction.reference}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-right">
                          <p className="text-lg font-bold text-heritage-green">{formatCurrency(transaction.amount)}</p>
                          <p className="text-sm text-heritage-neutral/70 capitalize">{transaction.method}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                          transaction.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : transaction.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            transaction.status === 'completed' ? 'bg-emerald-500' :
                            transaction.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></div>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-left">
                          <p className="font-medium text-heritage-green">{transaction.date}</p>
                          <p className="text-sm text-heritage-neutral/70">{transaction.time}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={`empty-${index}`} className="h-20 bg-heritage-neutral/3 border-b border-heritage-neutral/5">
                      <td className="px-8 py-6" colSpan={4}>
                        <div className="flex items-center justify-center text-heritage-neutral/20">
                          <div className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-heritage-neutral/30 rounded-full"></div>
                            <div className="w-1 h-1 bg-heritage-neutral/30 rounded-full"></div>
                            <div className="w-1 h-1 bg-heritage-neutral/30 rounded-full"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-heritage-neutral/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-heritage-green rounded-full"></div>
              <span className="text-sm font-medium text-heritage-neutral">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-heritage-neutral/30 bg-white/90 text-heritage-green disabled:opacity-50 hover:bg-heritage-green/10 hover:border-heritage-green/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Previous</span>
              </button>
              <div className="flex items-center space-x-1">
                <span className="px-4 py-2 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl font-semibold shadow-lg">
                  {currentPage}
                </span>
                <span className="text-heritage-neutral/50 mx-2">of</span>
                <span className="text-heritage-green font-semibold">{totalPages}</span>
              </div>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-heritage-neutral/30 bg-white/90 text-heritage-green disabled:opacity-50 hover:bg-heritage-green/10 hover:border-heritage-green/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <span className="font-medium">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentTransactions;
