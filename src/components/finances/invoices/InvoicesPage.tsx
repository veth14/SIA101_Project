import React, { useState, useEffect } from 'react';
import InvoicesHeader from './InvoicesHeader';
import InvoiceList from './InvoiceList';
import InvoiceStats from './InvoiceStats';
import InvoiceDetails from './InvoiceDetails';
import InvoiceSuccessModal from './InvoiceSuccessModal';
import { Skeleton } from '../../universalLoader/SkeletonLoader';
import type { Invoice } from './InvoiceList';

export const InvoicesPage: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [newlyCreatedInvoice, setNewlyCreatedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
        {/* Header */}
        {isLoading ? (
          <div className="relative overflow-hidden border shadow-2xl bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl border-green-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 delay-1000 -translate-x-1/2 translate-y-1/2 rounded-full w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent animate-pulse"></div>
            <div className="absolute w-40 h-40 rounded-full top-1/3 right-1/3 bg-green-500/5 animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
            <div className="absolute w-24 h-24 rounded-full bottom-1/4 left-1/4 bg-green-500/10 animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
            <div className="relative p-10">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-80" />
                      <Skeleton className="h-6 w-64" />
                      <div className="flex items-center mt-4 space-x-4">
                        <Skeleton className="h-8 w-40 rounded-full" />
                        <Skeleton className="h-8 w-32 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="p-8 border shadow-xl bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl border-green-500/20">
                    <Skeleton className="h-10 w-24 mb-2" />
                    <Skeleton className="h-4 w-20 mb-3" />
                    <div className="flex items-center justify-center space-x-2">
                      <Skeleton className="w-1 h-1 rounded-full" />
                      <Skeleton className="w-1 h-1 rounded-full" />
                      <Skeleton className="w-1 h-1 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <InvoicesHeader />
        )}
        
        {/* Invoice Stats */}
  <InvoiceStats invoices={invoices} isLoading={isLoading} />
        
        {/* Full Width Layout */}
        <div className="w-full">
          {/* Split Layout Grid */}
          <div className="flex gap-6 h-[950px]">
            {/* Left Side - Invoice List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 h-[950px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-green/5 rounded-3xl opacity-80"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-bl from-heritage-green/15 to-transparent"></div>
                  <div className="absolute w-24 h-24 rounded-full -bottom-8 -left-8 bg-gradient-to-tr from-heritage-light/40 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col">
                    <div className="relative z-10 flex-shrink-0 p-6 border-b border-heritage-neutral/10">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-14 h-14 rounded-2xl" />
                        <div>
                          <Skeleton className="w-48 h-6 mb-2" />
                          <Skeleton className="w-64 h-4 mb-1" />
                          <Skeleton className="w-40 h-3" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="space-y-4">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="p-4 border rounded-xl border-heritage-neutral/10">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <Skeleton className="w-32 h-5 mb-2" />
                                <Skeleton className="w-24 h-4" />
                              </div>
                              <div className="text-right">
                                <Skeleton className="w-20 h-5 mb-2" />
                                <Skeleton className="w-16 h-4" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Skeleton className="w-28 h-4" />
                              <Skeleton className="w-16 h-6 rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <InvoiceList 
                  invoices={invoices}
                  onInvoiceSelect={handleInvoiceSelect}
                  selectedInvoice={selectedInvoice}
                  onInvoiceCreated={handleInvoiceCreated}
                />
              )}
            </div>

            {/* Right Side - Compact Invoice Preview Panel */}
            <div className="flex-shrink-0 w-96">
              {isLoading ? (
                <div className="relative flex flex-col h-full bg-white border-2 shadow-lg rounded-2xl border-heritage-green/20 w-96">
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center gap-3 pb-4 border-b border-heritage-green/10">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div>
                        <Skeleton className="w-32 h-6 mb-2" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <Skeleton className="w-20 h-6 ml-auto rounded-md" />
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 border bg-gray-50 rounded-xl border-heritage-green/10">
                        <Skeleton className="w-24 h-4 mb-2" />
                        <Skeleton className="w-32 h-5" />
                        <Skeleton className="w-20 h-4" />
                      </div>
                      <div className="p-4 border bg-gray-50 rounded-xl border-heritage-green/10">
                        <Skeleton className="w-24 h-4 mb-2" />
                        <Skeleton className="w-32 h-5" />
                        <Skeleton className="w-20 h-4" />
                      </div>
                      <div className="p-4 border bg-gray-50 rounded-xl border-heritage-green/10">
                        <Skeleton className="w-24 h-4 mb-2" />
                        <Skeleton className="w-32 h-5" />
                        <Skeleton className="w-20 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 bg-white border-t border-heritage-green/10 rounded-b-2xl">
                    <Skeleton className="flex-1 h-10 rounded-lg" />
                    <Skeleton className="flex-1 h-10 rounded-lg" />
                  </div>
                </div>
              ) : selectedInvoice ? (
                <div className="relative flex flex-col h-full bg-white border-2 shadow-lg rounded-2xl border-heritage-green/20">
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {/* Compact Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-heritage-green/10">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-heritage-green">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-heritage-green">Invoice Preview</h3>
                        <p className="text-sm text-gray-600">#{selectedInvoice.id}</p>
                      </div>
                      <span className={`ml-auto px-2 py-1 rounded-md text-xs font-medium ${
                        selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        selectedInvoice.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </span>
                    </div>

                    {/* Essential Information */}
                    <div className="space-y-4">
                      {/* Guest Information */}
                      <div className="p-4 border bg-gray-50 rounded-xl border-heritage-green/10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">Guest Information</span>
                        </div>
                        <p className="font-bold text-heritage-green">{selectedInvoice.guestName}</p>
                        <p className="text-sm text-gray-600">Room {selectedInvoice.roomNumber}</p>
                      </div>

                      {/* Total Amount */}
                      <div className="p-4 border bg-gray-50 rounded-xl border-heritage-green/10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">Total Amount</span>
                        </div>
                        <p className="text-xl font-bold text-heritage-green">${selectedInvoice.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{selectedInvoice.items.length} items</p>
                      </div>

                      {/* Stay Details */}
                      <div className="p-4 border bg-gray-50 rounded-xl border-heritage-green/10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">Stay Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Check-in:</span>
                            <p className="font-medium text-heritage-green">{selectedInvoice.checkIn}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Check-out:</span>
                            <p className="font-medium text-heritage-green">{selectedInvoice.checkOut}</p>
                          </div>
                        </div>
                      </div>

                      {/* Invoice Items Preview */}
                      <div className="p-4 border bg-gray-50 rounded-xl border-heritage-green/10">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">Invoice Items</span>
                        </div>
                        <div className="space-y-2">
                          {selectedInvoice.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.description}</span>
                              <span className="font-medium text-heritage-green">${item.total.toFixed(2)}</span>
                            </div>
                          ))}
                          {selectedInvoice.items.length > 3 && (
                            <p className="pt-2 text-xs text-center text-gray-500 border-t">
                              +{selectedInvoice.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Fixed at bottom */}
                  <div className="flex gap-2 p-4 bg-white border-t border-heritage-green/10 rounded-b-2xl">
                    <button 
                      onClick={handleViewDetails}
                      className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-lg text-heritage-green border-heritage-green/30 hover:bg-heritage-green/5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full Details
                    </button>
                    <button 
                      onClick={() => handlePrintInvoice(selectedInvoice)}
                      className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-heritage-green hover:bg-heritage-green/90"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Invoice
                    </button>
                  </div>
                </div>
              ) : (
                /* Enhanced Placeholder when no invoice is selected */
                <div className="relative h-full overflow-hidden bg-white border-2 shadow-lg rounded-2xl border-heritage-green/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/2 via-white to-heritage-green/1 rounded-3xl"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/3 -translate-y-1/3 bg-gradient-to-bl from-heritage-green/15 to-transparent blur-2xl"></div>
                  <div className="absolute w-24 h-24 rounded-full -bottom-8 -left-8 bg-gradient-to-tr from-heritage-light/40 to-transparent blur-xl"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="flex items-center justify-center w-20 h-20 mb-8 border-2 shadow-lg bg-gradient-to-br from-heritage-green/20 to-heritage-green/10 rounded-3xl border-heritage-green/20">
                      <svg className="w-10 h-10 text-heritage-green/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="mb-4 text-2xl font-black text-heritage-green">No Invoice Selected</h3>
                    <p className="max-w-sm mb-8 text-lg font-medium leading-relaxed text-heritage-neutral/80">
                      Select an invoice from the list to view detailed information, manage payments, and access printing options.
                    </p>
                    
                    {/* Enhanced Loading Animation */}
                    <div className="w-full max-w-xs space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-heritage-green/30 animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-heritage-green/50 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 rounded-full bg-heritage-green/70 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 rounded-full bg-gradient-to-r from-heritage-green/20 to-heritage-green/10 animate-pulse"></div>
                        <div className="w-3/4 h-3 rounded-full bg-gradient-to-r from-heritage-green/15 to-heritage-green/5 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="w-1/2 h-3 rounded-full bg-gradient-to-r from-heritage-green/10 to-heritage-green/5 animate-pulse" style={{animationDelay: '1s'}}></div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="p-4 mt-8 border bg-heritage-green/5 rounded-2xl border-heritage-green/10">
                      <p className="mb-2 text-sm font-bold text-heritage-green/70">Quick Actions Available:</p>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="px-3 py-1 rounded-full bg-heritage-green/10 text-heritage-green">View Details</span>
                        <span className="px-3 py-1 rounded-full bg-heritage-green/10 text-heritage-green">Print Invoice</span>
                        <span className="px-3 py-1 rounded-full bg-heritage-green/10 text-heritage-green">Payment Info</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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