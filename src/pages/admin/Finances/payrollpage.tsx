import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import PayrollPageWrapper from '../../../components/finances/payroll/PayrollPageWrapper';

const AdminPayrollPage: React.FC = () => {
  return (
    <AdminLayout>
      <PayrollPageWrapper />
    </AdminLayout>
  );
};

export default AdminPayrollPage;