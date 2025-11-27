import React from 'react';
export interface EmployeePayroll {
    id: string;
    employeeId: string;
    name: string;
    position: string;
    department: 'front_desk' | 'housekeeping' | 'food_beverage' | 'management' | 'maintenance' | 'security';
    basicPay: number;
    allowance: number;
    overtime: number;
    overtimeRate: number;
    status: 'paid' | 'pending' | 'delayed';
    payPeriod: string;
}
interface PayrollTableProps {
    employees: EmployeePayroll[];
    onEmployeeSelect: (employee: EmployeePayroll) => void;
    selectedEmployee: EmployeePayroll | null;
}
export declare const PayrollTable: React.FC<PayrollTableProps>;
export {};
