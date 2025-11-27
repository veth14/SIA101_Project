import React from 'react';
interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    cta?: {
        label: string;
        onClick: () => void;
    } | null;
}
declare const SuccessModal: React.FC<SuccessModalProps>;
export default SuccessModal;
