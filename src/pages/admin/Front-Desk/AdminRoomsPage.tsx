import { AdminLayout } from '../../../layouts/AdminLayout';

import RoomManagementPage from '../../../components/frontdesk/room-management/RoomManagementPage';


export default function AdminRoomsPage() {
  return (
    <AdminLayout>
      <RoomManagementPage />
    </AdminLayout>
  );
}
