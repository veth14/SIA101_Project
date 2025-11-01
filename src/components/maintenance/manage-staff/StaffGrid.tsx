import React, { useState } from 'react';
import StaffCard from './StaffCard';
import { Staff } from './types';

interface StaffGridProps {
  staff: Staff[];
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const StaffGrid: React.FC<StaffGridProps> = ({ staff, onEditStaff, onDeleteStaff }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setDeletingId(id);
      try {
        const result = await onDeleteStaff(id);
        if (!result.success) {
          alert(result.error || 'Failed to delete staff member');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff member');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getColorScheme = (classification: string): 'blue' | 'purple' | 'emerald' | 'pink' | 'amber' => {
    switch (classification) {
      case 'Housekeeping':
        return 'emerald';
      case 'Maintenance':
        return 'purple';
      default:
        return 'blue';
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-15"></div>
      <div className="relative bg-gradient-to-br from-white/95 to-green-50/30 backdrop-blur-xl rounded-3xl border border-green-200/40 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#82A33D] to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Staff Directory
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{staff.length} members</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>{staff.length} active</span>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="p-8">
          {staff.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 mb-2">No staff members found</h3>
              <p className="text-gray-400">Add your first staff member to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((staffMember) => (
                <StaffCard
                  key={staffMember.id}
                  name={staffMember.fullName}
                  email={staffMember.email}
                  position={staffMember.classification}
                  department={staffMember.classification}
                  age={staffMember.age}
                  gender={staffMember.gender.toLowerCase()}
                  phone={staffMember.phoneNumber}
                  status="active"
                  initials={getInitials(staffMember.fullName)}
                  colorScheme={getColorScheme(staffMember.classification)}
                  onEdit={() => onEditStaff(staffMember)}
                  onDelete={() => handleDelete(staffMember.id)}
                  isDeleting={deletingId === staffMember.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffGrid;
