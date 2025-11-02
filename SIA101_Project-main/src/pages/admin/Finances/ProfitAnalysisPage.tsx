import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import ProfitAnalysisComponent from '../../../components/finances/profitAnalytics/ProfitAnalysisPage';

const AdminProfitAnalysisPage: React.FC = () => {
  return (
    <AdminLayout>
      <ProfitAnalysisComponent />
    </AdminLayout>
  );
};

export default AdminProfitAnalysisPage;