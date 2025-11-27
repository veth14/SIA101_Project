import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DashboardPage } from '../../../components/finances/dashboard/DashboardPage';
const AdminDashboardPage = () => {
    return (_jsx(AdminLayout, { children: _jsx(DashboardPage, {}) }));
};
export default AdminDashboardPage;
