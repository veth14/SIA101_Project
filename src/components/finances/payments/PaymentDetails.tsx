import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Payment } from './PaymentList';

interface PaymentDetailsProps {
  payment: Payment | null;
  onClose: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!payment) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [payment]);

  if (!payment) return null;

  const getMethodDetails = (method: string) => {
    switch (method) {
      case 'card':
        return {
          name: 'Credit/Debit Card',
          icon: '💳',
          color: 'text-blue-600 bg-blue-50',
          details: ['Card ending in ****4567', 'Visa', 'Authorized by Bank']
        };
      case 'cash':
        return {
          name: 'Cash Payment',
          icon: '💰',
          color: 'text-green-600 bg-green-50',
          details: ['Cash received', 'Change given: $19.50', 'Receipt printed']
        };
      case 'digital':
        return {
          name: 'Digital Wallet',
          icon: '📱',
          color: 'text-purple-600 bg-purple-50',
          details: ['PayPal payment', 'Instant transfer', 'Verified account']
        };
      case 'bank_transfer':
        return {
          name: 'Bank Transfer',
          icon: '🏦',
          color: 'text-indigo-600 bg-indigo-50',
          details: ['Wire transfer', 'Bank: Chase', 'Account verified']
        };
      default:
        return { name: 'Unknown', icon: '❓', color: 'text-gray-600 bg-gray-50', details: [] };
    }
  };

  const methodInfo = getMethodDetails(payment.paymentMethod);

  const handleRetryPayment = () => {
    // placeholder - implement server-side retry
    console.warn('Retry payment not implemented yet');
  };

  const handleRefundPayment = () => {
    // placeholder - implement refund flow
    console.warn('Refund payment not implemented yet');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const statusStyles = (() => {
    switch (payment.status) {
      case 'completed':
        return {
          banner: 'bg-green-50 border border-green-200',
          text: 'text-green-700',
          accent: 'text-green-600',
          icon: '✅',
          message: 'Transaction processed successfully'
        };
      case 'pending':
        return {
          banner: 'bg-yellow-50 border border-yellow-200',
          text: 'text-yellow-700',
          accent: 'text-yellow-600',
          icon: '⏳',
          message: 'Awaiting processing confirmation'
        };
      case 'failed':
        return {
          banner: 'bg-red-50 border border-red-200',
          text: 'text-red-700',
          accent: 'text-red-600',
          icon: '❌',
          message: 'Transaction was declined or failed'
        };
      case 'refunded':
        return {
          banner: 'bg-blue-50 border border-blue-200',
          text: 'text-blue-700',
          accent: 'text-blue-600',
          icon: '↺',
          message: 'Payment has been refunded to original method'
        };
      default:
        return { banner: 'bg-gray-50', text: 'text-gray-700', accent: 'text-gray-600', icon: 'ℹ️', message: '' };
    }
  })();

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Full-screen overlay with strong blur and dim, outside modal card */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={onClose}
        aria-label="Close overlay"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5">
        {/* Header (branded) - match Payments list reference */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                {/* filled document icon */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M9 2h6l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <path d="M9 7h6M9 11h6" stroke="rgba(255,255,255,0.9)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold md:text-2xl text-emerald-700">Payment Details</h2>
                <p className="mt-1 text-sm text-gray-500">{payment.id}</p>
              </div>
            </div>

            {/* right side empty to mirror list header spacing */}
            <div aria-hidden />
          </div>

          {/* Close button (small subtle) */}
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

  {/* Content */}
  <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Status banner */}
          <div className={`p-4 rounded-xl mb-6 ${statusStyles.banner} ring-1 ring-black/5`}> 
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${statusStyles.accent}`}>{statusStyles.icon}</div>
                <div>
                  <h3 className={`text-base font-semibold ${statusStyles.text}`}>
                    Payment {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </h3>
                  {statusStyles.message && (
                    <p className={`text-sm ${statusStyles.accent}`}>{statusStyles.message}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${payment.status === 'refunded' ? 'text-blue-600' : payment.status === 'failed' ? 'text-red-600' : 'text-gray-900'}`}>
                  {payment.status === 'refunded' ? '-' : ''}${payment.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
              <h4 className="mb-3 text-lg font-semibold text-gray-900">Guest Information</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium text-gray-600">Name:</span> {payment.guestName}</p>
                <p><span className="font-medium text-gray-600">Room:</span> {payment.roomNumber}</p>
                <p><span className="font-medium text-gray-600">Description:</span> {payment.description}</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
              <h4 className="mb-3 text-lg font-semibold text-gray-900">Transaction Details</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium text-gray-600">Reference:</span> {payment.reference}</p>
                <p><span className="font-medium text-gray-600">Date:</span> {payment.transactionDate}</p>
                <p><span className="font-medium text-gray-600">Time:</span> {payment.transactionTime}</p>
              </div>
            </div>
          </div>

          {/* Method details */}
          <div className="p-6 mb-6 bg-white rounded-2xl ring-1 ring-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${methodInfo.color}`}>
                <span className="text-2xl" aria-hidden>{methodInfo.icon}</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{methodInfo.name}</h4>
                <p className="text-sm text-gray-600">Payment processed via {methodInfo.name.toLowerCase()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {methodInfo.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Transaction Timeline</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Payment Initiated</p>
                  <p className="text-sm text-gray-600">{payment.transactionDate} at {payment.transactionTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  payment.status === 'completed' ? 'bg-green-500' :
                  payment.status === 'pending' ? 'bg-yellow-500' :
                  payment.status === 'failed' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {payment.status === 'completed' ? 'Payment Completed' :
                     payment.status === 'pending' ? 'Processing Payment' :
                     payment.status === 'failed' ? 'Payment Failed' :
                     'Payment Refunded'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {payment.status === 'completed' ? 'Transaction confirmed and completed successfully' :
                     payment.status === 'pending' ? 'Awaiting bank confirmation' :
                     payment.status === 'failed' ? 'Transaction declined by payment provider' :
                     'Refund processed to original payment method'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3">
            {/* Left-side optional actions (stacked on small screens) */}
            <div className="flex items-center gap-2 order-2 sm:order-1">
              {payment.status === 'failed' && (
                <button
                  onClick={handleRetryPayment}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
                  title="Retry this payment"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              )}

              {payment.status === 'completed' && (
                <button
                  onClick={handleRefundPayment}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-2xl shadow-md hover:bg-red-700 transition transform hover:-translate-y-0.5"
                  title="Process a refund"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Refund
                </button>
              )}

              <button
                onClick={handlePrintReceipt}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-heritage-green border border-heritage-green/20 bg-white/80 rounded-2xl shadow-sm hover:backdrop-blur-sm hover:translate-y-0 hover:-translate-y-0.5 transition transform"
                title="Print receipt"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>

            {/* Primary action */}
            <div className="order-1 sm:order-2">
              <button
                className="inline-flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5"
                title="Send receipt to guest"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentDetails;