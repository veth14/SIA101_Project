import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import { GuestServices } from '../../../components/frontdesk/guest-services/GuestServices';
export default function GuestServicesPage() {
    return (_jsx(AdminLayout, { children: _jsx(GuestServices, {}) }));
}
