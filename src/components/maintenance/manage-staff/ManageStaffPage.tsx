import React, { useState, useMemo } from 'react';

import StaffStats from './StaffStats';
import StaffFilters from './StaffFilters';
import StaffGrid from './StaffGrid';
import AddStaffModal from './AddStaffModal';
import { useStaff } from './useStaff';
import { Staff } from './types';

const ManageStaffPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClassification, setFilterClassification] = useState("");
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();

  const filteredStaff = useMemo(() => {
    return staff.filter((staffMember) => {
      const matchesSearch =
        searchQuery === "" ||
        staffMember.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staffMember.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staffMember.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClassification =
        filterClassification === "" ||
        staffMember.classification === filterClassification;

      return matchesSearch && matchesClassification;
    });
  }, [staff, searchQuery, filterClassification]);

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
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        <StaffStats staff={staff} />
        <StaffFilters
          onAddStaff={handleAddStaff}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterClassification={filterClassification}
          onFilterChange={setFilterClassification}
        />
        <StaffGrid
          staff={filteredStaff}
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
