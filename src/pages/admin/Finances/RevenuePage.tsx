import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { RevenuePage } from '../../../components/finances/revenue/RevenuePage';

const AdminRevenuePage: React.FC = () => {
  return (
    <AdminLayout>
      <RevenuePage />
    </AdminLayout>
  );
};

export default AdminRevenuePage;