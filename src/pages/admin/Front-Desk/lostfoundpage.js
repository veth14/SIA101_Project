import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import LostFoundPage from '../../../components/frontdesk/LostFound/LostFoundPage';
export default function AdminLostFoundPage() {
    return (_jsx(AdminLayout, { children: _jsx(LostFoundPage, {}) }));
}
