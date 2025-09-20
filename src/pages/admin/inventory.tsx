import { AdminLayout } from '../../layouts/AdminLayout';
import { ItemsPage } from '../../components/inventory/ItemsPage';

export default function InventoryPage() {
  return (
    <AdminLayout title="Inventory Management">
      <ItemsPage />
    </AdminLayout>
  );
}
