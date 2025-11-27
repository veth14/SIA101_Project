import React from 'react';
interface MaintenanceRequest {
    id: string;
    department: string;
    itemService: string;
    requestedBy: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
}
interface RequestDetailsModalProps {
    request: MaintenanceRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}
export declare const RequestDetailsModal: React.FC<RequestDetailsModalProps>;
export {};
