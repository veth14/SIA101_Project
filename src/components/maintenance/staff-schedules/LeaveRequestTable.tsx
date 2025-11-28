// src/components/maintenance/staff-schedules/LeaveRequestTable.tsx
import React from 'react';
import { LeaveRequest } from './types';
import { formatWeekRange } from './utils';

interface Props {
  leaveRequests: LeaveRequest[];
  loading: boolean;
  onApprove: (id: string) => Promise<void> | void;
  onReject: (id: string) => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
  onView: (request: LeaveRequest) => void;
  onAdd: () => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  classificationFilter: string;
  setClassificationFilter: (s: string) => void;
  uniqueClassifications: string[];
}

const statusBadge = (status?: string) => {
  switch (status) {
    case 'approved':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          Approved
        </span>
      );
    case 'rejected':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Rejected
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
  }
};

const LeaveRequestTable: React.FC<Props> = ({
  leaveRequests,
  loading,
  onApprove,
  onReject,
  onRefresh,
  onView,
  onAdd,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  classificationFilter,
  setClassificationFilter,
  uniqueClassifications,
}) => {
  return (
    <>
      <style>{`
        @keyframes table-slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-table-slide-in {
          animation: table-slide-in 0.7s ease-out;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>

      {/* Leave Request Table - Fixed Height */}
      <div className="flex flex-col bg-white border shadow-md rounded-xl border-gray-200/70 h-[600px]">
        
        {/* Header with Controls - Won't shrink */}
        <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Leave Requests
              </h3>
              <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  {leaveRequests.length === 0 ? '0 requests' : `${leaveRequests.length} request${leaveRequests.length !== 1 ? 's' : ''}`}
                </span>
                <span className="text-gray-400">•</span>
                <span>Managing staff leave applications</span>
              </p>
            </div>

<div className="flex items-center gap-3">
  <button
    onClick={onAdd}
    className="group relative overflow-hidden bg-gradient-to-r from-[#82A33D] to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
  >
    {/* Hover overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-[#82A33D] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Content */}
    <div className="relative flex items-center space-x-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span>Add Leave Request</span>
    </div>
  </button>


              <button
                onClick={() => onRefresh()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters and Week Navigation Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">


            {/* Status Filter */}
            <div className="md:col-span-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
              >
                <option value="all">📋 All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>

            {/* Classification Filter */}
            <div className="md:col-span-3">
              <select 
                value={classificationFilter}
                onChange={(e) => setClassificationFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
              >
                <option value="all">👥 All Classifications</option>
                {uniqueClassifications.map(classification => (
                  <option key={classification} value={classification}>
                    {classification}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="md:col-span-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff..."
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Table - Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                  Staff
                </th>
<th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
  Requested At
</th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                  End Date
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                  Duration
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                  Type
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 text-4xl text-gray-400">⏳</div>
                      <p className="text-sm font-medium text-gray-500">Loading leave requests...</p>
                    </div>
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 text-5xl text-gray-400">📋</div>
                      <p className="font-medium text-gray-500">
                        {statusFilter !== 'all' || classificationFilter !== 'all' || searchTerm
                          ? 'No leave requests found for the selected filters'
                          : 'No leave requests created yet'}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        {statusFilter === 'all' && classificationFilter === 'all' && !searchTerm
                          ? 'Click "Add Leave Request" to create one'
                          : 'Try adjusting your filters'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaveRequests.map((req, index) => (
                  <tr
                    key={req.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="group hover:bg-gray-50 transition-all duration-300 animate-fade-in"
                  >
                    {/* Staff Column */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#82A33D]/10">
                          <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                            {req.fullName}
                          </div>
<div className="text-xs font-medium text-gray-500">
  {req.classification}
</div>
                        </div>
                      </div>
                    </td>

                    {/* Classification Column */}
<td className="px-6 py-5 whitespace-nowrap">
  <span className="text-sm font-medium text-gray-700">
    {new Date(req.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}
  </span>
</td>

                    {/* Start Date Column */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(req.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </td>

                    {/* End Date Column */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(req.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </td>

                    {/* Duration Column */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200">
                        <span className="w-1.5 h-1.5 mr-2 rounded-full bg-blue-500" />
                        {req.totalDays || 0} day{(req.totalDays || 0) !== 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* Type Column */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {req.leaveType}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      {statusBadge(req.status)}
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onApprove(req.id)}
                              className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg 
                              hover:bg-green-100 transition-all border border-green-200 hover:border-green-300"
                              title="Approve request"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => onReject(req.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg 
                              hover:bg-red-100 transition-all border border-red-200 hover:border-red-300"
                              title="Reject request"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}

                        {(req.status === 'approved' || req.status === 'rejected') && (
                          <button
                            onClick={() => onView(req)}
                            className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg 
                            hover:bg-gray-100 transition-all border border-gray-200 hover:border-gray-300"
                            title="View request details"
                          >
                            👁 View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LeaveRequestTable;