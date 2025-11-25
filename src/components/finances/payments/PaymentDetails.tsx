import React, { useEffect } from 'react';
import type { Payment } from './PaymentList';

interface PaymentDetailsProps {
  payment: Payment | null;
  onClose: () => void;
  onPrint?: (payment: Payment) => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose, onPrint }) => {
  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!payment) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [payment]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMethodDetails = (method: string) => {
    switch (method) {
      case 'card':
        return {
          name: 'Credit/Debit Card',
          icon: '💳',
          color: 'bg-blue-100 text-blue-800',
          details: ['Card ending in ****4567', 'Visa', 'Authorized by Bank'],
          iconColor: 'text-blue-600'
        };
      case 'cash':
        return {
          name: 'Cash Payment',
          icon: '💰',
          color: 'bg-green-100 text-green-800',
          details: ['Cash received', 'Change given: ₱100.00', 'Receipt printed'],
          iconColor: 'text-green-600'
        };
      case 'digital':
        return {
          name: 'Digital Wallet',
          icon: '📱',
          color: 'bg-purple-100 text-purple-800',
          details: ['GCash payment', 'Instant transfer', 'Verified account'],
          iconColor: 'text-purple-600'
        };
      case 'bank_transfer':
        return {
          name: 'Bank Transfer',
          icon: '🏦',
          color: 'bg-indigo-100 text-indigo-800',
          details: ['BPI Transfer', 'Reference: 1234567890', 'Cleared'],
          iconColor: 'text-indigo-600'
        };
      default:
        return {
          name: 'Other',
          icon: '💸',
          color: 'bg-gray-100 text-gray-800',
          details: ['Payment received', 'No additional details'],
          iconColor: 'text-gray-600'
        };
    }
  };

  const handlePrint = () => {
    if (onPrint && payment) {
      onPrint(payment);
    } else {
      console.log('Print payment:', payment);
      window.print();
    }
  };

  const handleDownload = () => {
    console.log('Download payment details:', payment);
    // Implement download functionality
  };

  const handleSendReceipt = () => {
    console.log('Send receipt for payment:', payment?.id);
    // Implement send receipt functionality
  };

  const handleRetryPayment = () => {
    console.log('Retry payment:', payment?.id);
    // Implement retry payment functionality
  };

  const handleRefundPayment = () => {
    console.log('Refund payment:', payment?.id);
    // Implement refund functionality
  };

  if (!payment) {
    return (
      <>
        <style>{
          `@keyframes slide-in-right {
            0% { opacity: 0; transform: translateX(30px) scale(0.98); }
            100% { opacity: 1; transform: translateX(0) scale(1); }
          }
          .animate-slide-in-right { animation: slide-in-right 0.7s ease-out; }`
        }</style>
        <div className="h-full min-h-0 p-6 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right">
          <div className="relative flex flex-col items-center justify-center h-full overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-neutral/5 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/3 -translate-y-1/3 bg-gradient-to-bl from-heritage-green/8 to-transparent"></div>
            <div className="absolute w-24 h-24 rounded-full -bottom-8 -left-8 bg-gradient-to-tr from-heritage-light/20 to-transparent"></div>
            
            <div className="relative z-10 max-w-md mx-auto space-y-6">
              <div className="relative mb-8">
                <div className="flex items-center justify-center w-24 h-24 mx-auto border shadow-2xl bg-gradient-to-br from-heritage-green/10 to-heritage-neutral/10 rounded-3xl border-heritage-green/20">
                  <svg className="w-12 h-12 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur-xl opacity-60"></div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-heritage-green">No Payment Selected</h3>
                <p className="max-w-sm mx-auto text-base leading-relaxed text-heritage-neutral/70">
                  Click on any payment to view details
                </p>
                
                <div className="p-4 mt-8 border bg-heritage-light/20 rounded-2xl border-heritage-green/20 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3 text-heritage-green/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span className="text-sm font-medium">Select to get started</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default method to 'other' if not provided
  const methodInfo = getMethodDetails(payment.paymentMethod || 'other');
  const from = 1;
  const to = 1;
  const totalItems = 1;

  return (
    <>
      <style>{
        `@keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(30px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.7s ease-out; }
        .payment-items-scroll::-webkit-scrollbar { width: 4px; }
        .payment-items-scroll::-webkit-scrollbar-track { background: rgba(130, 163, 61, 0.05); border-radius: 10px; }
        .payment-items-scroll::-webkit-scrollbar-thumb { background: rgba(130, 163, 61, 0.3); border-radius: 10px; }
        .payment-items-scroll::-webkit-scrollbar-thumb:hover { background: rgba(130, 163, 61, 0.5); }`
      }</style>
      <div className="h-full min-h-0 p-5 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Compact Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Payment Details</h3>
                  <p className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                      #{payment.id}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="truncate max-w-[320px]">{payment.guestName}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 px-6 pt-5 pb-4 space-y-5 overflow-y-auto payment-items-scroll">
            {/* Amount + status highlight */}
            <div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#82A33D]/8 via-white to-emerald-50 border border-[#82A33D]/18 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">Total Amount</p>
                  <p className="mt-1 text-[26px] leading-tight font-extrabold text-gray-900">{formatCurrency(payment.amount)}</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1.5 text-xs">
                  <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full bg-[#111827] text-white tracking-wide shadow-sm">
                    {payment.status.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-gray-500">{payment.transactionDate} • {payment.transactionTime}</span>
                </div>
              </div>
            </div>

            {/* Two-column detail grid */}
            <div className="grid gap-5 md:grid-cols-2 items-stretch">
              {/* Guest & booking info */}
              <div className="space-y-3 h-full">
                <h4 className="text-[11px] font-bold tracking-wide text-gray-500 uppercase">Guest Information</h4>
                <div className="p-4 space-y-3 bg-white border border-gray-100 rounded-2xl shadow-sm h-full flex flex-col justify-between">

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500">Guest Name</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">{payment.guestName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500">Room</p>
                    <p className="mt-0.5 text-sm text-gray-900">Room {payment.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500">Reference</p>
                    <p className="mt-0.5 text-[11px] font-mono text-gray-800 break-all">{payment.reference}</p>
                  </div>
                </div>
              </div>

              {/* Transaction description & method */}
              <div className="space-y-3 h-full">
                <h4 className="text-[11px] font-bold tracking-wide text-gray-500 uppercase">Transaction Details</h4>
                <div className="p-4 space-y-4 bg-white border border-gray-100 rounded-2xl shadow-sm h-full flex flex-col justify-between">

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500">Description</p>
                    <p className="mt-0.5 text-sm text-gray-900">{payment.description}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 mb-2">Payment Method</p>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${methodInfo.color}`}>
                      <span className={`text-lg ${methodInfo.iconColor}`}>{methodInfo.icon}</span>
                      <span>{methodInfo.name}</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-[11px] text-gray-600 list-disc list-inside">
                      {methodInfo.details.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green hover:to-heritage-neutral transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] group text-sm font-semibold"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                <span>Print Receipt</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02] group text-sm font-semibold"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;