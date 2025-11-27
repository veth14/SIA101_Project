import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import RequisitionsPage from '../../../components/inventory/requisitions/RequisitionsPage';
export default function AdminRequisitionsPage() {
    return (_jsx(AdminLayout, { children: _jsx(RequisitionsPage, {}) }));
}
