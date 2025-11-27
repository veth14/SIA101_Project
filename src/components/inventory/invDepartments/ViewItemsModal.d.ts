import React from 'react';
interface DepartmentItem {
    id: string;
    itemName: string;
    category: string;
    currentStock: number;
    unit: string;
    status: 'available' | 'low-stock' | 'out-of-stock' | 'maintenance';
    lastRestocked: string;
}
interface ViewItemsModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentName: string;
    departmentId: string;
    items: DepartmentItem[];
    isLoading?: boolean;
}
export declare const ViewItemsModal: React.FC<ViewItemsModalProps>;
export {};
