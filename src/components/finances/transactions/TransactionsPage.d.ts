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
export declare const TransactionsPage: React.FC;
export default TransactionsPage;
