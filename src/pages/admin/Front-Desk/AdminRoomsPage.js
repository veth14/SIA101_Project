import { jsx as _jsx } from "react/jsx-runtime";
import { AdminLayout } from '../../../layouts/AdminLayout';
import RoomManagementPage from '../../../components/frontdesk/room-management/RoomManagementPage';
export default function AdminRoomsPage() {
    return (_jsx(AdminLayout, { children: _jsx(RoomManagementPage, {}) }));
}
