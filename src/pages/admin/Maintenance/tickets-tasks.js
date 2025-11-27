import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import TicketsTasksPage from '../../../components/maintenance/tickets-tasks/TicketsTasksPage';
export default function AdminTicketsTasksPage() {
    return (_jsx(AdminLayout, { children: _jsx(TicketsTasksPage, {}) }));
}
