import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import SuppliersPage from '../../../components/inventory/suppliers/SuppliersPage';
export default function AdminSuppliersPage() {
    return (_jsx(AdminLayout, { children: _jsx(SuppliersPage, {}) }));
}
