import { AdminLayout } from '../../../layouts/AdminLayout';
import InventoryItemsPage from '../../../components/inventory/invItems/InventoryItemsPage';

export default function AdminInventoryItemsPage() {
  return (
    <AdminLayout>
      <InventoryItemsPage />
    </AdminLayout>
  );
}
