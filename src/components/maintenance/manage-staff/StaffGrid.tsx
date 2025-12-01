
import React, { useState } from 'react';
import { Staff } from './types';

interface StaffGridProps {
  staff: Staff[];
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (id: string) => Promise<{ success: boolean; error?: string }>;
  onAddStaff: () => void;
  getStaffById: (id: string) => Promise<Staff | null>;
}

const StaffGrid: React.FC<StaffGridProps> = ({ staff, onEditStaff, onDeleteStaff, onAddStaff, getStaffById }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtering logic
  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch = staffMember.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassification = classificationFilter === 'all' || staffMember.classification === classificationFilter;
    const matchesGender = genderFilter === 'all' || staffMember.gender === genderFilter;
    return matchesSearch && matchesClassification && matchesGender;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const currentStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <div className="bg-white rounded-xl shadow-md border border-gray-200/70 overflow-hidden h-full flex flex-col">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              Staff Directory
            </h3>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                1-{filteredStaff.length} of {filteredStaff.length}
              </span>
              <span className="text-gray-400">•</span>
              <span>Active Staff Members</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[28rem] pl-12 pr-5 py-4 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300 "
              />
            </div>

            {/* Classification Filter */}
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="px-5 py-4 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
            >
              <option value="all">🏢 All Classifications</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-5 py-4 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
            >
              <option value="all">👥 All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button
              onClick={onAddStaff}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white text-sm font-bold rounded-lg hover:from-[#6d8735] hover:to-emerald-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Staff
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-6 py-5 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-5 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-5 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-5 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStaff.map((staffMember, index) => (
              <tr
                key={staffMember.id}
                style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-sm animate-fade-in hover:bg-gray-50`}
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#82A33D] to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {staffMember.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-[#82A33D] transition-colors">{staffMember.fullName}</div>
                      <div className="text-xs text-gray-500 font-medium">{staffMember.classification}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-700">{staffMember.email}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-700">{staffMember.classification}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="text-sm font-bold text-gray-900">{staffMember.age}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-700">{staffMember.gender}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-700">{staffMember.phoneNumber}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  {staffMember.isActive ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border border-gray-300 shadow-sm">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const freshStaff = await getStaffById(staffMember.id);
                      // Removed console.log for fetched staff to clean up console output
                          if (freshStaff) {
                            onEditStaff(freshStaff);
                          } else {
                            console.warn('getStaffById returned null, falling back to passed staff data');
                            onEditStaff(staffMember);
                          }
                        } catch (error) {
                          console.error('Error fetching staff details:', error);
                          alert('Failed to fetch staff details, opening with cached data');
                          onEditStaff(staffMember);
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white text-xs font-bold rounded-lg hover:from-[#6d8735] hover:to-emerald-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(staffMember.id);
                      }}
                      disabled={deletingId === staffMember.id}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {deletingId === staffMember.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Fill empty rows to always show 5 rows */}
            {Array.from({ length: Math.max(0, 5 - currentStaff.length) }).map((_, index) => (
              <tr key={`empty-${index}`} style={{ height: '74px' }} className="bg-gray-50/30 border-dashed border-gray-200">
                <td className="px-6 py-5" colSpan={8}>
                  <div className="flex items-center justify-center text-gray-300 text-sm font-medium opacity-60">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2 opacity-40"></div>
                    Empty slot {index + 1}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    pageNum = start + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-all ${
                        pageNum === currentPage
                          ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      aria-current={pageNum === currentPage ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffGrid;
