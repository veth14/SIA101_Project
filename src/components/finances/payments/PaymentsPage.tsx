import React, { useEffect, useState } from 'react';
import PaymentList from './PaymentList';
import PaymentDetails from './PaymentDetails';
import type { Payment } from './PaymentList';
import PaymentsStats from './PaymentsStats';
import { subscribeToInvoices, InvoiceRecord } from '../../../backend/invoices/invoicesService';

export const PaymentsPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const mapInvoiceToPayment = (record: InvoiceRecord): Payment | null => {
      const rawStatus = (record.status || '').toString().toLowerCase();

      // Only treat fully paid/completed invoices as payments for this view
      const isPaid =
        rawStatus === 'paid' ||
        rawStatus === 'fully_paid' ||
        rawStatus === 'fully paid' ||
        rawStatus === 'completed';

      if (!isPaid) {
        return null;
      }

      let paymentMethod: Payment['paymentMethod'];
      const rawMethod = (record.transactionMethod || '').toString().toLowerCase();

      switch (rawMethod) {
        case 'card':
        case 'credit_card':
        case 'debit_card':
          paymentMethod = 'card';
          break;
        case 'cash':
        case 'cash_payment':
          paymentMethod = 'cash';
          break;
        case 'gcash':
        case 'g-cash':
        case 'digital':
        case 'wallet':
          paymentMethod = 'digital';
          break;
        case 'transfer':
        case 'bank_transfer':
        case 'bank-transfer':
          paymentMethod = 'bank_transfer';
          break;
        default:
          paymentMethod = 'cash';
      }

      const createdDate = record.createdAt
        ? record.createdAt.toISOString().split('T')[0]
        : '';

      const transactionDate =
        record.transactionDate || createdDate || record.dueDate || '';
      const transactionTime = record.transactionTime || '00:00';

      return {
        id: record.invoiceNumber,
        guestName: record.customerName || 'Guest',
        roomNumber: (record.transactionReference as string) || '-',
        amount: record.total,
        paymentMethod,
        status: 'completed',
        transactionDate,
        transactionTime,
        reference: (record.transactionReference as string) || record.invoiceNumber,
        description: record.transactionDescription || 'Invoice payment',
      };
    };

    const unsubscribe = subscribeToInvoices(
      (records) => {
        try {
          const mapped = records
            .map(mapInvoiceToPayment)
            .filter((p): p is Payment => p !== null);
          setPayments(mapped);
        } catch (error) {
          console.error('Error mapping invoices to payments:', error);
          setPayments([]);
        }
      },
      (error) => {
        console.error('Error loading invoices for payments view:', error);
        setPayments([]);
      }
    );

    return unsubscribe;
  }, []);

  const handlePaymentSelect = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleCloseDetails = () => {
    setSelectedPayment(null);
  };

  return (
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

        {/* Stats */}
        <div className="w-full">
          <PaymentsStats payments={payments} />
        </div>

        {/* Main Grid */}
        <div className="relative w-full">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
            <div className="lg:col-span-2 h-full">
              <PaymentList 
                payments={payments}
                onPaymentSelect={handlePaymentSelect}
                selectedPayment={selectedPayment}
              />
            </div>
            <div className="col-span-1 h-full">
              <PaymentDetails 
                payment={selectedPayment}
                onClose={handleCloseDetails}
              />
            </div>
          </div>

          {/* Page-level shimmer overlay for the grid while loading */}
          {/* loading overlay removed */}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;