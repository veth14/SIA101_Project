import React from 'react';
import type { Invoice } from './InvoiceList';
interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvoiceCreated: (invoice: Invoice) => void;
}
declare const CreateInvoiceModal: React.FC<CreateInvoiceModalProps>;
export default CreateInvoiceModal;
