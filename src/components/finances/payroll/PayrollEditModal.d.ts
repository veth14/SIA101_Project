import React from 'react';
import type { EmployeePayroll } from './PayrollTable';
export type PayrollFormData = {
    basicPay: number;
    allowance: number;
    overtime: number;
    overtimeRate: number;
};
interface PayrollEditModalProps {
    employee: EmployeePayroll;
    formData: PayrollFormData;
    onFieldChange: (field: keyof PayrollFormData, value: number) => void;
    onClose: () => void;
    onSave: () => void;
}
declare const PayrollEditModal: React.FC<PayrollEditModalProps>;
export default PayrollEditModal;
