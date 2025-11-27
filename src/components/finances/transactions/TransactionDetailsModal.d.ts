import React from 'react';
interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
    time: string;
    reference: string;
    paymentMethod: string;
    status: 'completed' | 'pending' | 'failed';
    category: string;
    source?: string;
    destination?: string;
}
interface TransactionDetailsModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
    onCreateInvoice?: () => void;
}
declare const TransactionDetailsModal: React.FC<TransactionDetailsModalProps>;
export default TransactionDetailsModal;
