import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Transaction } from './TransactionDetails';
import SuccessModal from './SuccessModal';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, transaction }) => {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    invoiceNumber: `INV-${Date.now()}`,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: '',
    taxRate: 12, // Default VAT rate in Philippines
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdInvoiceNumber, setCreatedInvoiceNumber] = useState('');

  if (!isOpen || !transaction) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotals = () => {
    const subtotal = transaction.amount;
    const taxAmount = (subtotal * invoiceData.taxRate) / 100;
    const total = subtotal + taxAmount;
    
    return {
      subtotal,
      taxAmount,
      total
    };
  };

  const handleCreateInvoice = async () => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically send the invoice data to your backend
    const invoicePayload = {
      ...invoiceData,
      transactionId: transaction.id,
      ...calculateTotals(),
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating invoice:', invoicePayload);
    
    setIsCreating(false);
    setCreatedInvoiceNumber(invoiceData.invoiceNumber);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    onClose(); // Close the invoice modal as well
  };

  const handleViewInvoice = () => {
    setIsSuccessModalOpen(false);
    onClose(); // Close the invoice modal
    
    // Navigate to invoices page with the created invoice data
    navigate('/admin/finances/invoices', { 
      state: { 
        newInvoice: {
          invoiceNumber: createdInvoiceNumber,
          transactionId: transaction?.id,
          customerName: invoiceData.customerName,
          amount: calculateTotals().total,
          status: 'draft',
          createdAt: new Date().toISOString()
        }
      } 
    });
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return createPortal(
    <>
      <style>{`
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
      <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 transform transition-all duration-300 animate-slideInUp">
          
          {/* Header */}
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
                  <h2 className="text-lg font-semibold text-emerald-700 md:text-2xl">Create Invoice</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Generate invoice for transaction #{transaction.id}
                  </p>
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
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Transaction Reference */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold tracking-wide text-gray-600 uppercase">Reference Transaction</h3>
                  <p className="text-base font-bold text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">Transaction #{transaction.id} • {transaction.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">Amount</p>
                  <p className="text-2xl font-black text-gray-900">₱{transaction.amount.toLocaleString()}</p>
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
            </div>

            {/* Invoice Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6">
              {/* Left column: Customer + Notes */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h4>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={invoiceData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={invoiceData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors"
                      placeholder="customer@email.com"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Billing Address</label>
                    <textarea
                      name="customerAddress"
                      value={invoiceData.customerAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors resize-none"
                      placeholder="Enter billing address"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={invoiceData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors resize-none"
                    placeholder="Any additional notes or terms for this invoice..."
                  />
                </div>
              </div>

              {/* Right column: Settings + Summary */}
              <div className="space-y-6">
                {/* Invoice Settings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Invoice Settings
                  </h4>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Invoice Number</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors"
                      placeholder="INV-001"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={invoiceData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Tax Rate (%)</label>
                    <input
                      type="number"
                      name="taxRate"
                      value={invoiceData.taxRate}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors"
                      placeholder="12.00"
                    />
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100/60 rounded-xl border border-gray-200/60">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Invoice Summary
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                      <span className="font-semibold text-gray-900">₱{taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Total Amount</span>
                      <span className="px-3 py-1 text-base font-extrabold text-[#82A33D] bg-[#82A33D]/10 rounded-lg">₱{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={!invoiceData.customerName || isCreating}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#82A33D] to-emerald-600 rounded-xl hover:from-[#6d8735] hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Invoice...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Create Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Invoice Created Successfully!"
        message="Your invoice has been generated and is ready for processing."
        invoiceNumber={createdInvoiceNumber}
        onViewInvoice={handleViewInvoice}
      />
    </>,
    document.body
  );
};

export default InvoiceModal;