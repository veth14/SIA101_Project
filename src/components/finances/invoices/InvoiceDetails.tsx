import React from 'react';
import type { Invoice } from './InvoiceList';
import { printInvoiceDocument, downloadInvoicePdf } from './printing/invoicePrinting';

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPrint?: (invoice: Invoice) => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose, onPrint }) => {

  if (!invoice) {
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
        <div className="h-[1000px] p-6 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right">
          <div className="relative flex flex-col items-center justify-center h-full overflow-hidden text-center">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-neutral/5 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/3 -translate-y-1/3 bg-gradient-to-bl from-heritage-green/8 to-transparent"></div>
            <div className="absolute w-24 h-24 rounded-full -bottom-8 -left-8 bg-gradient-to-tr from-heritage-light/20 to-transparent"></div>
            
            <div className="relative z-10 max-w-md mx-auto space-y-6">
              {/* Large Icon */}
              <div className="relative mb-8">
                <div className="flex items-center justify-center w-24 h-24 mx-auto border shadow-2xl bg-gradient-to-br from-heritage-green/10 to-heritage-neutral/10 rounded-3xl border-heritage-green/20">
                  <svg className="w-12 h-12 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur-xl opacity-60"></div>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-heritage-green">No Invoice Selected</h3>
                <p className="max-w-sm mx-auto text-base leading-relaxed text-heritage-neutral/70">
                  Click on any invoice to view details
                </p>
                
                {/* Action Hint */}
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(invoice);
    } else {
      printInvoiceDocument(invoice);
    }
  };

  const handleDownload = () => {
    downloadInvoicePdf(invoice);
  };

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
        
        .invoice-items-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .invoice-items-scroll::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .invoice-items-scroll::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .invoice-items-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>
      <div className="h-[1000px] p-5 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right">
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
                  <h3 className="text-2xl font-black text-gray-900">Invoice Details</h3>
                  <p className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                      #{invoice.id}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="truncate max-w-[180px]">{invoice.guestName}</span>
                  </p>
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

          {/* Content - Utilizing Full Space */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Amount - Highlighted */}
            <div className="flex-1 p-6 space-y-8 overflow-hidden">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100/50 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-wide uppercase text-gray-600">Guest & Stay</p>
                  <p className="text-base font-bold text-gray-900">{invoice.guestName}</p>
                  <p className="text-xs text-gray-500">
                    Room {invoice.roomNumber} • {invoice.checkIn} - {invoice.checkOut}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xs font-semibold tracking-wide uppercase text-gray-600">Total Amount</p>
                  <p className="text-2xl font-black text-gray-900">{formatCurrency(invoice.totalAmount)}</p>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      invoice.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : invoice.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        invoice.status === 'paid'
                          ? 'bg-emerald-500'
                          : invoice.status === 'pending'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto invoice-items-scroll">
                {/* Invoice ID & Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                    <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Invoice ID</label>
                    <p className="text-base font-semibold text-gray-900">{invoice.id}</p>
                  </div>
                  <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                    <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Items</label>
                    <p className="text-base font-semibold text-gray-900">{invoice.items.length} total items</p>
                  </div>
                </div>

                {/* Guest & Room Info - 2 Column Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                    <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Guest Name</label>
                    <p className="text-base font-semibold text-gray-900">{invoice.guestName}</p>
                  </div>
                  <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                    <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Room</label>
                    <p className="text-base font-semibold text-gray-900">Room {invoice.roomNumber}</p>
                  </div>
                </div>

                {/* Check-in & Check-out - 2 Column Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                    <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Check-in</label>
                    <p className="text-base font-semibold text-gray-900">{invoice.checkIn}</p>
                  </div>
                  <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                    <label className="text-xs font-semibold tracking-wide uppercase text-gray-500">Check-out</label>
                    <p className="text-base font-semibold text-gray-900">{invoice.checkOut}</p>
                  </div>
                </div>

                {/* Invoice Items Preview */}
                <div className="p-4 bg-white border border-gray-200/60 rounded-lg">
                  <label className="block mb-2 text-xs font-semibold tracking-wide uppercase text-gray-500">Invoice Items</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {invoice.items.slice(0, 4).map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-[#82A33D]/5">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full bg-[#82A33D]">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium text-gray-900 line-clamp-1">{item.description}</span>
                        </div>
                        <span className="text-xs font-bold text-[#82A33D]">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                    {invoice.items.length > 4 && (
                      <p className="pt-1 text-xs text-center text-gray-500">
                        +{invoice.items.length - 4} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Summary - 2 Column Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-gray-200/60 rounded-lg">
                    <label className="block mb-0.5 text-xs font-semibold tracking-wide uppercase text-gray-500">Subtotal</label>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(invoice.totalAmount * 0.893)}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200/60 rounded-lg">
                    <label className="block mb-0.5 text-xs font-semibold tracking-wide uppercase text-gray-500">Tax (12%)</label>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(invoice.totalAmount * 0.107)}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="p-4 space-y-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">Payment Method</span>
                      <p className="font-semibold text-gray-900">Card Payment</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Invoice Date</span>
                      <p className="font-semibold text-gray-900">{invoice.checkOut}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white rounded-xl hover:from-[#6d8735] hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] group text-sm font-semibold"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print Invoice</span>
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
      </div>
    </>
  );
};

export default InvoiceDetails;