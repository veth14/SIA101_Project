import { AdminLayout } from '../../layouts/AdminLayout';
import { TransactionsPage } from '../../components/inventory/TransactionsPage';

export default function AdminTransactionsPage() {
  return (
    <AdminLayout title="Stock Transactions">
      <TransactionsPage />
    </AdminLayout>
  );
}
