import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { PaymentsPage } from '../../../components/finances/payments/PaymentsPage';
const AdminPaymentsPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(PaymentsPage, {}) }));
};
export default AdminPaymentsPage;
