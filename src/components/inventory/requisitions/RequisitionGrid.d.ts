import React from "react";
interface RequisitionItem {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
    reason: string;
}
interface Requisition {
    id: string;
    requestNumber: string;
    department: string;
    requestedBy: string;
    items: RequisitionItem[];
    totalEstimatedCost: number;
    status: "pending" | "approved" | "rejected" | "fulfilled";
    priority: "low" | "medium" | "high" | "urgent";
    requestDate: string;
    requiredDate: string;
    justification: string;
    approvedBy?: string;
    approvedDate?: string;
    notes?: string;
}
interface RequisitionGridProps {
    requisitions: Requisition[];
    formatCurrency: (amount: number) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    getPriorityBadge: (priority: string) => React.ReactNode;
    setRequisitions: React.Dispatch<React.SetStateAction<Requisition[]>>;
}
export declare const RequisitionGrid: React.FC<RequisitionGridProps>;
export {};
