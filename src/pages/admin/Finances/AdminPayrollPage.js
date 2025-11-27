import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { PayrollPage } from '../../../components/finances/payroll/PayrollPage';
const AdminPayrollPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(PayrollPage, {}) }));
};
export default AdminPayrollPage;
