import React from 'react';
export interface Invoice {
    id: string;
    guestName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    linkedBookingId?: string;
    status: 'paid' | 'pending' | 'overdue';
    totalAmount: number;
    items: InvoiceItem[];
}
interface InvoiceItem {
    id: string;
    description: string;
    category: 'room' | 'food' | 'services' | 'taxes';
    quantity: number;
    unitPrice: number;
    total: number;
}
interface InvoiceListProps {
    invoices: Invoice[];
    onInvoiceSelect: (invoice: Invoice) => void;
    selectedInvoice: Invoice | null;
    onInvoiceCreated?: (invoice: Invoice) => void;
}
declare const InvoiceList: React.FC<InvoiceListProps>;
export default InvoiceList;
