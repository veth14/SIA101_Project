import React from 'react';
interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}
declare const SimpleModal: React.FC<SimpleModalProps>;
export default SimpleModal;
