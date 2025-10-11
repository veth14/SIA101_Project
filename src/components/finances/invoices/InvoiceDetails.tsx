import React from 'react';
import type { Invoice } from './InvoiceList';

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onClose: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl max-w-4xl w-full max-h-[90vh]">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-heritage-light/20 to-heritage-green/3 rounded-3xl opacity-60"></div>
        <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-bl from-heritage-green/10 to-transparent"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-heritage-light/30 to-transparent"></div>
        
        <div className="relative z-10">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-heritage-neutral/10">
            <div>
              <h2 className="text-2xl font-bold text-heritage-green">Invoice Details</h2>
              <p className="text-sm text-heritage-neutral/70">View and manage invoice information</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10 rounded-2xl transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Invoice Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Invoice Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-heritage-green to-heritage-neutral shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-heritage-green">Invoice #{invoice.id}</h3>
                  <p className="text-sm text-heritage-neutral/70 mt-1">Generated for {invoice.guestName}</p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(invoice.status)}
                <p className="text-sm text-heritage-neutral/70 mt-2">Total: {formatCurrency(invoice.totalAmount)}</p>
              </div>
            </div>

            {/* Guest Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-heritage-light/30 backdrop-blur-sm rounded-2xl p-6 border border-heritage-neutral/10">
                <h4 className="text-lg font-semibold text-heritage-green mb-4 flex items-center gap-2">
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

              <div className="bg-heritage-light/30 backdrop-blur-sm rounded-2xl p-6 border border-heritage-neutral/10">
                <h4 className="text-lg font-semibold text-heritage-green mb-4 flex items-center gap-2">
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

            {/* Invoice Items */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-heritage-green mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Invoice Items
              </h4>
              <div className="bg-heritage-light/20 backdrop-blur-sm rounded-2xl border border-heritage-neutral/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-heritage-green/10 border-b border-heritage-neutral/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-heritage-green">Description</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-heritage-green">Quantity</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-heritage-green">Unit Price</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-heritage-green">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-heritage-neutral/10">
                      {invoice.items.map((item) => (
                        <tr key={item.id} className="hover:bg-heritage-green/5 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-heritage-green">{item.description}</p>
                              <p className="text-sm text-heritage-neutral/70 capitalize">{item.category}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-heritage-green">{item.quantity}</td>
                          <td className="px-6 py-4 text-right font-medium text-heritage-green">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-6 py-4 text-right font-semibold text-heritage-green">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="bg-heritage-light/30 backdrop-blur-sm rounded-2xl p-6 border border-heritage-neutral/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-heritage-green mb-2">Invoice Summary</h4>
                  <p className="text-sm text-heritage-neutral/70">{invoice.items.length} items • {invoice.status} payment</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-heritage-neutral/70">Total Amount</p>
                  <p className="text-3xl font-bold text-heritage-green">{formatCurrency(invoice.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-heritage-neutral/10 bg-heritage-light/20 backdrop-blur-sm">
            <div className="flex gap-3 justify-end">
              <button className="px-6 py-3 text-sm font-medium text-heritage-neutral border border-heritage-neutral/30 rounded-2xl hover:bg-heritage-neutral/5 hover:border-heritage-neutral/50 transition-all duration-300">
                Print Invoice
              </button>
              <button className="px-6 py-3 text-sm font-medium text-heritage-neutral border border-heritage-neutral/30 rounded-2xl hover:bg-heritage-neutral/5 hover:border-heritage-neutral/50 transition-all duration-300">
                Download PDF
              </button>
              <button className="px-6 py-3 text-sm font-medium text-white bg-heritage-green hover:bg-heritage-green/90 rounded-2xl transition-all duration-300 shadow-lg">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;