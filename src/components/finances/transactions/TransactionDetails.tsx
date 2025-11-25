import React, { useState, useEffect } from 'react';
import SimpleModal from './SimpleModal';
import InvoiceModal from './InvoiceModal';
import { printTransactionReceipt, downloadTransactionReceiptPdf } from './printing/transactionPrinting';

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

interface TransactionDetailsProps {
  transaction: Transaction | null;
  onClose: () => void;
  onViewFullDetails?: (transaction: Transaction) => void;
  onCreateInvoice?: (transaction: Transaction) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  transaction, 
  onClose, 
  onViewFullDetails, 
  onCreateInvoice 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handler functions
  const handleViewFullDetails = (transaction: Transaction) => {
    console.log('handleViewFullDetails called with:', transaction);
    console.log('onViewFullDetails:', onViewFullDetails);
    console.log('isModalOpen before:', isModalOpen);
    
    if (onViewFullDetails) {
      onViewFullDetails(transaction);
    } else {
      // Open modal with transaction details
      setIsModalOpen(true);
      console.log('setIsModalOpen(true) called');
    }
  };

  const handleCreateInvoice = (transaction: Transaction) => {
    if (onCreateInvoice) {
      onCreateInvoice(transaction);
    } else {
      // Open the invoice modal instead of showing alert
      setIsInvoiceModalOpen(true);
    }
  };

  const handlePrintReceipt = (transaction: Transaction) => {
    printTransactionReceipt(transaction);
  };

  const handleDownloadPDF = (transaction: Transaction) => {
    downloadTransactionReceiptPdf(transaction);
  };

  // Loading simulation removed - component renders immediately

