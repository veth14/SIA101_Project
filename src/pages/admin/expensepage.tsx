import { AdminLayout } from '../../layouts/AdminLayout';
import { ExpensePage } from '../../components/finances/expenses/ExpensePage';

export default function AdminExpensePage() {
  return (
    <AdminLayout>
      <ExpensePage />
    </AdminLayout>
  );
}
