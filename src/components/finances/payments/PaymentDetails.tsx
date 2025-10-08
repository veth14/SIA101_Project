import React from 'react';
import type { Payment } from './PaymentList';

interface PaymentDetailsProps {
  payment: Payment | null;
  onClose: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
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
        return {
          name: 'Unknown',
          icon: '❓',
          color: 'text-gray-600 bg-gray-50',
          details: []
        };
    }
  };

  const methodInfo = getMethodDetails(payment.paymentMethod);

  const handleRetryPayment = () => {
    alert('Retry payment functionality would be implemented here');
  };

  const handleRefundPayment = () => {
    alert('Refund payment functionality would be implemented here');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#82A33D] to-[#6d8735]">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Payment Details</h2>
            <p className="text-green-100">{payment.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Payment Status Banner */}
          <div className={`p-4 rounded-xl mb-6 ${
            payment.status === 'completed' ? 'bg-green-50 border border-green-200' :
            payment.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
            payment.status === 'failed' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${
                  payment.status === 'completed' ? 'text-green-600' :
                  payment.status === 'pending' ? 'text-yellow-600' :
                  payment.status === 'failed' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {payment.status === 'completed' ? '✅' :
                   payment.status === 'pending' ? '⏳' :
                   payment.status === 'failed' ? '❌' : '↺'}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    payment.status === 'completed' ? 'text-green-800' :
                    payment.status === 'pending' ? 'text-yellow-800' :
                    payment.status === 'failed' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    Payment {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </h3>
                  <p className={`text-sm ${
                    payment.status === 'completed' ? 'text-green-600' :
                    payment.status === 'pending' ? 'text-yellow-600' :
                    payment.status === 'failed' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {payment.status === 'completed' ? 'Transaction processed successfully' :
                     payment.status === 'pending' ? 'Awaiting processing confirmation' :
                     payment.status === 'failed' ? 'Transaction was declined or failed' :
                     'Payment has been refunded to original method'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  payment.status === 'refunded' ? 'text-blue-600' : 
                  payment.status === 'failed' ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {payment.status === 'refunded' ? '-' : ''}${payment.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Guest Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Guest Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-600">Name:</span> {payment.guestName}</p>
                <p><span className="font-medium text-gray-600">Room:</span> {payment.roomNumber}</p>
                <p><span className="font-medium text-gray-600">Description:</span> {payment.description}</p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Transaction Details</h4>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-600">Reference:</span> {payment.reference}</p>
                <p><span className="font-medium text-gray-600">Date:</span> {payment.transactionDate}</p>
                <p><span className="font-medium text-gray-600">Time:</span> {payment.transactionTime}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${methodInfo.color}`}>
                <span className="text-2xl">{methodInfo.icon}</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{methodInfo.name}</h4>
                <p className="text-sm text-gray-600">Payment processed via {methodInfo.name.toLowerCase()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {methodInfo.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-[#82A33D] rounded-full"></div>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Transaction Timeline</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-[#82A33D] rounded-full"></div>
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

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3 justify-end">
            {payment.status === 'failed' && (
              <button
                onClick={handleRetryPayment}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Payment
              </button>
            )}
            {payment.status === 'completed' && (
              <button
                onClick={handleRefundPayment}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Process Refund
              </button>
            )}
            <button
              onClick={handlePrintReceipt}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;