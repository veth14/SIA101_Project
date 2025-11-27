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
interface EditSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: Supplier;
    onSuccess?: (updatedData: Partial<Supplier>) => void;
    isUpdating?: boolean;
}
declare const EditSupplierModal: React.FC<EditSupplierModalProps>;
export default EditSupplierModal;
