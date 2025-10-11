import React, { useState } from 'react';
import InvoicesHeader from './InvoicesHeader';
import InvoiceList from './InvoiceList';
import type { Invoice } from './InvoiceList';

export const InvoicesPage: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <InvoicesHeader />
        
        {/* Full Width Layout */}
        <div className="w-full">
          {/* Split Layout Grid */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[700px]">
            {/* Left Side - Invoice List */}
            <div className="col-span-8">
              <InvoiceList 
                onInvoiceSelect={handleInvoiceSelect}
                selectedInvoice={selectedInvoice}
              />
            </div>

            {/* Right Side - Invoice Details Panel */}
            <div className="col-span-4">
              {selectedInvoice ? (
                <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl h-full">
                  {/* Background Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-green/5 rounded-3xl opacity-80"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-bl from-heritage-green/15 to-transparent"></div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-tr from-heritage-light/40 to-transparent"></div>
                  
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Details Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-heritage-green">Invoice Preview</h3>
                        <p className="text-sm text-heritage-neutral/70">Invoice #{selectedInvoice.id}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                        selectedInvoice.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : selectedInvoice.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-6 flex-1 overflow-y-auto">
                      {/* Guest and Amount Cards */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-heritage-light/30 backdrop-blur-sm rounded-2xl p-4 border border-heritage-neutral/10">
                          <p className="text-sm font-semibold text-heritage-neutral/70 mb-2">Guest Information</p>
                          <p className="text-xl font-bold text-heritage-green">{selectedInvoice.guestName}</p>
                          <p className="text-sm text-heritage-neutral/70">Room {selectedInvoice.roomNumber}</p>
                        </div>
                        <div className="bg-heritage-light/30 backdrop-blur-sm rounded-2xl p-4 border border-heritage-neutral/10">
                          <p className="text-sm font-semibold text-heritage-neutral/70 mb-2">Total Amount</p>
                          <p className="text-2xl font-bold text-heritage-green">${selectedInvoice.totalAmount.toFixed(2)}</p>
                          <p className="text-sm text-heritage-neutral/70">{selectedInvoice.items.length} items</p>
                        </div>
                      </div>
                      
                      {/* Stay Information */}
                      <div className="bg-heritage-light/30 backdrop-blur-sm rounded-2xl p-4 border border-heritage-neutral/10">
                        <h4 className="text-lg font-semibold text-heritage-green mb-4">Stay Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-heritage-neutral/70">Check-in:</span>
                            <span className="font-semibold text-heritage-green">{selectedInvoice.checkIn}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-heritage-neutral/70">Check-out:</span>
                            <span className="font-semibold text-heritage-green">{selectedInvoice.checkOut}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-heritage-light/30 backdrop-blur-sm rounded-2xl p-4 border border-heritage-neutral/10">
                        <h4 className="text-lg font-semibold text-heritage-green mb-4">Invoice Items</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {selectedInvoice.items.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-heritage-neutral/10 last:border-b-0">
                              <div>
                                <p className="font-medium text-heritage-green text-sm">{item.description}</p>
                                <p className="text-xs text-heritage-neutral/70 capitalize">{item.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-heritage-green text-sm">${item.total.toFixed(2)}</p>
                                <p className="text-xs text-heritage-neutral/70">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                          {selectedInvoice.items.length > 4 && (
                            <p className="text-xs text-heritage-neutral/70 text-center pt-2">
                              +{selectedInvoice.items.length - 4} more items
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-heritage-neutral/10">
                      <button 
                        onClick={() => {
                          // Open full details modal
                          // This could trigger the existing InvoiceDetails modal
                        }}
                        className="flex-1 px-4 py-3 text-sm font-medium text-heritage-green border border-heritage-neutral/30 rounded-2xl hover:bg-heritage-green/10 hover:border-heritage-green/50 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        View Full Details
                      </button>
                      <button className="flex-1 px-4 py-3 text-sm font-medium text-white bg-heritage-green hover:bg-heritage-green/90 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
                        Print Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Placeholder when no invoice is selected */
                <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-green/5 rounded-3xl opacity-80"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-bl from-heritage-green/15 to-transparent"></div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-tr from-heritage-light/40 to-transparent"></div>
                  
                  <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-heritage-green/10 rounded-3xl flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-heritage-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-heritage-green mb-3">No Invoice Selected</h3>
                    <p className="text-heritage-neutral/70 mb-6 max-w-sm">
                      Click on an invoice from the list to view its details and manage payment information.
                    </p>
                    <div className="w-full max-w-xs space-y-3">
                      <div className="h-2 bg-heritage-green/10 rounded-full"></div>
                      <div className="h-2 bg-heritage-green/10 rounded-full w-3/4"></div>
                      <div className="h-2 bg-heritage-green/10 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;