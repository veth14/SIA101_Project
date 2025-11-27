export interface EmployeePayrollData {
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
export declare const employeePayrollData: EmployeePayrollData[];
