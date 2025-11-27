import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import FinancialReportsPage from '../../../components/finances/reports/FinancialReportsPage';
const AdminReportsPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(FinancialReportsPage, {}) }));
};
export default AdminReportsPage;
