import React from 'react';
import type { Invoice } from './InvoiceList';
interface InvoiceSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
}
declare const InvoiceSuccessModal: React.FC<InvoiceSuccessModalProps>;
export default InvoiceSuccessModal;
