// src/components/maintenance/staff-schedules/LeaveRequestTable.tsx
import React from 'react';
import { LeaveRequest } from './types';

interface Props {
  leaveRequests: LeaveRequest[];
  loading: boolean;
  onApprove: (id: string) => Promise<void> | void;
  onReject: (id: string) => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
  onView: (leaveRequest: LeaveRequest) => void; // NEW: callback to view details
}

const statusBadge = (status?: string) => {
  switch (status) {
    case 'approved':
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>;
    case 'rejected':
      return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Rejected</span>;
    default:
      return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
  }
};

const LeaveRequestTable: React.FC<Props> = ({ 
  leaveRequests, 
  loading, 
  onApprove, 
  onReject, 
  onRefresh,
  onView // NEW
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Leave Requests</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => onRefresh()} className="px-3 py-1 border rounded text-sm">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classification</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : leaveRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No leave requests for this week.</td>
              </tr>
            ) : (
              leaveRequests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{req.fullName}</div>
                    <div className="text-sm text-gray-500">{req.staffId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.classification}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{new Date(req.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{new Date(req.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{req.leaveType}</td>
                  <td className="px-6 py-4 text-center">{statusBadge(req.status)}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {req.status === 'approved' ? (
                      // Show "View" button for approved requests
                      <button
                        onClick={() => onView(req)}
                        className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
                      >
                        View
                      </button>
                    ) : (
                      // Show Approve/Reject buttons for pending/rejected requests
                      <>
                        {req.status === 'pending' && (
                          <button
                            onClick={() => onApprove(req.id)}
                            className="px-3 py-1 rounded bg-green-50 text-green-700 text-sm hover:bg-green-100 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button
                            onClick={() => onReject(req.id)}
                            className="px-3 py-1 rounded bg-red-50 text-red-700 text-sm hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestTable;