import React from 'react';
import { PayrollBreakdown } from '../../../utils/philippineTaxCalculations';
import type { EmployeePayroll } from './PayrollTable';
interface PayrollDetailsPanelProps {
    employee: EmployeePayroll | null;
    onSavePayroll?: (employee: EmployeePayroll, payroll: PayrollBreakdown) => void;
    onMarkAsPaid?: (employeeId: string) => void;
}
declare const PayrollDetailsPanel: React.FC<PayrollDetailsPanelProps>;
export default PayrollDetailsPanel;
