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
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-slideInUp border border-heritage-neutral/10">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 rounded-t-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-heritage-green rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-heritage-green">Create Invoice</h2>
                <p className="text-sm text-heritage-neutral">Generate invoice for transaction #{transaction.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10 rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Transaction Reference */}
            <div className="p-4 bg-gradient-to-r from-heritage-green/10 to-heritage-light/20 rounded-xl border border-heritage-green/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-heritage-neutral uppercase tracking-wide">Reference Transaction</h3>
                  <p className="text-lg font-bold text-heritage-green">{transaction.description}</p>
                  <p className="text-sm text-heritage-neutral">Transaction #{transaction.id} • {transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-heritage-green">₱{transaction.amount.toLocaleString()}</p>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-heritage-green flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-heritage-neutral mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={invoiceData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-heritage-neutral/30 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-heritage-neutral mb-2">Email Address</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={invoiceData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-heritage-neutral/30 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors"
                    placeholder="customer@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-heritage-neutral mb-2">Billing Address</label>
                  <textarea
                    name="customerAddress"
                    value={invoiceData.customerAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-heritage-neutral/30 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors resize-none"
                    placeholder="Enter billing address"
                  />
                </div>
              </div>

              {/* Invoice Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-heritage-green flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Invoice Settings
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-heritage-neutral mb-2">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-heritage-neutral/30 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors"
                    placeholder="INV-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-heritage-neutral mb-2">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={invoiceData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-heritage-neutral/30 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-heritage-neutral mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    name="taxRate"
                    value={invoiceData.taxRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border border-heritage-neutral/30 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors"
                    placeholder="12.00"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-heritage-neutral mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-heritage-neutral/30 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors resize-none"
                placeholder="Any additional notes or terms for this invoice..."
              />
            </div>

            {/* Invoice Summary */}
            <div className="p-6 bg-gradient-to-r from-heritage-neutral/5 to-heritage-light/10 rounded-xl border border-heritage-neutral/10">
              <h4 className="text-lg font-bold text-heritage-green mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Invoice Summary
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-heritage-neutral">Subtotal:</span>
                  <span className="font-semibold text-heritage-green">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-heritage-neutral">Tax ({invoiceData.taxRate}%):</span>
                  <span className="font-semibold text-heritage-green">₱{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-heritage-neutral/20">
                  <span className="text-lg font-bold text-heritage-green">Total Amount:</span>
                  <span className="text-xl font-bold text-heritage-green">₱{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-heritage-neutral/10">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={!invoiceData.customerName || isCreating}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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