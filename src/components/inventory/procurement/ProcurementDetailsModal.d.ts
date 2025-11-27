import React from 'react';
interface PurchaseOrderItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
interface PurchaseOrder {
    id: string;
    orderNumber: string;
    supplier: string;
    items: PurchaseOrderItem[];
    totalAmount: number;
    status: 'pending' | 'approved' | 'received' | 'cancelled';
    orderDate: string;
    expectedDelivery: string;
    approvedBy?: string;
    approvedDate?: string;
    notes?: string;
}
interface ProcurementDetailsModalProps {
    order: PurchaseOrder;
    isOpen: boolean;
    onClose: () => void;
    formatCurrency: (amount: number) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    onSuccess?: () => void;
}
export declare const ProcurementDetailsModal: React.FC<ProcurementDetailsModalProps>;
export {};
