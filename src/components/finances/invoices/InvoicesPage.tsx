import React, { useState, useEffect } from 'react';
import InvoiceList from './InvoiceList';
import InvoiceStats from './InvoiceStats';
import InvoiceDetails from './InvoiceDetails';
import InvoiceSuccessModal from './InvoiceSuccessModal';
import type { Invoice } from './InvoiceList';

export const InvoicesPage: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [newlyCreatedInvoice, setNewlyCreatedInvoice] = useState<Invoice | null>(null);
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      guestName: 'John Smith',
      roomNumber: '204',
      checkIn: '2024-10-05',
      checkOut: '2024-10-07',
      status: 'paid',
      totalAmount: 580.50,
      items: [
        { id: '1', description: 'Deluxe Room (2 nights)', category: 'room', quantity: 2, unitPrice: 200, total: 400 },
        { id: '2', description: 'Room Service', category: 'food', quantity: 3, unitPrice: 35, total: 105 },
        { id: '3', description: 'Laundry Service', category: 'services', quantity: 1, unitPrice: 45, total: 45 },
        { id: '4', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 30.50, total: 30.50 }
      ]
    },
    {
      id: 'INV-2024-002',
      guestName: 'Sarah Johnson',
      roomNumber: '301',
      checkIn: '2024-10-06',
      checkOut: '2024-10-08',
      status: 'pending',
      totalAmount: 420.75,
      items: [
        { id: '1', description: 'Standard Room (2 nights)', category: 'room', quantity: 2, unitPrice: 150, total: 300 },
        { id: '2', description: 'Breakfast', category: 'food', quantity: 4, unitPrice: 25, total: 100 },
        { id: '3', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 20.75, total: 20.75 }
      ]
    },
    {
      id: 'INV-2024-003',
      guestName: 'Michael Brown',
      roomNumber: '105',
      checkIn: '2024-10-04',
      checkOut: '2024-10-06',
      status: 'overdue',
      totalAmount: 890.25,
      items: [
        { id: '1', description: 'Suite Room (2 nights)', category: 'room', quantity: 2, unitPrice: 350, total: 700 },
        { id: '2', description: 'Fine Dining', category: 'food', quantity: 2, unitPrice: 65, total: 130 },
        { id: '3', description: 'Spa Services', category: 'services', quantity: 1, unitPrice: 120, total: 120 },
        { id: '4', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 40.25, total: 40.25 }
      ]
    },
    {
      id: 'INV-2024-004',
      guestName: 'Emily Davis',
      roomNumber: '102',
      checkIn: '2024-10-08',
      checkOut: '2024-10-10',
      status: 'paid',
      totalAmount: 350.00,
      items: [
        { id: '1', description: 'Standard Room (2 nights)', category: 'room', quantity: 2, unitPrice: 150, total: 300 },
        { id: '2', description: 'Mini Bar', category: 'food', quantity: 1, unitPrice: 50, total: 50 }
      ]
    },
    {
      id: 'INV-2024-005',
      guestName: 'Robert Wilson',
      roomNumber: '205',
      checkIn: '2024-10-09',
      checkOut: '2024-10-11',
      status: 'pending',
      totalAmount: 720.80,
      items: [
        { id: '1', description: 'Deluxe Room (2 nights)', category: 'room', quantity: 2, unitPrice: 200, total: 400 },
        { id: '2', description: 'Dinner', category: 'food', quantity: 2, unitPrice: 75, total: 150 },
        { id: '3', description: 'Spa Package', category: 'services', quantity: 1, unitPrice: 120, total: 120 },
        { id: '4', description: 'Service Tax (7%)', category: 'taxes', quantity: 1, unitPrice: 50.80, total: 50.80 }
      ]
    },
    {
      id: 'INV-2024-006',
      guestName: 'Lisa Anderson',
      roomNumber: '308',
      checkIn: '2024-10-10',
      checkOut: '2024-10-12',
      status: 'overdue',
      totalAmount: 1250.00,
      items: [
        { id: '1', description: 'Presidential Suite (2 nights)', category: 'room', quantity: 2, unitPrice: 500, total: 1000 },
        { id: '2', description: 'Room Service', category: 'food', quantity: 5, unitPrice: 40, total: 200 },
        { id: '3', description: 'Service Tax (4%)', category: 'taxes', quantity: 1, unitPrice: 50, total: 50 }
      ]
    },
    {
      id: 'INV-2024-007',
      guestName: 'David Thompson',
      roomNumber: '109',
      checkIn: '2024-10-11',
      checkOut: '2024-10-13',
      status: 'paid',
      totalAmount: 480.25,
      items: [
        { id: '1', description: 'Standard Room (2 nights)', category: 'room', quantity: 2, unitPrice: 150, total: 300 },
        { id: '2', description: 'Breakfast', category: 'food', quantity: 4, unitPrice: 25, total: 100 },
        { id: '3', description: 'Laundry', category: 'services', quantity: 1, unitPrice: 60, total: 60 },
        { id: '4', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 20.25, total: 20.25 }
      ]
    },
    {
      id: 'INV-2024-008',
      guestName: 'Jennifer Garcia',
      roomNumber: '203',
      checkIn: '2024-10-12',
      checkOut: '2024-10-14',
      status: 'pending',
      totalAmount: 650.40,
      items: [
        { id: '1', description: 'Deluxe Room (2 nights)', category: 'room', quantity: 2, unitPrice: 200, total: 400 },
        { id: '2', description: 'Fine Dining', category: 'food', quantity: 2, unitPrice: 80, total: 160 },
        { id: '3', description: 'Massage Service', category: 'services', quantity: 1, unitPrice: 90, total: 90 }
      ]
    },
    {
      id: 'INV-2024-009',
      guestName: 'Christopher Lee',
      roomNumber: '107',
      checkIn: '2024-10-13',
      checkOut: '2024-10-15',
      status: 'paid',
      totalAmount: 920.75,
      items: [
        { id: '1', description: 'Suite Room (2 nights)', category: 'room', quantity: 2, unitPrice: 350, total: 700 },
        { id: '2', description: 'Room Service', category: 'food', quantity: 3, unitPrice: 45, total: 135 },
        { id: '3', description: 'Business Center', category: 'services', quantity: 1, unitPrice: 85, total: 85 }
      ]
    },
    {
      id: 'INV-2024-010',
      guestName: 'Amanda Martinez',
      roomNumber: '306',
      checkIn: '2024-10-14',
      checkOut: '2024-10-16',
      status: 'overdue',
      totalAmount: 1180.60,
      items: [
        { id: '1', description: 'Presidential Suite (2 nights)', category: 'room', quantity: 2, unitPrice: 500, total: 1000 },
        { id: '2', description: 'Champagne Service', category: 'food', quantity: 1, unitPrice: 120, total: 120 },
        { id: '3', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 60.60, total: 60.60 }
      ]
    }
  ]);

  // Loading simulation removed for immediate rendering

  // Auto-select first invoice for testing
  useEffect(() => {
    if (invoices.length > 0 && !selectedInvoice) {
      setSelectedInvoice(invoices[0]);
    }
  }, [invoices, selectedInvoice]);

  const handleInvoiceSelect = (invoice: Invoice) => {
    console.log('handleInvoiceSelect called with:', invoice.id);
    setSelectedInvoice(invoice);
  };

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    setInvoices(prevInvoices => {
      // Check if invoice already exists to prevent duplicates
      const existingInvoice = prevInvoices.find(invoice => invoice.id === newInvoice.id);
      if (existingInvoice) {
        // Update existing invoice instead of adding duplicate
        return prevInvoices.map(invoice => 
          invoice.id === newInvoice.id ? newInvoice : invoice
        );
      }
      // Add new invoice if it doesn't exist
      return [newInvoice, ...prevInvoices];
    });
    
    // Show success modal
    setNewlyCreatedInvoice(newInvoice);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setNewlyCreatedInvoice(null);
  };

  const handleViewDetails = () => {
    setIsDetailsModalOpen(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // Simple print functionality - in a real app, this would generate a proper invoice PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .details { margin-bottom: 20px; }
              .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items-table th { background-color: #f2f2f2; }
              .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>BALAY GINHAWA</h1>
              <p>Heritage Hotel & Suites</p>
              <h2>INVOICE ${invoice.id}</h2>
            </div>
            <div class="details">
              <p><strong>Guest:</strong> ${invoice.guestName}</p>
              <p><strong>Room:</strong> ${invoice.roomNumber}</p>
              <p><strong>Check-in:</strong> ${invoice.checkIn}</p>
              <p><strong>Check-out:</strong> ${invoice.checkOut}</p>
              <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unitPrice.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              <p>Total Amount: $${invoice.totalAmount.toFixed(2)}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full px-4 py-4 space-y-6 lg:px-6">
        
    {/* Invoice Stats */}
  <InvoiceStats invoices={invoices} />
        
        {/* Full Width Layout */}
        <div className="w-full">
          {/* Split Layout Grid - Matching Transaction Page */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Side - Invoice List */}
            <div className="lg:col-span-2">
              <InvoiceList 
                invoices={invoices}
                onInvoiceSelect={handleInvoiceSelect}
                selectedInvoice={selectedInvoice}
                onInvoiceCreated={handleInvoiceCreated}
              />
            </div>

            {/* Right Side - Invoice Details Panel */}
            <div className="lg:col-span-1">
              <InvoiceDetails
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                onPrint={handlePrintInvoice}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {isDetailsModalOpen && (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setIsDetailsModalOpen(false)}
          onPrint={handlePrintInvoice}
        />
      )}

      {/* Success Modal */}
      <InvoiceSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        invoice={newlyCreatedInvoice}
      />
    </div>
    </>
  );
};

export default InvoicesPage;