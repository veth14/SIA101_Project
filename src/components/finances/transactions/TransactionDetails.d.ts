import React from 'react';
export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
    date: string;
    time: string;
    category: string;
    status: 'completed' | 'pending' | 'failed';
    reference: string;
    method: 'cash' | 'card' | 'transfer' | 'check';
}
interface TransactionDetailsProps {
    transaction: Transaction | null;
    onClose: () => void;
    onViewFullDetails?: (transaction: Transaction) => void;
    onCreateInvoice?: (transaction: Transaction) => void;
}
declare const TransactionDetails: React.FC<TransactionDetailsProps>;
export default TransactionDetails;
