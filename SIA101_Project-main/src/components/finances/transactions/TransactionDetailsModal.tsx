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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-heritage-green to-heritage-light">
          <div>
            <h2 className="text-xl font-bold text-white">Transaction Details</h2>
            <p className="text-sm text-heritage-green/80">{transaction.reference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors hover:bg-white/10 rounded-xl"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              {/* Transaction Overview */}
              <div className="p-6 border bg-heritage-light/20 rounded-xl border-heritage-green/10">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Transaction Overview
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Amount</label>
                    <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Type</label>
                    <p className="text-lg font-semibold capitalize text-heritage-green">{transaction.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Category</label>
                    <p className="text-lg font-semibold text-heritage-green">{transaction.category}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-6 bg-white border shadow-sm rounded-xl border-heritage-green/10">
                <h3 className="flex items-center mb-3 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h3>
                <p className="leading-relaxed text-heritage-neutral">{transaction.description}</p>
              </div>

              {/* Additional Details */}
              {(transaction.source || transaction.destination) && (
                <div className="p-6 bg-white border shadow-sm rounded-xl border-heritage-green/10">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-heritage-green">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Transfer Details
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {transaction.source && (
                      <div>
                        <label className="text-sm font-medium text-heritage-neutral/60">Source</label>
                        <p className="font-medium text-heritage-green">{transaction.source}</p>
                      </div>
                    )}
                    {transaction.destination && (
                      <div>
                        <label className="text-sm font-medium text-heritage-neutral/60">Destination</label>
                        <p className="font-medium text-heritage-green">{transaction.destination}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Payment & Timeline */}
            <div className="space-y-6">
              {/* Payment Information */}
              <div className="p-6 bg-white border shadow-sm rounded-xl border-heritage-green/10">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Payment Method</label>
                    <p className="font-medium text-heritage-green">{transaction.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Reference Number</label>
                    <p className="p-2 font-mono text-sm rounded-lg text-heritage-green bg-heritage-light/20">
                      {transaction.reference}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Transaction Date</label>
                    <p className="font-medium text-heritage-green">{transaction.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-heritage-neutral/60">Transaction Time</label>
                    <p className="font-medium text-heritage-green">{transaction.time}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Timeline */}
              <div className="p-6 bg-white border shadow-sm rounded-xl border-heritage-green/10">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Transaction Timeline
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-heritage-green">Transaction Completed</p>
                      <p className="text-sm text-heritage-neutral/60">{transaction.date} at {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-heritage-green">Payment Processed</p>
                      <p className="text-sm text-heritage-neutral/60">Via {transaction.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-heritage-green">Transaction Initiated</p>
                      <p className="text-sm text-heritage-neutral/60">Reference: {transaction.reference}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 border bg-heritage-light/20 rounded-xl border-heritage-green/10">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      if (onCreateInvoice) {
                        onCreateInvoice();
                        onClose();
                      }
                    }}
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition-colors bg-heritage-green rounded-xl hover:bg-heritage-green/90"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Create Invoice
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-heritage-green text-heritage-green rounded-xl hover:bg-heritage-light/20">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-heritage-green text-heritage-green rounded-xl hover:bg-heritage-light/20">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-heritage-green text-heritage-green rounded-xl hover:bg-heritage-light/20">
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