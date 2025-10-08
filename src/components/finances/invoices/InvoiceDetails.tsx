import React from 'react';
import type { Invoice } from './InvoiceList';

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onClose: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'room':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        );
      case 'food':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0l3-3m-3 3l-3-3" />
          </svg>
        );
      case 'services':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'taxes':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'room':
        return 'text-blue-600 bg-blue-50';
      case 'food':
        return 'text-orange-600 bg-orange-50';
      case 'services':
        return 'text-purple-600 bg-purple-50';
      case 'taxes':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  const handleSendEmail = () => {
    // In a real application, this would open email with invoice attached
    alert('Email functionality would be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#82A33D] to-[#6d8735]">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Invoice Details</h2>
            <p className="text-green-100">{invoice.id}</p>
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
          {/* Invoice Header Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {invoice.guestName}</p>
                <p><span className="font-medium">Room:</span> {invoice.roomNumber}</p>
                <p><span className="font-medium">Check-in:</span> {invoice.checkIn}</p>
                <p><span className="font-medium">Check-out:</span> {invoice.checkOut}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Invoice ID:</span> {invoice.id}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </p>
                <p><span className="font-medium">Issue Date:</span> {invoice.checkOut}</p>
                <p><span className="font-medium">Total Amount:</span> 
                  <span className="text-xl font-bold text-[#82A33D] ml-2">
                    ${invoice.totalAmount.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h3>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 font-semibold text-gray-700 text-sm">
                <div className="col-span-1">Category</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              {invoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-white transition-colors">
                  <div className="col-span-1">
                    <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>
                  <div className="col-span-5">
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-medium">
                    ${item.unitPrice.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right font-bold text-gray-900">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-[#82A33D]/10 to-[#6d8735]/10 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Amount</h3>
                <p className="text-sm text-gray-600">{invoice.items.length} items</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#82A33D]">
                  ${invoice.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={handlePrintInvoice}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={handleSendEmail}
              className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;