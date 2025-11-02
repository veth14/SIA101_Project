import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { PaymentsPage } from '../../../components/finances/payments/PaymentsPage';

const AdminPaymentsPage: React.FC = () => {
  return (
    <AdminLayout>
      <PaymentsPage />
    </AdminLayout>
  );
};

export default AdminPaymentsPage;