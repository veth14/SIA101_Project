import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';
import SimpleModal from './SimpleModal';
import InvoiceModal from './InvoiceModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('Modal render - isModalOpen:', isModalOpen, 'transaction:', transaction);
  }, [isModalOpen, transaction]);

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
    console.log('onViewFullDetails:', onViewFullDetails);
    console.log('isModalOpen before:', isModalOpen);
    
    if (onViewFullDetails) {
      onViewFullDetails(transaction);
    } else {
      // Open modal with transaction details
      setIsModalOpen(true);
      console.log('setIsModalOpen(true) called');
    }
  };

  const handleCreateInvoice = (transaction: Transaction) => {
    if (onCreateInvoice) {
      onCreateInvoice(transaction);
    } else {
      // Open the invoice modal instead of showing alert
      setIsInvoiceModalOpen(true);
    }
  };

  const handlePrintReceipt = (transaction: Transaction) => {
    // Create a hidden div with the receipt content
    const receiptHTML = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      ">
        <!-- Header -->
        <div style="
          text-align: center;
          border-bottom: 3px solid #7c8b4f;
          padding-bottom: 20px;
          margin-bottom: 30px;
        ">
          <div style="font-size: 28px; font-weight: bold; color: #7c8b4f; margin-bottom: 5px;">
            🏨 Balay Ginhawa Hotel
          </div>
          <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
            Your Comfort, Our Priority
          </div>
          <div style="font-size: 24px; font-weight: bold; color: #333; margin-top: 15px;">
            TRANSACTION RECEIPT
          </div>
          <div style="font-size: 16px; color: #7c8b4f; font-weight: 600;">
            Receipt #${transaction.reference}
          </div>
        </div>
        
        <!-- Transaction Summary -->
        <div style="
          background: linear-gradient(135deg, #f8f9f5 0%, #e8f0d8 100%);
          border: 2px solid #7c8b4f;
          border-radius: 12px;
          padding: 20px;
          margin: 30px 0;
          text-align: center;
        ">
          <div style="font-size: 18px; font-weight: bold; color: #7c8b4f;">
            Transaction #${transaction.id}
          </div>
          <div style="font-size: 16px; color: #555; margin: 5px 0;">
            ${transaction.description}
          </div>
          <div style="font-size: 32px; font-weight: bold; color: #7c8b4f; margin: 15px 0;">
            ₱${transaction.amount.toLocaleString()}
          </div>
          <div style="
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          ">
            ${transaction.status.toUpperCase()}
          </div>
        </div>
        
        <!-- Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;">
          <!-- Transaction Details -->
          <div style="background: #fafbf8; border: 1px solid #e0e4d6; border-radius: 8px; padding: 20px;">
            <div style="font-size: 16px; font-weight: bold; color: #7c8b4f; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #d0d6c4; padding-bottom: 8px;">
              Transaction Details
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dotted #d0d6c4;">
              <span style="font-weight: 600; color: #555;">Type:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dotted #d0d6c4;">
              <span style="font-weight: 600; color: #555;">Category:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.category || 'Service'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dotted #d0d6c4;">
              <span style="font-weight: 600; color: #555;">Payment Method:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.method.charAt(0).toUpperCase() + transaction.method.slice(1)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="font-weight: 600; color: #555;">Processing Time:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.time || 'Instant'}</span>
            </div>
          </div>
          
          <!-- Timeline Information -->
          <div style="background: #fafbf8; border: 1px solid #e0e4d6; border-radius: 8px; padding: 20px;">
            <div style="font-size: 16px; font-weight: bold; color: #7c8b4f; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #d0d6c4; padding-bottom: 8px;">
              Timeline Information
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dotted #d0d6c4;">
              <span style="font-weight: 600; color: #555;">Date Processed:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dotted #d0d6c4;">
              <span style="font-weight: 600; color: #555;">Time Stamp:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.time || '14:15'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dotted #d0d6c4;">
              <span style="font-weight: 600; color: #555;">Reference Number:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.reference}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="font-weight: 600; color: #555;">Location:</span>
              <span style="font-weight: 700; color: #7c8b4f;">Front Desk</span>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #7c8b4f; text-align: center;">
          <div style="font-size: 12px; color: #666; line-height: 1.4;">
            <strong>Balay Ginhawa Hotel</strong><br>
            123 Heritage Street, Heritage District<br>
            Phone: +63 (02) 123-4567 | Email: info@balayginhawa.com<br>
            <br>
            Thank you for choosing Balay Ginhawa Hotel!<br>
            For any questions regarding this transaction, please contact our front desk.
          </div>
          <div style="margin-top: 15px; font-size: 11px; color: #999;">
            Printed on: ${new Date().toLocaleString('en-PH', { 
              timeZone: 'Asia/Manila',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    `;

    // Create print styles
    const printStyles = `
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print-content, .print-content * {
            visibility: visible;
          }
          
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      </style>
    `;

    // Add styles to head if not already there
    if (!document.querySelector('#print-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'print-styles';
      styleElement.innerHTML = printStyles;
      document.head.appendChild(styleElement);
    }

    // Create or update print content div
    let printDiv = document.querySelector('#print-content') as HTMLElement;
    if (!printDiv) {
      printDiv = document.createElement('div');
      printDiv.id = 'print-content';
      printDiv.className = 'print-content';
      printDiv.style.display = 'none';
      document.body.appendChild(printDiv);
    }

    printDiv.innerHTML = receiptHTML;
    printDiv.style.display = 'block';

    // Print and cleanup
    window.print();
    
    // Hide the print content after printing
    setTimeout(() => {
      printDiv.style.display = 'none';
    }, 1000);
  };

  const handleDownloadPDF = async (transaction: Transaction) => {
    // Create a temporary div for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    
    // Add the receipt HTML content
    tempDiv.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; color: #333; line-height: 1.4;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 3px solid #7c8b4f; padding-bottom: 15px; margin-bottom: 25px;">
          <div style="font-size: 24px; font-weight: bold; color: #7c8b4f; margin-bottom: 5px;">🏨 Balay Ginhawa Hotel</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">Your Comfort, Our Priority</div>
          <div style="font-size: 20px; font-weight: bold; color: #333; margin: 10px 0 5px 0;">TRANSACTION RECEIPT</div>
          <div style="font-size: 14px; color: #7c8b4f; font-weight: 600;">Receipt #${transaction.reference}</div>
        </div>
        
        <!-- Transaction Summary -->
        <div style="background: #f8f9f5; border: 2px solid #7c8b4f; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
          <div style="font-size: 16px; font-weight: bold; color: #7c8b4f; margin-bottom: 5px;">Transaction #${transaction.id}</div>
          <div style="font-size: 14px; color: #555; margin: 5px 0;">${transaction.description}</div>
          <div style="font-size: 28px; font-weight: bold; color: #7c8b4f; margin: 10px 0;">₱${transaction.amount.toLocaleString()}</div>
          <div style="display: inline-block; padding: 6px 12px; border-radius: 15px; font-size: 11px; font-weight: 600; text-transform: uppercase; background: #d4edda; color: #155724; border: 1px solid #c3e6cb;">${transaction.status.toUpperCase()}</div>
        </div>
        
        <!-- Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
          <!-- Transaction Details -->
          <div style="background: #fafbf8; border: 1px solid #e0e4d6; border-radius: 6px; padding: 15px;">
            <div style="font-size: 13px; font-weight: bold; color: #7c8b4f; margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #d0d6c4; padding-bottom: 6px;">Transaction Details</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Type:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Category:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.category || 'Service'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Payment Method:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.method.charAt(0).toUpperCase() + transaction.method.slice(1)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Processing Time:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.time || 'Instant'}</span>
            </div>
          </div>
          
          <!-- Timeline Information -->
          <div style="background: #fafbf8; border: 1px solid #e0e4d6; border-radius: 6px; padding: 15px;">
            <div style="font-size: 13px; font-weight: bold; color: #7c8b4f; margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #d0d6c4; padding-bottom: 6px;">Timeline Information</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Date Processed:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Time Stamp:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.time || '14:15'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Reference Number:</span>
              <span style="font-weight: 700; color: #7c8b4f;">${transaction.reference}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Location:</span>
              <span style="font-weight: 700; color: #7c8b4f;">Front Desk</span>
            </div>
          </div>
          
          <!-- Financial Breakdown -->
          <div style="background: #fafbf8; border: 1px solid #e0e4d6; border-radius: 6px; padding: 15px;">
            <div style="font-size: 13px; font-weight: bold; color: #7c8b4f; margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #d0d6c4; padding-bottom: 6px;">Financial Breakdown</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Base Amount:</span>
              <span style="font-weight: 700; color: #7c8b4f;">₱${transaction.amount.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Service Fees:</span>
              <span style="font-weight: 700; color: #7c8b4f;">₱0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Tax Applied:</span>
              <span style="font-weight: 700; color: #7c8b4f;">₱0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 11px;">
              <span style="font-weight: 600; color: #555;"><strong>Total Amount:</strong></span>
              <span style="font-weight: 700; color: #7c8b4f;"><strong>₱${transaction.amount.toLocaleString()}</strong></span>
            </div>
          </div>
          
          <!-- Security Information -->
          <div style="background: #fafbf8; border: 1px solid #e0e4d6; border-radius: 6px; padding: 15px;">
            <div style="font-size: 13px; font-weight: bold; color: #7c8b4f; margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid #d0d6c4; padding-bottom: 6px;">Security & Verification</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Authorized By:</span>
              <span style="font-weight: 700; color: #7c8b4f;">System</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Exchange Rate:</span>
              <span style="font-weight: 700; color: #7c8b4f;">1.00 PHP</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #d0d6c4; font-size: 11px;">
              <span style="font-weight: 600; color: #555;">Fees Applied:</span>
              <span style="font-weight: 700; color: #7c8b4f;">₱0.00</span>
            </div>
            <div style="margin-top: 8px;">
              <div style="font-weight: 600; color: #555; margin-bottom: 5px; font-size: 11px;">Transaction Hash:</div>
              <div style="font-family: 'Courier New', monospace; font-size: 9px; background: #f0f4e8; padding: 4px 6px; border-radius: 3px; border: 1px solid #d0d6c4; word-break: break-all;">TXN${transaction.id}${transaction.date.replace(/-/g, '')}${transaction.reference}</div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #7c8b4f; text-align: center;">
          <div style="font-size: 10px; color: #666; line-height: 1.3;">
            <strong>Balay Ginhawa Hotel</strong><br>
            123 Heritage Street, Heritage District<br>
            Phone: +63 (02) 123-4567 | Email: info@balayginhawa.com<br>
            <br>
            Thank you for choosing Balay Ginhawa Hotel!<br>
            For any questions regarding this transaction, please contact our front desk.
          </div>
          <div style="margin-top: 10px; font-size: 9px; color: #999;">
            Generated on: ${new Date().toLocaleString('en-PH', { 
              timeZone: 'Asia/Manila',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    `;
    
    // Add to DOM temporarily
    document.body.appendChild(tempDiv);
    
    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Add image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      pdf.save(`receipt-${transaction.reference}-${transaction.id}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
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
        <div className="h-full p-6 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Skeleton className="w-16 h-16 mb-4 rounded-full" />
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-40 h-4" />
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
      <div className="h-full p-6 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right">
      {transaction ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-heritage-green">Transaction Details</h3>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-lg text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <label className="block mb-2 text-base font-semibold text-heritage-neutral">Description</label>
              <p className="text-lg font-semibold text-heritage-green">{transaction.description}</p>
            </div>
            <div>
              <label className="block mb-2 text-base font-semibold text-heritage-neutral">Amount</label>
              <p className="text-3xl font-bold text-heritage-green">{formatCurrency(transaction.amount)}</p>
            </div>
            <div>
              <label className="block mb-2 text-base font-semibold text-heritage-neutral">Status</label>
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
              <label className="block mb-2 text-base font-semibold text-heritage-neutral">Reference Number</label>
              <p className="px-3 py-2 font-mono text-lg rounded-lg text-heritage-green bg-heritage-light/20">{transaction.reference}</p>
            </div>
            <div>
              <label className="block mb-2 text-base font-semibold text-heritage-neutral">Payment Method</label>
              <p className="text-lg font-medium capitalize text-heritage-green">{transaction.method}</p>
            </div>
            <div>
              <label className="block mb-2 text-base font-semibold text-heritage-neutral">Date & Time</label>
              <p className="text-lg font-medium text-heritage-green">{transaction.date} at {transaction.time}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="pt-6 border-t border-heritage-neutral/20">
              <div className="space-y-3">
                <button 
                  onClick={() => handleViewFullDetails(transaction)}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-2xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-semibold">View Full Details</span>
                </button>
                
                <button 
                  onClick={() => handleCreateInvoice(transaction)}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-heritage-light/80 to-heritage-green/20 border-2 border-heritage-green text-heritage-green rounded-2xl hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-heritage-light/30 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] group"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">Create Invoice</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handlePrintReceipt(transaction)}
                    className="flex items-center justify-center px-4 py-3 space-x-2 transition-all duration-300 border shadow-sm bg-white/80 border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5 hover:border-heritage-green hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="text-sm font-medium">Print</span>
                  </button>
                  
                  <button 
                    onClick={() => handleDownloadPDF(transaction)}
                    className="flex items-center justify-center px-4 py-3 space-x-2 transition-all duration-300 border shadow-sm bg-white/80 border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5 hover:border-heritage-green hover:shadow-md"
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
              <h3 className="text-2xl font-bold text-heritage-green">No Transaction Selected</h3>
              <p className="max-w-sm mx-auto text-base leading-relaxed text-heritage-neutral/70">
                Click on any transaction to view details
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
      )}
      
      {/* Transaction Details Modal */}
      {transaction && (
        <SimpleModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log('Modal onClose called');
            setIsModalOpen(false);
          }}
          title="Complete Transaction Details"
        >
          <div className="space-y-6">
            {/* Transaction Header */}
            <div className="flex items-center justify-between p-4 border bg-gradient-to-r from-heritage-green/10 to-heritage-light/20 rounded-xl border-heritage-green/20">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-heritage-green">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-heritage-green">Transaction #{transaction.id}</h3>
                  <p className="text-sm text-heritage-neutral">{transaction.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-heritage-green">₱{transaction.amount.toLocaleString()}</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Primary Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 space-y-2 border rounded-lg bg-heritage-light/10 border-heritage-neutral/10">
                <label className="text-xs font-semibold tracking-wide uppercase text-heritage-neutral">Transaction Type</label>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-base font-bold capitalize text-heritage-green">{transaction.type}</span>
                </div>
              </div>
              
              <div className="p-4 space-y-2 border rounded-lg bg-heritage-light/10 border-heritage-neutral/10">
                <label className="text-xs font-semibold tracking-wide uppercase text-heritage-neutral">Category</label>
                <p className="text-base font-bold text-heritage-green">{transaction.category || 'General'}</p>
              </div>
              
              <div className="p-4 space-y-2 border rounded-lg bg-heritage-light/10 border-heritage-neutral/10">
                <label className="text-xs font-semibold tracking-wide uppercase text-heritage-neutral">Payment Method</label>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {transaction.method === 'card' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    ) : transaction.method === 'cash' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    )}
                  </svg>
                  <span className="text-base font-bold capitalize text-heritage-green">{transaction.method}</span>
                </div>
              </div>
              
              <div className="p-4 space-y-2 border rounded-lg bg-heritage-light/10 border-heritage-neutral/10">
                <label className="text-xs font-semibold tracking-wide uppercase text-heritage-neutral">Processing Time</label>
                <p className="text-base font-bold text-heritage-green">{transaction.time || 'Instant'}</p>
              </div>
            </div>

            {/* Timeline Information */}
            <div className="p-4 space-y-3 border bg-gradient-to-r from-heritage-neutral/5 to-heritage-light/10 rounded-xl border-heritage-neutral/10">
              <h4 className="flex items-center text-sm font-bold tracking-wide uppercase text-heritage-green">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Transaction Timeline
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-heritage-neutral">Date Processed</span>
                  <span className="px-2 py-1 text-sm font-bold bg-white rounded text-heritage-green">{transaction.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-heritage-neutral">Time Stamp</span>
                  <span className="px-2 py-1 text-sm font-bold bg-white rounded text-heritage-green">{transaction.time || '10:30 AM'}</span>
                </div>
              </div>
            </div>

            {/* Reference and Security */}
            <div className="p-4 space-y-3 border bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 rounded-xl border-heritage-green/20">
              <h4 className="flex items-center text-sm font-bold tracking-wide uppercase text-heritage-green">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security & Reference
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-heritage-neutral">Reference Number</span>
                  <span className="px-3 py-1 font-mono text-sm font-bold bg-white border rounded text-heritage-green border-heritage-green/20">
                    {transaction.reference}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-heritage-neutral">Transaction Hash</span>
                  <span className="px-2 py-1 font-mono text-xs bg-white border rounded text-heritage-green border-heritage-green/20">
                    {`TXN${transaction.id}${transaction.date.replace(/-/g, '')}${transaction.reference}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 gap-3 p-4 border bg-heritage-light/5 rounded-xl border-heritage-neutral/10">
              <h4 className="flex items-center text-sm font-bold tracking-wide uppercase text-heritage-green">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Additional Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-heritage-neutral">Fees Applied</span>
                  <span className="font-semibold text-heritage-green">₱0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-heritage-neutral">Exchange Rate</span>
                  <span className="font-semibold text-heritage-green">1.00 PHP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-heritage-neutral">Location</span>
                  <span className="font-semibold text-heritage-green">Front Desk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-heritage-neutral">Authorized By</span>
                  <span className="font-semibold text-heritage-green">System</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-heritage-neutral/10">
              <button 
                onClick={() => {
                  handleCreateInvoice(transaction);
                  setIsModalOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-semibold">Create Invoice</span>
              </button>
              
              <button 
                onClick={() => {
                  // Print receipt functionality
                  handlePrintReceipt(transaction);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-heritage-green text-heritage-green rounded-xl hover:bg-heritage-green/5 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="text-sm font-semibold">Print Receipt</span>
              </button>
            </div>
          </div>
        </SimpleModal>
      )}

      {/* Invoice Creation Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        transaction={transaction}
      />
      </div>
    </>
  );
};

export default TransactionDetails;