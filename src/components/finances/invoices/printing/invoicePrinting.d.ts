import type { Invoice } from '../InvoiceList';
export declare const printInvoiceDocument: (invoice: Invoice) => void;
export declare const downloadInvoicePdf: (invoice: Invoice) => Promise<void>;
