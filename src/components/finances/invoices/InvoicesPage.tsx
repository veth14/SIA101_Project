import React, { useState, useEffect } from 'react';
import InvoiceList from './InvoiceList';
import InvoiceStats from './InvoiceStats';
import InvoiceDetails from './InvoiceDetails';
import InvoiceSuccessModal from './InvoiceSuccessModal';
import type { Invoice } from './InvoiceList';
import { printInvoiceDocument } from './printing/invoicePrinting';
import { InvoiceRecord } from '../../../backend/invoices/invoicesService';
import { db } from '../../../config/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const InvoicesPage: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [newlyCreatedInvoice, setNewlyCreatedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Map Firestore InvoiceRecord into the UI Invoice shape used by InvoiceList
  const mapRecordToInvoice = (record: InvoiceRecord): Invoice => {
    const createdDate = record.createdAt
      ? record.createdAt.toISOString().split('T')[0]
      : '';

    const checkIn = record.transactionDate || createdDate || record.dueDate;
    const checkOut = record.dueDate || checkIn;

    const rawStatus = (record.status || '').toString().toLowerCase();
    let status: Invoice['status'];
    switch (rawStatus) {
      case 'paid':
      case 'fully_paid':
      case 'fully paid':
      case 'completed':
        status = 'paid';
        break;
      case 'overdue':
        status = 'overdue';
        break;
      case 'pending':
      case 'unpaid':
      default:
        // Treat any other status (e.g. 'draft') as pending for display
        status = 'pending';
    }

    const selectionKey = `${record.invoiceNumber}|${record.transactionReference}|${record.total}`;

    return {
      id: record.invoiceNumber,
      guestName: record.customerName || 'Guest',
      roomNumber: (record.transactionReference as string) || '-',
      checkIn: checkIn || '',
      checkOut: checkOut || '',
      status,
      totalAmount: record.total,
      items: [
        {
          id: 'subtotal',
          description: 'Subtotal',
          category: 'room',
          quantity: 1,
          unitPrice: record.subtotal,
          total: record.subtotal,
        },
        {
          id: 'tax',
          description: `Tax (${record.taxRate}%)`,
          category: 'taxes',
          quantity: 1,
          unitPrice: record.taxAmount,
          total: record.taxAmount,
        },
      ],
      subtotal: record.subtotal,
      taxAmount: record.taxAmount,
      taxRate: record.taxRate,
      reference: record.transactionReference,
      paymentMethod: record.transactionMethod,
      dueDate: record.dueDate,
      selectionKey,
    };
  };

  // Load invoices once on mount with a single Firestore query (no live snapshot listener)
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const records: InvoiceRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          let createdAtDate: Date | undefined;
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAtDate = data.createdAt.toDate();
          }

          return {
            id: docSnap.id,
            invoiceNumber: data.invoiceNumber || docSnap.id,
            customerName: data.customerName || '',
            customerEmail: data.customerEmail || '',
            customerAddress: data.customerAddress || '',
            notes: data.notes || '',
            taxRate: typeof data.taxRate === 'number' ? data.taxRate : 0,
            subtotal: typeof data.subtotal === 'number' ? data.subtotal : 0,
            taxAmount: typeof data.taxAmount === 'number' ? data.taxAmount : 0,
            total: typeof data.total === 'number' ? data.total : 0,
            dueDate: data.dueDate || '',
            status: data.status || 'draft',
            transactionId: data.transactionId,
            transactionReference: data.transactionReference,
            transactionDescription: data.transactionDescription,
            transactionCategory: data.transactionCategory,
            transactionMethod: data.transactionMethod,
            transactionDate: data.transactionDate,
            transactionTime: data.transactionTime,
            createdAt: createdAtDate,
          };
        });

        // Order so that unpaid invoices show first and paid/completed go to the back
        const sorted = [...records].sort((a, b) => {
          const orderFor = (status: string | undefined) => {
            if (status === 'paid' || status === 'completed') return 2; // back
            if (status === 'overdue') return 1;
            return 0; // pending / draft / others first
          };

          const ao = orderFor(a.status);
          const bo = orderFor(b.status);
          if (ao !== bo) return ao - bo;

          const ad = a.createdAt ? a.createdAt.getTime() : 0;
          const bd = b.createdAt ? b.createdAt.getTime() : 0;
          return bd - ad; // newest first within same status bucket
        });

        const mapped = sorted.map(mapRecordToInvoice);
        setInvoices(mapped);
      } catch (error) {
        console.error('Error loading invoices:', error);
      }
    };

    void loadInvoices();
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
    // Do not mutate the invoices list here; Firestore snapshot is the source of truth.
    // Just show the success modal with the newly created invoice payload.
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
    printInvoiceDocument(invoice);
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