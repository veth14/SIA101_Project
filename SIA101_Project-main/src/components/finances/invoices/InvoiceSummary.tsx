import React from 'react';

interface InvoiceSummaryProps {
  totalAmount: number;
  itemCount: number;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ totalAmount, itemCount }) => {
  const subtotal = totalAmount * 0.95;
  const tax = totalAmount * 0.05;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-heritage-green mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Invoice Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-heritage-neutral/20 shadow-sm">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-heritage-neutral/70">Items:</span>
              <span className="font-semibold text-heritage-green">{itemCount} items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-heritage-neutral/70">Subtotal:</span>
              <span className="font-semibold text-heritage-green">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-heritage-neutral/70">Tax (5%):</span>
              <span className="font-semibold text-heritage-green">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-heritage-neutral/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-heritage-green">Total Amount:</span>
                <span className="text-2xl font-bold text-heritage-green">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gradient-to-br from-heritage-green/10 to-heritage-light/30 rounded-2xl p-6 border border-heritage-green/20 shadow-sm">
          <h4 className="text-lg font-bold text-heritage-green mb-4">Payment Information</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-heritage-neutral/70">Payment Method</span>
              <p className="text-base font-semibold text-heritage-green">Credit Card</p>
            </div>
            <div>
              <span className="text-sm font-medium text-heritage-neutral/70">Currency</span>
              <p className="text-base font-semibold text-heritage-green">USD ($)</p>
            </div>
            <div>
              <span className="text-sm font-medium text-heritage-neutral/70">Invoice Date</span>
              <p className="text-base font-semibold text-heritage-green">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;