import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import ManageStaffPage from '../../../components/maintenance/manage-staff/ManageStaffPage';
export default function AdminManageStaffPage() {
    return (_jsx(AdminLayout, { children: _jsx(ManageStaffPage, {}) }));
}
