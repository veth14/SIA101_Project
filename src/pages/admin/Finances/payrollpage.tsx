import { AdminLayout } from '../../../layouts/AdminLayout';
import { PayrollPage } from '../../../components/finances/payroll/PayrollPage';

export default function AdminPayrollPage() {
  return (
    <AdminLayout>
      <PayrollPage />
    </AdminLayout>
  );
}
