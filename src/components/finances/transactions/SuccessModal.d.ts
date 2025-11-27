import React from 'react';
interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    invoiceNumber?: string;
    onViewInvoice?: () => void;
}
declare const SuccessModal: React.FC<SuccessModalProps>;
export default SuccessModal;
