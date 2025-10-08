import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ReportsPage } from '../../../components/finances/reports/ReportsPageWrapper';

const AdminReportsPage: React.FC = () => {
  return (
    <AdminLayout>
      <ReportsPage />
    </AdminLayout>
  );
};

export default AdminReportsPage;