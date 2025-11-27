import React from "react";
interface MaintenanceRequest {
    id: string;
    department: string;
    itemService: string;
    requestedBy: string;
    date: string;
    status: "Pending" | "Approved" | "Rejected" | "Completed";
}
interface UltraPremiumRequestTableProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedDepartment: string;
    onDepartmentChange: (department: string) => void;
    requests: MaintenanceRequest[];
    onSuccess?: () => void;
    setRequests: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
}
export declare const UltraPremiumRequestTable: React.FC<UltraPremiumRequestTableProps>;
export {};
