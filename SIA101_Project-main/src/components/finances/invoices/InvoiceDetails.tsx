import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';
import type { Invoice } from './InvoiceList';

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPrint?: (invoice: Invoice) => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose, onPrint }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
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
        <div className="h-[900px] p-6 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Skeleton className="w-16 h-16 mb-4 rounded-full" />
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-40 h-4" />
          </div>
        </div>
      </>
    );
  }

  if (!invoice) {
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
        <div className="h-[900px] p-6 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right">
          <div className="relative flex flex-col items-center justify-center h-full overflow-hidden text-center">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-neutral/5 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/3 -translate-y-1/3 bg-gradient-to-bl from-heritage-green/8 to-transparent"></div>
            <div className="absolute w-24 h-24 rounded-full -bottom-8 -left-8 bg-gradient-to-tr from-heritage-light/20 to-transparent"></div>
            
            <div className="relative z-10 max-w-md mx-auto space-y-6">
              {/* Large Icon */}
              <div className="relative mb-8">
                <div className="flex items-center justify-center w-24 h-24 mx-auto border shadow-2xl bg-gradient-to-br from-heritage-green/10 to-heritage-neutral/10 rounded-3xl border-heritage-green/20">
                  <svg className="w-12 h-12 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur-xl opacity-60"></div>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-heritage-green">No Invoice Selected</h3>
                <p className="max-w-sm mx-auto text-base leading-relaxed text-heritage-neutral/70">
                  Click on any invoice to view details
                </p>
                
                {/* Action Hint */}
                <div className="p-4 mt-8 border bg-heritage-light/20 rounded-2xl border-heritage-green/20 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3 text-heritage-green/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span className="text-sm font-medium">Select to get started</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
      // Create print content in a hidden div
      const printContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #82a33d; padding-bottom: 20px;">
            <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #82a33d 0%, #6b8533 100%); border-radius: 12px; margin-bottom: 15px;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px;">🏨 BALAY GINHAWA</h1>
            </div>
            <p style="color: #666; font-size: 16px; margin: 5px 0;">Heritage Hotel & Suites</p>
            <p style="color: #999; font-size: 14px;">123 Heritage Street, Manila | +63 (02) 123-4567</p>
          </div>

          <!-- Invoice Title and ID -->
          <div style="background: linear-gradient(135deg, #f8f9f5 0%, #e8f0d8 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #82a33d;">
            <div style="text-align: center;">
              <h2 style="color: #82a33d; margin: 0 0 10px 0; font-size: 28px;">INVOICE</h2>
              <p style="color: #666; font-size: 18px; margin: 0;"><strong>Invoice #${invoice.id}</strong></p>
              <div style="display: inline-block; margin-top: 10px; padding: 6px 16px; background: ${
                invoice.status === 'paid' ? '#d4edda' : 
                invoice.status === 'pending' ? '#fff3cd' : '#f8d7da'
              }; color: ${
                invoice.status === 'paid' ? '#155724' : 
                invoice.status === 'pending' ? '#856404' : '#721c24'
              }; border-radius: 20px; font-size: 14px; font-weight: bold;">
                ${invoice.status.toUpperCase()}
              </div>
            </div>
          </div>

          <!-- Guest and Stay Details -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div style="background: #fafbf8; padding: 20px; border-radius: 10px; border: 1px solid #e0e4d6;">
              <h3 style="color: #82a33d; margin: 0 0 15px 0; font-size: 16px; border-bottom: 2px solid #82a33d; padding-bottom: 8px;">Guest Information</h3>
              <p style="margin: 8px 0; color: #555;"><strong>Name:</strong> ${invoice.guestName}</p>
              <p style="margin: 8px 0; color: #555;"><strong>Room:</strong> ${invoice.roomNumber}</p>
            </div>
            <div style="background: #fafbf8; padding: 20px; border-radius: 10px; border: 1px solid #e0e4d6;">
              <h3 style="color: #82a33d; margin: 0 0 15px 0; font-size: 16px; border-bottom: 2px solid #82a33d; padding-bottom: 8px;">Stay Information</h3>
              <p style="margin: 8px 0; color: #555;"><strong>Check-in:</strong> ${invoice.checkIn}</p>
              <p style="margin: 8px 0; color: #555;"><strong>Check-out:</strong> ${invoice.checkOut}</p>
            </div>
          </div>

          <!-- Invoice Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: linear-gradient(135deg, #82a33d 0%, #6b8533 100%); color: white;">
                <th style="padding: 12px; text-align: left; border: 1px solid #82a33d; font-size: 14px;">#</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #82a33d; font-size: 14px;">Description</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #82a33d; font-size: 14px;">Category</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #82a33d; font-size: 14px;">Qty</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #82a33d; font-size: 14px;">Unit Price</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #82a33d; font-size: 14px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item, index) => `
                <tr style="background: ${index % 2 === 0 ? '#fafbf8' : 'white'};">
                  <td style="padding: 10px; border: 1px solid #e0e4d6; color: #555;">${index + 1}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; color: #555;">${item.description}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: center; color: #555;">${item.category}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: center; color: #555;">${item.quantity}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: right; color: #555;">${formatCurrency(item.unitPrice)}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: right; color: #82a33d; font-weight: bold;">${formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Payment Summary -->
          <div style="background: #fafbf8; padding: 20px; border-radius: 10px; border: 2px solid #82a33d; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #d0d6c4;">
              <span style="color: #555;">Subtotal:</span>
              <span style="color: #555; font-weight: bold;">${formatCurrency(invoice.totalAmount * 0.893)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #82a33d;">
              <span style="color: #555;">Tax (12%):</span>
              <span style="color: #555; font-weight: bold;">${formatCurrency(invoice.totalAmount * 0.107)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #82a33d; font-size: 20px; font-weight: bold;">TOTAL AMOUNT:</span>
              <span style="color: #82a33d; font-size: 28px; font-weight: bold;">${formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 2px solid #82a33d; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;"><strong>Thank you for choosing Balay Ginhawa Hotel!</strong></p>
            <p style="margin: 5px 0;">For inquiries, please contact us at info@balayginhawa.com or call +63 (02) 123-4567</p>
            <p style="margin: 10px 0; color: #999;">Printed on: ${new Date().toLocaleDateString('en-PH', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}</p>
          </div>
        </div>
      `;

      // Create or update print div
      let printDiv = document.getElementById('invoice-print-content');
      if (!printDiv) {
        printDiv = document.createElement('div');
        printDiv.id = 'invoice-print-content';
        printDiv.style.display = 'none';
        document.body.appendChild(printDiv);
      }
      printDiv.innerHTML = printContent;

      // Add print styles if not already added
      if (!document.getElementById('invoice-print-styles')) {
        const style = document.createElement('style');
        style.id = 'invoice-print-styles';
        style.textContent = `
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-print-content,
            #invoice-print-content * {
              visibility: visible;
            }
            #invoice-print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              display: block !important;
            }
            @page {
              margin: 1cm;
              size: A4;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Trigger print
      window.print();
    }
  };

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
        
        .invoice-items-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .invoice-items-scroll::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .invoice-items-scroll::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .invoice-items-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>
      <div className="h-[900px] p-5 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Compact Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-heritage-neutral/20">
            <h3 className="text-xl font-bold text-heritage-green">Invoice Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 transition-colors rounded-lg text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Utilizing Full Space */}
          <div className="flex-1 space-y-3">
            {/* Invoice ID & Status Row */}
            <div className="p-3 border bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 rounded-xl border-heritage-green/20">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-medium text-heritage-neutral/70">Invoice ID</label>
                  <p className="text-base font-bold text-heritage-green">{invoice.id}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  invoice.status === 'paid' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : invoice.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    invoice.status === 'paid' ? 'bg-emerald-500' :
                    invoice.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Amount - Highlighted */}
            <div className="p-4 text-center border bg-gradient-to-br from-heritage-green/10 to-heritage-neutral/5 rounded-xl border-heritage-green/30">
              <label className="block mb-1 text-xs font-medium text-heritage-neutral/70">Total Amount</label>
              <p className="text-3xl font-black text-heritage-green">{formatCurrency(invoice.totalAmount)}</p>
              <p className="mt-1 text-xs text-heritage-neutral/60">{invoice.items.length} items included</p>
            </div>

            {/* Guest & Room Info - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border rounded-xl border-heritage-neutral/20">
                <label className="block mb-1 text-xs font-medium text-heritage-neutral/70">Guest Name</label>
                <p className="text-sm font-semibold text-heritage-green">{invoice.guestName}</p>
              </div>
              <div className="p-3 bg-white border rounded-xl border-heritage-neutral/20">
                <label className="block mb-1 text-xs font-medium text-heritage-neutral/70">Room</label>
                <p className="text-sm font-semibold text-heritage-green">Room {invoice.roomNumber}</p>
              </div>
            </div>

            {/* Check-in & Check-out - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border rounded-xl border-heritage-neutral/20">
                <label className="block mb-1 text-xs font-medium text-heritage-neutral/70">Check-in</label>
                <p className="text-sm font-semibold text-heritage-green">{invoice.checkIn}</p>
              </div>
              <div className="p-3 bg-white border rounded-xl border-heritage-neutral/20">
                <label className="block mb-1 text-xs font-medium text-heritage-neutral/70">Check-out</label>
                <p className="text-sm font-semibold text-heritage-green">{invoice.checkOut}</p>
              </div>
            </div>

            {/* Invoice Items Preview */}
            <div className="p-3 bg-white border rounded-xl border-heritage-neutral/20">
              <label className="block mb-2 text-xs font-medium text-heritage-neutral/70">Invoice Items</label>
              <div className="space-y-1.5 max-h-32 overflow-y-auto invoice-items-scroll">
                {invoice.items.slice(0, 4).map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-heritage-green/5">
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full bg-heritage-green">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-heritage-green line-clamp-1">{item.description}</span>
                    </div>
                    <span className="text-xs font-bold text-heritage-green">{formatCurrency(item.total)}</span>
                  </div>
                ))}
                {invoice.items.length > 4 && (
                  <p className="pt-1 text-xs text-center text-heritage-neutral/60">
                    +{invoice.items.length - 4} more items
                  </p>
                )}
              </div>
            </div>

            {/* Payment Summary - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-white border rounded-lg border-heritage-neutral/20">
                <label className="block mb-0.5 text-xs font-medium text-heritage-neutral/70">Subtotal</label>
                <p className="text-sm font-bold text-heritage-green">{formatCurrency(invoice.totalAmount * 0.893)}</p>
              </div>
              <div className="p-2.5 bg-white border rounded-lg border-heritage-neutral/20">
                <label className="block mb-0.5 text-xs font-medium text-heritage-neutral/70">Tax (12%)</label>
                <p className="text-sm font-bold text-heritage-green">{formatCurrency(invoice.totalAmount * 0.107)}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="p-2.5 border bg-gradient-to-r from-heritage-light/20 to-heritage-green/5 rounded-lg border-heritage-neutral/20">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-heritage-neutral/70">Payment Method:</span>
                  <p className="font-semibold text-heritage-green">Card Payment</p>
                </div>
                <div>
                  <span className="text-heritage-neutral/70">Invoice Date:</span>
                  <p className="font-semibold text-heritage-green">{invoice.checkOut}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2 border-t border-heritage-neutral/20">
              <button 
                onClick={handlePrint}
                className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="text-sm font-semibold">Print Invoice</span>
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="flex items-center justify-center px-3 py-2.5 space-x-1.5 transition-all duration-300 border shadow-sm bg-white/80 border-heritage-neutral/30 text-heritage-neutral rounded-lg hover:bg-heritage-neutral/5 hover:border-heritage-green hover:shadow-md"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-medium">Download</span>
                </button>
                
                <button 
                  className="flex items-center justify-center px-3 py-2.5 space-x-1.5 transition-all duration-300 border shadow-sm bg-white/80 border-heritage-neutral/30 text-heritage-neutral rounded-lg hover:bg-heritage-neutral/5 hover:border-heritage-green hover:shadow-md"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium">Email</span>
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