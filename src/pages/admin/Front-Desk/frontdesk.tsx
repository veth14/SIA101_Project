import { AdminLayout } from '../../../layouts/AdminLayout';
import { ReservationsPage } from '../../../components/frontdesk/reservations/ReservationsPage';

export default function FrontDeskPage() {
  return (
    <AdminLayout>
      <ReservationsPage />
    </AdminLayout>
  );
}
