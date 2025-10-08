import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { TransactionsPage } from '../../../components/finances/transactions/TransactionsPage';

const AdminTransactionsPage: React.FC = () => {
  return (
    <AdminLayout>
      <TransactionsPage />
    </AdminLayout>
  );
};

export default AdminTransactionsPage;