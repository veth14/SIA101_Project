import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { InvoicesPage } from '../../../components/finances/invoices/InvoicesPage';
const AdminInvoicesPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(InvoicesPage, {}) }));
};
export default AdminInvoicesPage;
