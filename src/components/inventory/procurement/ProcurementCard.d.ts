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
interface ProcurementCardProps {
    order: PurchaseOrder;
    formatCurrency: (amount: number) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    onSuccess?: () => void;
}
export declare const ProcurementCard: React.FC<ProcurementCardProps>;
export {};
