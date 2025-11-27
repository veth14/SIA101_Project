import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from "../../../layouts/AdminLayout";
import DepartmentsPage from "../../../components/inventory/invDepartments/DepartmentsPage";
export default function AdminDepartmentsPage() {
    return (_jsx(AdminLayout, { children: _jsx(DepartmentsPage, {}) }));
}
