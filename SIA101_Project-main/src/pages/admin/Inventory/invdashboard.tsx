import { AdminLayout } from '../../../layouts/AdminLayout';
import InventoryDashboardPage from '../../../components/inventory/invDashboard/InventoryDashboardPage';

export default function AdminInventoryDashboardPage() {
  return (
    <AdminLayout>
      <InventoryDashboardPage />
    </AdminLayout>
  );
}
