import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ReservationsPage } from '../../../components/frontdesk/reservations/ReservationsPage';
export default function FrontDeskPage() {
    return (_jsx(AdminLayout, { children: _jsx(ReservationsPage, {}) }));
}
