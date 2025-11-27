import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import InventoryDashboardPage from '../../../components/inventory/invDashboard/InventoryDashboardPage';
export default function AdminInventoryDashboardPage() {
    return (_jsx(AdminLayout, { children: _jsx(InventoryDashboardPage, {}) }));
}
