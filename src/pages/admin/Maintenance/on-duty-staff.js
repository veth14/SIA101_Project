import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import OnDutyStaffPage from '../../../components/maintenance/on-duty-staff/OnDutyStaffPage';
export default function AdminOnDutyStaffPage() {
    return (_jsx(AdminLayout, { children: _jsx(OnDutyStaffPage, {}) }));
}
