import { AdminLayout } from '../../layouts/AdminLayout';
import { ReservationsPage } from '../../components/frontdesk/ReservationsPage';

export default function FrontDeskPage() {
  return (
    <AdminLayout>
      <ReservationsPage />
    </AdminLayout>
  );
}
