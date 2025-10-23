import React from 'react';
import StaffHeader from './StaffHeader';
import StaffStats from './StaffStats';
import StaffFilters from './StaffFilters';
import StaffGrid from './StaffGrid';

const ManageStaffPage: React.FC = () => {
  return (
    <div className="p-6 space-y-8 -mt-2">
      <StaffHeader />
      <StaffStats />
      <StaffFilters />
      <StaffGrid />
    </div>
  );
};

export default ManageStaffPage;
