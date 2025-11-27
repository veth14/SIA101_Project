import React from 'react';
import { Transaction } from './TransactionDetails';
interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}
declare const InvoiceModal: React.FC<InvoiceModalProps>;
export default InvoiceModal;
