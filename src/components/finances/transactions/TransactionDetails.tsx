import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  time: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  method: 'cash' | 'card' | 'transfer' | 'check';
}

interface TransactionDetailsProps {
  transaction: Transaction | null;
  onClose: () => void;
  onViewFullDetails?: (transaction: Transaction) => void;
  onCreateInvoice?: (transaction: Transaction) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  transaction, 
  onClose, 
  onViewFullDetails, 
  onCreateInvoice 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handler functions
  const handleViewFullDetails = (transaction: Transaction) => {
    console.log('handleViewFullDetails called with:', transaction);
    if (onViewFullDetails) {
      console.log('Calling onViewFullDetails...');
      onViewFullDetails(transaction);
    } else {
      console.log('No onViewFullDetails handler, showing default alert');
      // Default behavior - show alert or modal
      alert(`Viewing full details for transaction: ${transaction.description}\nAmount: ${formatCurrency(transaction.amount)}\nReference: ${transaction.reference}`);
    }
  };

  const handleCreateInvoice = (transaction: Transaction) => {
    console.log('handleCreateInvoice called with:', transaction);
    if (onCreateInvoice) {
      console.log('Calling onCreateInvoice...');
      onCreateInvoice(transaction);
    } else {
      console.log('No onCreateInvoice handler, showing default alert');
      // Default behavior - show alert or navigate to invoice creation
      alert(`Creating invoice for transaction: ${transaction.description}\nAmount: ${formatCurrency(transaction.amount)}`);
    }
  };

  const handlePrintTransaction = (transaction: Transaction) => {
    // Create a simple receipt to print
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transaction Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #82A33D; padding-bottom: 10px; margin-bottom: 20px; }
          .details { margin: 10px 0; }
          .amount { font-size: 24px; font-weight: bold; color: #82A33D; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Balay Ginhawa Hotel</h2>
          <h3>Transaction Receipt</h3>
        </div>
        <div class="details">
          <p><strong>Transaction ID:</strong> ${transaction.reference}</p>
          <p><strong>Description:</strong> ${transaction.description}</p>
          <p><strong>Date:</strong> ${transaction.date} at ${transaction.time}</p>
          <p><strong>Payment Method:</strong> ${transaction.method}</p>
          <p><strong>Status:</strong> ${transaction.status}</p>
          <p class="amount"><strong>Amount:</strong> ${formatCurrency(transaction.amount)}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDownloadReceipt = (transaction: Transaction) => {
    // Create downloadable receipt data
    const receiptData = {
      transactionId: transaction.reference,
      description: transaction.description,
      amount: formatCurrency(transaction.amount),
      date: transaction.date,
      time: transaction.time,
      method: transaction.method,
      status: transaction.status
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction-${transaction.reference}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Loading simulation
  useEffect(() => {
    console.log('TransactionDetails received transaction:', transaction);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); // Slightly longer delay
    return () => clearTimeout(timer);
  }, [transaction]);

  if (isLoading) {
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
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-6 h-full">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Skeleton className="w-16 h-16 rounded-full mb-4" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </>
    );
  }

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
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-6 h-full animate-slide-in-right">
      {transaction ? (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-heritage-green">Transaction Details</h3>
            <button
              onClick={onClose}
              className="text-heritage-neutral hover:text-heritage-green transition-colors p-2 hover:bg-heritage-green/10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-6 flex-1">
            <div>
              <label className="text-base font-semibold text-heritage-neutral mb-2 block">Description</label>
              <p className="text-lg text-heritage-green font-semibold">{transaction.description}</p>
            </div>
            <div>
              <label className="text-base font-semibold text-heritage-neutral mb-2 block">Amount</label>
              <p className="text-3xl font-bold text-heritage-green">{formatCurrency(transaction.amount)}</p>
            </div>
            <div>
              <label className="text-base font-semibold text-heritage-neutral mb-2 block">Status</label>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                transaction.status === 'completed' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : transaction.status === 'pending'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  transaction.status === 'completed' ? 'bg-emerald-500' :
                  transaction.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
            <div>
              <label className="text-base font-semibold text-heritage-neutral mb-2 block">Reference Number</label>
              <p className="text-lg text-heritage-green font-mono bg-heritage-light/20 px-3 py-2 rounded-lg">{transaction.reference}</p>
            </div>
            <div>
              <label className="text-base font-semibold text-heritage-neutral mb-2 block">Payment Method</label>
              <p className="text-lg text-heritage-green capitalize font-medium">{transaction.method}</p>
            </div>
            <div>
              <label className="text-base font-semibold text-heritage-neutral mb-2 block">Date & Time</label>
              <p className="text-lg text-heritage-green font-medium">{transaction.date} at {transaction.time}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="pt-6 border-t border-heritage-neutral/20">
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    console.log('View Full Details button clicked');
                    handleViewFullDetails(transaction);
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-2xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-semibold">View Full Details</span>
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Create Invoice button clicked');
                    handleCreateInvoice(transaction);
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-heritage-light/80 to-heritage-green/20 border-2 border-heritage-green text-heritage-green rounded-2xl hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-heritage-light/30 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">Create Invoice</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handlePrintTransaction(transaction)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/80 border border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5 hover:border-heritage-green transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="text-sm font-medium">Print</span>
                  </button>
                  
                  <button 
                    onClick={() => handleDownloadReceipt(transaction)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/80 border border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5 hover:border-heritage-green transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-neutral/5 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-bl from-heritage-green/10 to-transparent"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-heritage-light/20 to-transparent"></div>
          
          <div className="relative z-10">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-heritage-green/20 to-heritage-neutral/20 rounded-3xl flex items-center justify-center mx-auto shadow-lg border border-heritage-green/10 group-hover:scale-105 transition-all duration-500">
                <svg className="w-12 h-12 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur opacity-30"></div>
            </div>
            
            {/* Content */}
            <div className="space-y-4 max-w-sm">
              <h3 className="text-2xl font-bold text-heritage-green">No Transaction Selected</h3>
              <p className="text-heritage-neutral/70 leading-relaxed">Click on any transaction from the list to view detailed information including payment method, reference number, and transaction history.</p>
              
              {/* Action Hint */}
              <div className="mt-8 p-4 bg-heritage-light/30 rounded-2xl border border-heritage-green/10">
                <div className="flex items-center justify-center space-x-2 text-heritage-green/80">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="text-sm font-medium">Select a transaction to get started</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default TransactionDetails;
