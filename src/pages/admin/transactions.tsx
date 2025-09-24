import { AdminLayout } from '../../layouts/AdminLayout';
import { TransactionsPage } from '../../components/inventory/TransactionsPage';

export default function AdminTransactionsPage() {
  return (
    <AdminLayout>
      <TransactionsPage />
    </AdminLayout>
  );
}
