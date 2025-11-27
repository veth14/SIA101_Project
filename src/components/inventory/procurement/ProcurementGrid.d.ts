import React from "react";
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
    status: "pending" | "approved" | "received" | "cancelled";
    orderDate: string;
    expectedDelivery: string;
    approvedBy?: string;
    notes?: string;
}
interface ProcurementGridProps {
    orders: PurchaseOrder[];
    formatCurrency: (amount: number) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    setOrders: React.Dispatch<React.SetStateAction<any[]>>;
    onSuccess?: () => void;
}
export declare const ProcurementGrid: React.FC<ProcurementGridProps>;
export {};
