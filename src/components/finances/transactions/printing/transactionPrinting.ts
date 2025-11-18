import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Transaction } from '../TransactionDetails';

export const printTransactionReceipt = (transaction: Transaction) => {
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

  if (!document.querySelector('#print-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'print-styles';
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
  }

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

  window.print();

  setTimeout(() => {
    printDiv.style.display = 'none';
  }, 1000);
};

export const downloadTransactionReceiptPdf = async (transaction: Transaction) => {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

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

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`receipt-${transaction.reference}-${transaction.id}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    document.body.removeChild(tempDiv);
  }
};
