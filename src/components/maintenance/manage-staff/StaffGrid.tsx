import React, { useState } from 'react';
import { Staff } from './types';

interface StaffGridProps {
  staff: Staff[];
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const StaffGrid: React.FC<StaffGridProps> = ({ staff, onEditStaff, onDeleteStaff }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination logic
  const totalPages = Math.ceil(staff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaff = staff.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
              <strong>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Staff Directory
                </h2>
              </strong>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{staff.length} members</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>{staff.length} active</span>
            </div>
          </div>
        </div>

        {/* Staff Table */}
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
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Classification</th>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xl font-bold text-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStaff.map((staffMember) => (
                    <tr key={staffMember.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">{staffMember.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">{staffMember.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">{staffMember.classification}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">{staffMember.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">{staffMember.gender || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl text-black">{staffMember.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEditStaff(staffMember)}
                            className="px-4 py-2 bg-gray-500 text-white text-xl font-bold rounded hover:bg-gray-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(staffMember.id)}
                            disabled={deletingId === staffMember.id}
                            className="px-4 py-2 bg-gray-500 text-white text-xl font-bold rounded hover:bg-gray-400 disabled:opacity-50"
                          >
                            {deletingId === staffMember.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-4 mt-6 pb-5 border-t border-green-200/50">
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    // Show pages around current page
                    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    pageNum = start + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                        pageNum === currentPage
                          ? 'bg-[#82A33D] text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffGrid;
