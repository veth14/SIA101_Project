import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { TransactionsPage } from '../../../components/finances/transactions/TransactionsPage';
const AdminTransactionsPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(TransactionsPage, {}) }));
};
export default AdminTransactionsPage;
