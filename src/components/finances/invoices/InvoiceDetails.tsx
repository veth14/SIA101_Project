import React, { useState } from 'react';
import type { Invoice } from './InvoiceList';

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPrint?: (invoice: Invoice) => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose, onPrint }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!invoice) return null;

  // Pagination logic
  const totalPages = Math.ceil(invoice.items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = invoice.items.slice(startIndex, endIndex);

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
      // Default print functionality
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .details { margin-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f2f2f2; }
                .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>BALAY GINHAWA</h1>
                <p>Heritage Hotel & Suites</p>
                <h2>INVOICE ${invoice.id}</h2>
              </div>
              <div class="details">
                <p><strong>Guest:</strong> ${invoice.guestName}</p>
                <p><strong>Room:</strong> ${invoice.roomNumber}</p>
                <p><strong>Check-in:</strong> ${invoice.checkIn}</p>
                <p><strong>Check-out:</strong> ${invoice.checkOut}</p>
                <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
              </div>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.category}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.unitPrice.toFixed(2)}</td>
                      <td>$${item.total.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="total">
                <p>Total Amount: $${invoice.totalAmount.toFixed(2)}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '✓' },
      pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '⏳' },
      overdue: { color: 'bg-red-100 text-red-800 border-red-200', icon: '!' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.1);
          border-radius: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative overflow-hidden bg-white rounded-3xl border-2 border-heritage-green/20 shadow-2xl w-full max-w-4xl max-h-[90vh]">
        {/* Clean Background Elements */}
        <div className="absolute inset-0 bg-white rounded-3xl"></div>
        
        <div className="relative z-10">
          {/* Enhanced Modal Header */}
          <div className="flex items-center justify-between p-8 border-b-2 bg-white border-heritage-green/15">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 border-2 shadow-xl bg-gradient-to-br from-heritage-green via-heritage-green/90 to-heritage-neutral rounded-3xl border-heritage-green/20">
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-black text-heritage-green">Invoice Details</h2>
                <p className="text-base font-semibold text-heritage-neutral/80">Complete invoice information and management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-4 transition-all duration-300 border-2 border-transparent text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/15 rounded-2xl hover:border-heritage-green/20"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Enhanced Invoice Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar bg-white">
            {/* Invoice Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 shadow-lg rounded-2xl bg-gradient-to-br from-heritage-green to-heritage-neutral">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-heritage-green">Invoice #{invoice.id}</h3>
                  <p className="mt-1 text-sm text-heritage-neutral/70">Generated for {invoice.guestName}</p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(invoice.status)}
                <p className="mt-2 text-sm text-heritage-neutral/70">Total: {formatCurrency(invoice.totalAmount)}</p>
              </div>
            </div>

            {/* Guest Information */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-heritage-neutral/20">
                <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Guest Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-heritage-neutral/70">Guest Name</p>
                    <p className="font-semibold text-heritage-green">{invoice.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-heritage-neutral/70">Room Number</p>
                    <p className="font-semibold text-heritage-green">Room {invoice.roomNumber}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border shadow-sm rounded-2xl border-heritage-neutral/20">
                <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Stay Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-heritage-neutral/70">Check-in Date</p>
                    <p className="font-semibold text-heritage-green">{invoice.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-heritage-neutral/70">Check-out Date</p>
                    <p className="font-semibold text-heritage-green">{invoice.checkOut}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items - Compact Modern Design */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-heritage-green">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Invoice Items ({invoice.items.length})
                </h4>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm transition-colors rounded-lg bg-heritage-green/10 text-heritage-green hover:bg-heritage-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-heritage-neutral/70">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm transition-colors rounded-lg bg-heritage-green/10 text-heritage-green hover:bg-heritage-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
              
              {/* Compact Grid Layout */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {currentItems.map((item, index) => (
                  <div key={item.id} className="relative p-4 transition-all duration-300 bg-white border shadow-md group rounded-xl border-heritage-neutral/20 hover:shadow-lg hover:-translate-y-1">
                    {/* Compact Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full shadow-sm bg-gradient-to-br from-heritage-green to-heritage-neutral">
                          <span className="text-xs font-bold text-white">{startIndex + index + 1}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          item.category === 'room' ? 'bg-blue-100 text-blue-700' :
                          item.category === 'food' ? 'bg-orange-100 text-orange-700' :
                          item.category === 'services' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-heritage-green">{formatCurrency(item.total)}</div>
                      </div>
                    </div>
                    
                    {/* Item Details */}
                    <div className="mb-3">
                      <h5 className="mb-1 text-sm font-semibold text-heritage-green line-clamp-2">
                        {item.description}
                      </h5>
                    </div>
                    
                    {/* Pricing Row */}
                    <div className="flex items-center justify-between p-2 text-sm rounded-lg bg-heritage-green/5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-heritage-neutral/60">Qty:</span>
                          <span className="px-2 py-1 text-xs font-bold text-white rounded-md bg-heritage-green">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-heritage-neutral/60">Unit:</span>
                          <span className="font-semibold text-heritage-green">{formatCurrency(item.unitPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Info */}
              {totalPages > 1 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-heritage-neutral/60">
                    Showing {startIndex + 1} to {Math.min(endIndex, invoice.items.length)} of {invoice.items.length} items
                  </p>
                </div>
              )}
            </div>

            {/* Invoice Summary */}
            <div className="p-6 bg-white border shadow-sm rounded-2xl border-heritage-neutral/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-heritage-green">Invoice Summary</h4>
                  <p className="text-sm text-heritage-neutral/70">{invoice.items.length} items • {invoice.status} payment</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-heritage-neutral/70">Total Amount</p>
                  <p className="text-3xl font-bold text-heritage-green">{formatCurrency(invoice.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="p-8 border-t-2 bg-white border-heritage-green/15">
            <div className="flex justify-end gap-4">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all duration-300 transform border-2 shadow-lg bg-white text-heritage-green border-heritage-green/30 rounded-2xl hover:bg-heritage-green/5 hover:border-heritage-green/50 hover:shadow-xl hover:-translate-y-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all duration-300 transform border-2 shadow-lg bg-white text-heritage-green border-heritage-green/30 rounded-2xl hover:bg-heritage-green/5 hover:border-heritage-green/50 hover:shadow-xl hover:-translate-y-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral hover:from-heritage-green/90 hover:to-heritage-neutral/90 rounded-2xl hover:shadow-xl hover:-translate-y-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
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