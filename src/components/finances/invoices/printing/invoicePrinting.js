import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);
};
const buildInvoiceHtml = (invoice) => {
    return `
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
          <div style="display: inline-block; margin-top: 10px; padding: 6px 16px; background: ${invoice.status === 'paid' ? '#d4edda' :
        invoice.status === 'pending' ? '#fff3cd' : '#f8d7da'}; color: ${invoice.status === 'paid' ? '#155724' :
        invoice.status === 'pending' ? '#856404' : '#721c24'}; border-radius: 20px; font-size: 14px; font-weight: bold;">
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
          ${invoice.items
        .map((item, index) => `
                <tr style="background: ${index % 2 === 0 ? '#fafbf8' : 'white'};">
                  <td style="padding: 10px; border: 1px solid #e0e4d6; color: #555;">${index + 1}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; color: #555;">${item.description}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: center; color: #555;">${item.category}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: center; color: #555;">${item.quantity}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: right; color: #555;">${formatCurrency(item.unitPrice)}</td>
                  <td style="padding: 10px; border: 1px solid #e0e4d6; text-align: right; color: #82a33d; font-weight: bold;">${formatCurrency(item.total)}</td>
                </tr>`)
        .join('')}
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
};
export const printInvoiceDocument = (invoice) => {
    const html = buildInvoiceHtml(invoice);
    const printStyles = `
    <style>
      @page {
        size: A4;
        margin: 1cm;
      }
      @media print {
        body * {
          visibility: hidden;
        }
        #invoice-print-content, #invoice-print-content * {
          visibility: visible;
        }
        #invoice-print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          display: block !important;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    </style>
  `;
    let printDiv = document.getElementById('invoice-print-content');
    if (!printDiv) {
        printDiv = document.createElement('div');
        printDiv.id = 'invoice-print-content';
        document.body.appendChild(printDiv);
    }
    printDiv.innerHTML = printStyles + html;
    printDiv.style.display = 'block';
    window.print();
    setTimeout(() => {
        if (printDiv) {
            printDiv.style.display = 'none';
        }
    }, 1000);
};
export const downloadInvoicePdf = async (invoice) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = "Arial, sans-serif";
    tempDiv.innerHTML = buildInvoiceHtml(invoice);
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
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save(`invoice-${invoice.id}.pdf`);
    }
    catch (error) {
        console.error('Error generating invoice PDF:', error);
        alert('Error generating invoice PDF. Please try again.');
    }
    finally {
        document.body.removeChild(tempDiv);
    }
};
