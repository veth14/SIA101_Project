import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ExpensesPage } from '../../../components/finances/expenses/ExpensesPage';
const AdminExpensesPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(ExpensesPage, {}) }));
};
export default AdminExpensesPage;
