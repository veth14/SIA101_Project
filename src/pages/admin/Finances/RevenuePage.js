import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { RevenuePage } from '../../../components/finances/revenue/RevenuePage';
const AdminRevenuePage = () => {
    return (_jsx(AdminLayout, { children: _jsx(RevenuePage, {}) }));
};
export default AdminRevenuePage;
