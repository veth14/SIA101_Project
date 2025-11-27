import React from "react";
interface Department {
    id: string;
    name: string;
    manager: string;
    itemsAssigned: number;
    totalUsage: number;
    monthlyConsumption: number;
}
interface UltraPremiumDepartmentCardsProps {
    departments: Department[];
    formatCurrency: (amount: number) => string;
    setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
    onRequestSuccess?: () => void;
}
export declare const UltraPremiumDepartmentCards: React.FC<UltraPremiumDepartmentCardsProps>;
export {};
