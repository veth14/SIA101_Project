import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import FinancialReportsPage from '../../../components/finances/reports/FinancialReportsPage';

const AdminReportsPage: React.FC = () => {
  return (
    <AdminLayout>
      <FinancialReportsPage />
    </AdminLayout>
  );
};

export default AdminReportsPage;
