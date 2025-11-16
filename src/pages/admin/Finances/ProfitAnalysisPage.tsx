import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
// Use the new ProfitAnalysis dashboard component
import ProfitAnalysisComponent from '../../../components/finances/dashboard/ProfitAnalysis';

const AdminProfitAnalysisPage: React.FC = () => {
  return (
    <AdminLayout>
      <ProfitAnalysisComponent />
    </AdminLayout>
  );
};

export default AdminProfitAnalysisPage;