  return (
    <>
      <style>{`
        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out;
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-md border border-gray-200/70 h-full flex flex-col animate-slide-in-right">

      {/* Header - matching PayrollDetailsPanel style */}
      <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#82A33D]/10 rounded-xl">
              <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Transaction Details</h3>
              {transaction ? (
                <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                    #{transaction.id}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="truncate max-w-[180px]">{transaction.reference}</span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                    Transaction Information
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>Detailed Breakdown</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {transaction ? (
        <>
          {/* Main content - card-based layout inspired by PayrollDetailsPanel */}
          <div className="p-6 space-y-10 flex-1 overflow-hidden">
            {/* Summary Card */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100/50 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wide uppercase text-gray-600">Description</p>
                <p className="text-base font-bold text-gray-900">{transaction.description}</p>
                {transaction.guestName && (
                  <p className="text-xs text-gray-600">Guest: {transaction.guestName}</p>
                )}
                {transaction.userEmail && (
                  <p className="text-xs text-gray-500">Email: {transaction.userEmail}</p>
                )}
                <p className="text-xs text-gray-500">
                  {transaction.date} • {transaction.time || '—'}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-xs font-semibold tracking-wide uppercase text-gray-600">Amount</p>
                <p className="text-2xl font-black text-gray-900">{formatCurrency(transaction.amount)}</p>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                    transaction.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : transaction.status === 'pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      transaction.status === 'completed'
                        ? 'bg-emerald-500'
                        : transaction.status === 'pending'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Detail Cards */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Primary Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                  <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Transaction Type</label>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-base font-semibold capitalize text-gray-900">{transaction.type}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                  <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Category</label>
                  <p className="text-base font-semibold text-gray-900">{transaction.category || 'General'}</p>
                </div>

                <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                  <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Payment Method</label>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {transaction.method === 'card' ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      ) : transaction.method === 'cash' ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      ) : transaction.method === 'gcash' ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm5 14h.01M12 8a3 3 0 00-3 3"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      )}
                    </svg>
                    <span className="text-base font-semibold capitalize text-gray-900">{transaction.method}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                  <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Reference Number</label>
                  <p className="px-3 py-2 font-mono text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg">
                    {transaction.reference}
                  </p>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="p-4 space-y-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 rounded-lg">
                <h4 className="flex items-center text-sm font-bold tracking-wide uppercase text-gray-900">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Transaction Timeline
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">Date Processed</span>
                    <span className="px-2 py-1 font-semibold text-gray-900 bg-white rounded">
                      {transaction.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">Time Stamp</span>
                    <span className="px-2 py-1 font-semibold text-gray-900 bg-white rounded">
                      {transaction.time || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - bottom bar */}
            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
              <div className="space-y-3">
                <button
                  onClick={() => handleViewFullDetails(transaction)}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] group"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-semibold">View Full Details</span>
                </button>

                <button
                  onClick={() => handleCreateInvoice(transaction)}
                  disabled={transaction.hasInvoice}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white rounded-xl hover:from-[#6d8735] hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">
                    {transaction.hasInvoice ? 'Invoice Already Created' : 'Create Invoice'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handlePrintReceipt(transaction)}
                    className="flex items-center justify-center px-4 py-3 space-x-2 transition-all duration-300 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="text-sm font-medium">Print</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(transaction)}
                    className="flex items-center justify-center px-4 py-3 space-x-2 transition-all duration-300 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-1 p-12">
          <div className="max-w-sm text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">No Transaction Selected</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Select a transaction from the list to view its details, timeline, and receipt options.
            </p>
          </div>
        </div>
      )}
      
      {/* Transaction Details Modal */}
      {transaction && (
        <SimpleModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log('Modal onClose called');
            setIsModalOpen(false);
          }}
          title="Complete Transaction Details"
        >
          <div className="space-y-6">
            {/* Summary Header */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-50/40 border border-emerald-100">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wide uppercase text-gray-600">
                  Transaction #{transaction.id}
                </p>
                <p className="text-base font-semibold text-gray-900">{transaction.description}</p>
                <p className="text-xs text-gray-500">
                  {transaction.date} • {transaction.time || '—'}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-xs font-semibold tracking-wide uppercase text-gray-600">Amount</p>
                <p className="text-2xl font-black text-gray-900">{formatCurrency(transaction.amount)}</p>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                    transaction.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : transaction.status === 'pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      transaction.status === 'completed'
                        ? 'bg-emerald-500'
                        : transaction.status === 'pending'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Primary Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Transaction Type</label>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-base font-semibold capitalize text-gray-900">{transaction.type}</span>
                </div>
              </div>

              <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Category</label>
                <p className="text-base font-semibold text-gray-900">{transaction.category || 'General'}</p>
              </div>

              <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Payment Method</label>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {transaction.method === 'card' ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    ) : transaction.method === 'cash' ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    ) : transaction.method === 'gcash' ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm5 14h.01M12 8a3 3 0 00-3 3"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    )}
                  </svg>
                  <span className="text-base font-semibold capitalize text-gray-900">{transaction.method}</span>
                </div>
              </div>

              <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Processing Time</label>
                <p className="text-base font-semibold text-gray-900">{transaction.time || 'Instant'}</p>
              </div>
            </div>

            {/* Timeline Information */}
            <div className="p-4 space-y-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 rounded-xl">
              <h4 className="flex items-center text-sm font-bold tracking-wide uppercase text-gray-900">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Transaction Timeline
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Date Processed</span>
                  <span className="px-2 py-1 text-sm font-semibold bg-white rounded text-gray-900">{transaction.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Time Stamp</span>
                  <span className="px-2 py-1 text-sm font-semibold bg-white rounded text-gray-900">{transaction.time || '—'}</span>
                </div>
              </div>
            </div>

            {/* Reference and Security */}
            <div className="p-4 space-y-3 bg-white border border-gray-200/60 rounded-xl">
              <h4 className="flex items-center text-sm font-bold tracking-wide uppercase text-gray-900">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Security & Reference
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Reference Number</span>
                  <span className="px-3 py-1 font-mono text-sm font-semibold bg-white border border-gray-200 rounded text-gray-900">
                    {transaction.reference}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Transaction Hash</span>
                  <span className="px-2 py-1 font-mono text-xs bg-white border border-gray-200 rounded text-gray-900">
                    {`TXN${transaction.id}${transaction.date.replace(/-/g, '')}${transaction.reference}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 gap-3 p-4 bg-white border border-gray-200/60 rounded-xl">
              <h4 className="flex items-center text-sm font-bold tracking-wide uppercase text-gray-900">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Additional Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees Applied</span>
                  <span className="font-semibold text-gray-900">₱0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exchange Rate</span>
                  <span className="font-semibold text-gray-900">1.00 PHP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-900">Front Desk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authorized By</span>
                  <span className="font-semibold text-gray-900">System</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  handleCreateInvoice(transaction);
                  setIsModalOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white rounded-xl hover:from-[#6d8735] hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-semibold">Create Invoice</span>
              </button>

              <button
                onClick={() => {
                  // Print receipt functionality
                  handlePrintReceipt(transaction);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="text-sm font-semibold">Print Receipt</span>
              </button>
            </div>
          </div>
        </SimpleModal>
      )}

      {/* Invoice Creation Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        transaction={transaction}
      />
      </div>
    </>
  );
};

export default TransactionDetails;