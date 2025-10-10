import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { PayrollPage } from '../../../components/finances/payroll/PayrollPageWrapper';

const AdminPayrollPage: React.FC = () => {
  return (
    <AdminLayout>
      <PayrollPage />
    </AdminLayout>
  );
};

export default AdminPayrollPage;