import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import StaffSchedulesPage from '../../../components/maintenance/staff-schedules/StaffSchedulesPage';
export default function AdminStaffSchedulesPage() {
    return (_jsx(AdminLayout, { children: _jsx(StaffSchedulesPage, {}) }));
}
