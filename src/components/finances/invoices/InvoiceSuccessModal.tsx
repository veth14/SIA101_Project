import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Invoice } from './InvoiceList';

interface InvoiceSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const InvoiceSuccessModal: React.FC<InvoiceSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  invoice 
}) => {
  // Auto-close success modal after 10 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && invoice) {
      timer = setTimeout(() => {
        onClose();
      }, 10000); // 10 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, invoice, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen || !invoice) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return createPortal(
    <>
      <style>{`
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .modal-enter {
          animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="relative w-full max-w-lg mx-4 overflow-hidden bg-white shadow-2xl modal-enter rounded-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-emerald-50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-heritage-green">
                  Invoice Created Successfully!
                </h2>
                <p className="text-sm text-heritage-neutral">
                  Your invoice has been generated and saved
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 transition-all duration-200 rounded-full text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Content */}
            <div className="flex flex-col items-center justify-center py-8 text-center">
              {/* Success Animation Background */}
              <div className="relative mb-8">
                <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full shadow-lg bg-gradient-to-br from-emerald-400 to-emerald-600 animate-bounce">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Decorative rings */}
                <div className="absolute inset-0 w-24 h-24 mx-auto border-4 rounded-full border-emerald-200 animate-ping opacity-20"></div>
                <div className="absolute inset-0 w-32 h-32 mx-auto -m-4 border-2 rounded-full border-emerald-100 animate-pulse opacity-30"></div>
              </div>

              {/* Success Message */}
              <h3 className="mb-4 text-3xl font-bold text-gray-900">
                Invoice Created Successfully!
              </h3>
              
              <p className="mb-2 text-gray-600">
                Invoice <span className="font-semibold text-heritage-green">{invoice.id}</span> has been created for
              </p>
              
              <p className="mb-8 text-xl font-semibold text-gray-800">
                {invoice.guestName} - Room {invoice.roomNumber}
              </p>

              {/* Invoice Summary Card */}
              <div className="w-full max-w-md p-6 mb-8 border bg-gradient-to-br from-heritage-green/5 to-emerald-50 rounded-2xl backdrop-blur-sm border-heritage-green/20">
                <h4 className="mb-4 text-lg font-semibold text-heritage-green">Invoice Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-xl font-bold text-heritage-green">
                      ₱{invoice.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Check-in:</span>
                    <span className="text-sm font-medium">{invoice.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Check-out:</span>
                    <span className="text-sm font-medium">{invoice.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Items:</span>
                    <span className="text-sm font-medium">{invoice.items?.length || 0} item(s)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col w-full max-w-sm gap-4">
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-2xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:scale-105 hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default InvoiceSuccessModal;