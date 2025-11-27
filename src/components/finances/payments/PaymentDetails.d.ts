import React from 'react';
import type { Payment } from './PaymentList';
interface PaymentDetailsProps {
    payment: Payment | null;
    onClose: () => void;
    onPrint?: (payment: Payment) => void;
}
declare const PaymentDetails: React.FC<PaymentDetailsProps>;
export default PaymentDetails;
