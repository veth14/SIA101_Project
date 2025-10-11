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
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); // Slightly longer delay
    return () => clearTimeout(timer);
  }, []);

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
