import React from 'react';
import { createPortal } from 'react-dom';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  time: string;
  reference: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
  source?: string;
  destination?: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice?: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ transaction, isOpen, onClose, onCreateInvoice }) => {
  if (!transaction || !isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5">
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M9 2h6l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
                  <path d="M9 11h6M9 15h4" stroke="rgba(255,255,255,0.9)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-emerald-700 md:text-2xl">Complete Transaction Details</h2>
                <p className="mt-1 text-sm text-gray-500">{transaction.reference}</p>
              </div>
            </div>
            <div aria-hidden />
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              {/* Transaction Overview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-50/40 ring-1 ring-emerald-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-emerald-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Transaction Overview
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Amount</label>
                    <p className={`text-2xl font-black ${transaction.type === 'income' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-lg font-semibold capitalize text-gray-900">{transaction.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="text-lg font-semibold text-gray-900">{transaction.category}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-black/5">
                <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h3>
                <p className="leading-relaxed text-gray-600">{transaction.description}</p>
              </div>

              {/* Additional Details */}
              {(transaction.source || transaction.destination) && (
                <div className="p-6 bg-white rounded-2xl ring-1 ring-black/5">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Transfer Details
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {transaction.source && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Source</label>
                        <p className="font-medium text-gray-900">{transaction.source}</p>
                      </div>
                    )}
                    {transaction.destination && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Destination</label>
                        <p className="font-medium text-gray-900">{transaction.destination}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Payment & Timeline */}
            <div className="space-y-6">
              {/* Payment Information */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-black/5">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Information
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Method</label>
                    <p className="font-medium text-gray-900">{transaction.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reference Number</label>
                    <p className="p-2 font-mono text-xs rounded-lg bg-gray-50 border border-gray-200 text-gray-900">
                      {transaction.reference}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transaction Date</label>
                    <p className="font-medium text-gray-900">{transaction.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transaction Time</label>
                    <p className="font-medium text-gray-900">{transaction.time}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Timeline */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-black/5">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Transaction Timeline
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Transaction Completed</p>
                      <p className="text-xs text-gray-500">{transaction.date} at {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Payment Processed</p>
                      <p className="text-xs text-gray-500">Via {transaction.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Transaction Initiated</p>
                      <p className="text-xs text-gray-500">Reference: {transaction.reference}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-black/5">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button 
                    onClick={() => {
                      if (onCreateInvoice) {
                        onCreateInvoice();
                        onClose();
                      }
                    }}
                    className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white transition-colors bg-gradient-to-r from-[#82A33D] to-emerald-600 rounded-xl hover:from-[#6d8735] hover:to-emerald-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Create Invoice
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TransactionDetailsModal;