import React from "react";
interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    category: string;
    rating: number;
    totalOrders: number;
    totalValue: number;
    lastOrderDate: string;
    status: "active" | "inactive" | "suspended";
    paymentTerms: string;
    deliveryTime: string;
    notes?: string;
}
interface SupplierDetailsModalProps {
    supplier: Supplier;
    isOpen: boolean;
    onClose: () => void;
    formatCurrency: (amount: number) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    getRatingStars: (rating: number) => React.ReactNode;
}
export declare const SupplierDetailsModal: React.FC<SupplierDetailsModalProps>;
export {};
