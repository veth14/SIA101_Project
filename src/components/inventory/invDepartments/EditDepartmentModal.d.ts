import React from 'react';
interface Department {
    id: string;
    name: string;
    manager: string;
    itemsAssigned: number;
    totalUsage: number;
    monthlyConsumption: number;
}
interface EditDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: Department | null;
    onSuccess?: () => void;
}
export declare const EditDepartmentModal: React.FC<EditDepartmentModalProps>;
export {};
