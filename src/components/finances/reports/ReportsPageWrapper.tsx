import React from 'react';
import { ReportsPage as ReportsContent } from './ReportsPage';

export const ReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20">
      <ReportsContent />
    </div>
  );
};

export default ReportsPage;