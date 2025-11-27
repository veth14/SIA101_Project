import React from 'react';
interface RequestItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentName: string;
    departmentId: string;
    onSuccess?: () => void;
}
export declare const RequestItemModal: React.FC<RequestItemModalProps>;
export {};
