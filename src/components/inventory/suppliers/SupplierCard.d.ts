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
interface SupplierCardProps {
    supplier: Supplier;
    formatCurrency: (amount: number) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    getRatingStars: (rating: number) => React.ReactNode;
    setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}
export declare const SupplierCard: React.FC<SupplierCardProps>;
export {};
