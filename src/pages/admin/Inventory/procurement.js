import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import ProcurementPage from '../../../components/inventory/procurement/ProcurementPage';
export default function AdminProcurementPage() {
    return (_jsx(AdminLayout, { children: _jsx(ProcurementPage, {}) }));
}
