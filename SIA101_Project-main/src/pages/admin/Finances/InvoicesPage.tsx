import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { InvoicesPage } from '../../../components/finances/invoices/InvoicesPage';

const AdminInvoicesPage: React.FC = () => {
  return (
    <AdminLayout>
      <InvoicesPage />
    </AdminLayout>
  );
};

export default AdminInvoicesPage;