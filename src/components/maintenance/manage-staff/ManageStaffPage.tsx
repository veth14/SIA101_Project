import React, { useState } from 'react';
import StaffHeader from './StaffHeader';
import StaffStats from './StaffStats';
import StaffFilters from './StaffFilters';
import StaffGrid from './StaffGrid';
import AddStaffModal from './AddStaffModal';
import { useStaff } from './useStaff';
import { Staff } from './types';

const ManageStaffPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();

  const handleAddStaff = () => {
    setEditStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditStaff(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>

        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        <StaffHeader />
        <StaffStats staff={staff} />
        <StaffFilters onAddStaff={handleAddStaff} />
        <StaffGrid
          staff={staff}
          onEditStaff={handleEditStaff}
          onDeleteStaff={deleteStaff}
        />
      </div>

      <AddStaffModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={addStaff}
        editStaff={editStaff}
        onUpdate={updateStaff}
        adminName="Administrator"
      />
    </div>
  );
};

export default ManageStaffPage;
