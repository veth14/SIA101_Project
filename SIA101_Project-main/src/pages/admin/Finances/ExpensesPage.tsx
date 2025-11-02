import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ExpensesPage } from '../../../components/finances/expenses/ExpensesPage';

const AdminExpensesPage: React.FC = () => {

  return (
    <AdminLayout>
      <ExpensesPage />
    </AdminLayout>
  );
};

export default AdminExpensesPage;