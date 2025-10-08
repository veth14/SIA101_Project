import React from 'react';
import type { Transaction } from './TransactionsPage';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  if (!transaction) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 font-medium mb-1">No Transaction Selected</p>
          <p className="text-sm text-gray-400">Select a transaction to view details</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'cash':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'transfer':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount and Status */}
        <div className="text-center mb-4">
          <p className={`text-3xl font-bold mb-2 ${
            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </p>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Transaction Info */}
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Transaction ID</label>
            <p className="text-sm text-gray-900 font-mono">{transaction.id}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Reference</label>
            <p className="text-sm text-gray-900 font-mono">{transaction.reference}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <p className="text-sm text-gray-900">{transaction.date}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
            <p className="text-sm text-gray-900">{transaction.time}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Payment Method</label>
          <div className="flex items-center gap-2">
            <div className="text-gray-600">
              {getMethodIcon(transaction.method)}
            </div>
            <p className="text-sm text-gray-900">
              {transaction.method.charAt(0).toUpperCase() + transaction.method.slice(1)}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <p className="text-sm text-gray-900 capitalize">{transaction.category}</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <p className="text-sm text-gray-900 capitalize">
              {transaction.type === 'credit' ? 'Income' : 'Expense'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-100">
        <div className="space-y-3">
          <button className="w-full py-2 px-4 text-sm font-medium text-[#82A33D] hover:text-[#6d8735] border border-[#82A33D] hover:border-[#6d8735] rounded-lg hover:bg-[#82A33D]/5 transition-colors">
            View Receipt
          </button>
          
          {transaction.status === 'pending' && (
            <>
              <button className="w-full py-2 px-4 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors">
                Approve Transaction
              </button>
              <button className="w-full py-2 px-4 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                Reject Transaction
              </button>
            </>
          )}
          
          <button className="w-full py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Edit Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
export { TransactionDetails };