import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DashboardPage } from '../../../components/finances/dashboard/DashboardPage';

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
};

export default AdminDashboardPage;