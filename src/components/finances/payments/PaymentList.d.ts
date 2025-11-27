import React from 'react';
export interface Payment {
    id: string;
    guestName: string;
    roomNumber: string;
    amount: number;
    paymentMethod: 'cash' | 'card' | 'digital' | 'bank_transfer';
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    transactionDate: string;
    transactionTime: string;
    reference: string;
    description: string;
}
interface PaymentListProps {
    payments: Payment[];
    onPaymentSelect: (payment: Payment) => void;
    selectedPayment: Payment | null;
}
declare const PaymentList: React.FC<PaymentListProps>;
export default PaymentList;
