import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import MaintenanceOverviewPage from '../../../components/maintenance/overview/MaintenanceOverviewPage';
export default function AdminMaintenanceOverviewPage() {
    return (_jsx(AdminLayout, { children: _jsx(MaintenanceOverviewPage, {}) }));
}
