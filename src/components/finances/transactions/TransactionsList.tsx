import React from 'react';
import type { Transaction } from './TransactionsPage';

interface TransactionsListProps {
  filters: {
    dateRange: string;
    type: string;
    category: string;
    status: string;
    searchTerm: string;
  };
  onTransactionSelect: (transaction: Transaction) => void;
  selectedTransaction: Transaction | null;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  filters, 
  onTransactionSelect, 
  selectedTransaction 
}) => {
  // Sample transactions data
  const allTransactions: Transaction[] = [
    {
      id: 'TXN001',
      description: 'Room Booking Payment - Suite 204',
      amount: 450,
      type: 'credit',
      date: '2024-10-07',
      time: '14:30',
      category: 'rooms',
      status: 'completed',
      reference: 'REF-2024-001',
      method: 'card'
    },
    {
      id: 'TXN002',
      description: 'Housekeeping Supplies Purchase',
      amount: 285,
      type: 'debit',
      date: '2024-10-07',
      time: '11:15',
      category: 'supplies',
      status: 'completed',
      reference: 'REF-2024-002',
      method: 'transfer'
    },
    {
      id: 'TXN003',
      description: 'Conference Hall Booking - ABC Corp',
      amount: 1200,
      type: 'credit',
      date: '2024-10-06',
      time: '16:45',
      category: 'events',
      status: 'pending',
      reference: 'REF-2024-003',
      method: 'check'
    },
    {
      id: 'TXN004',
      description: 'Monthly Utility Bills',
      amount: 890,
      type: 'debit',
      date: '2024-10-06',
      time: '09:00',
      category: 'utilities',
      status: 'completed',
      reference: 'REF-2024-004',
      method: 'transfer'
    },
    {
      id: 'TXN005',
      description: 'Restaurant Service - Table 12',
      amount: 125,
      type: 'credit',
      date: '2024-10-06',
      time: '20:30',
      category: 'dining',
      status: 'completed',
      reference: 'REF-2024-005',
      method: 'card'
    },
    {
      id: 'TXN006',
      description: 'Equipment Maintenance',
      amount: 320,
      type: 'debit',
      date: '2024-10-05',
      time: '13:20',
      category: 'maintenance',
      status: 'failed',
      reference: 'REF-2024-006',
      method: 'card'
    }
  ];

  // Filter transactions based on filters
  const filteredTransactions = allTransactions.filter(transaction => {
    if (filters.searchTerm && !transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    if (filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Failed</span>;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'cash':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'transfer':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Transactions</h3>
            <p className="text-sm text-gray-600">{filteredTransactions.length} transactions found</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Export
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors">
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs font-medium text-green-600 mb-1">Total Income</p>
            <p className="text-lg font-bold text-green-800">
              $+{filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs font-medium text-red-600 mb-1">Total Expenses</p>
            <p className="text-lg font-bold text-red-800">
              $-{filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-600 mb-1">Net Flow</p>
            <p className="text-lg font-bold text-blue-800">
              ${(filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0) - 
                 filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 font-medium mb-1">No transactions found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => onTransactionSelect(transaction)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedTransaction?.id === transaction.id ? 'bg-[#82A33D]/5 border-l-4 border-[#82A33D]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
                        </svg>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{transaction.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{transaction.date} at {transaction.time}</span>
                        <span className="flex items-center gap-1">
                          {getMethodIcon(transaction.method)}
                          {transaction.method.charAt(0).toUpperCase() + transaction.method.slice(1)}
                        </span>
                        <span>#{transaction.reference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold mb-1 ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
export { TransactionsList };