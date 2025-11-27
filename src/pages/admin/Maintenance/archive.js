import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import ArchivePage from '../../../components/maintenance/archive/ArchivePage';
export default function AdminArchivePage() {
    return (_jsx(AdminLayout, { children: _jsx(ArchivePage, {}) }));
}
