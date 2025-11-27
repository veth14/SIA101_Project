import React from 'react';
import type { Invoice } from './InvoiceList';
interface InvoiceDetailsProps {
    invoice: Invoice | null;
    onClose: () => void;
    onPrint?: (invoice: Invoice) => void;
}
declare const InvoiceDetails: React.FC<InvoiceDetailsProps>;
export default InvoiceDetails;
