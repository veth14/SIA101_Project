// src/components/maintenance/staff-schedules/LeaveRequestDetailsModal.tsx
import React from 'react';
import { LeaveRequest } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequest | null;
}

const LeaveRequestDetailsModal: React.FC<Props> = ({ isOpen, onClose, leaveRequest }) => {
  if (!isOpen || !leaveRequest) return null;

  // Calculate total days
  const startDate = new Date(leaveRequest.startDate);
  const endDate = new Date(leaveRequest.endDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Format date range
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Leave Request Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* Employee Name */}
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm font-medium text-gray-500">Employee Name:</p>
            <p className="text-base font-semibold text-gray-900 mt-1">{leaveRequest.fullName}</p>
          </div>

          {/* Employee ID */}
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm font-medium text-gray-500">Employee ID:</p>
            <p className="text-base font-semibold text-gray-900 mt-1">{leaveRequest.staffId}</p>
          </div>

          {/* Classification */}
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm font-medium text-gray-500">Classification:</p>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {leaveRequest.classification || 'N/A'}
            </p>
          </div>

          {/* Leave Type */}
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm font-medium text-gray-500">Leave Type:</p>
            <p className="text-base font-semibold text-gray-900 mt-1">{leaveRequest.leaveType}</p>
          </div>

          {/* Period */}
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm font-medium text-gray-500">Period:</p>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>

          {/* Total Days */}
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm font-medium text-gray-500">Total Days:</p>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {totalDays} day{totalDays !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Emergency Contact (if available) */}
          {leaveRequest.notes && leaveRequest.notes.includes('Emergency Contact:') && (
            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm font-medium text-gray-500">Emergency Contact:</p>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {leaveRequest.notes.split('Emergency Contact:')[1]?.trim().split('\n')[0] || 'N/A'}
              </p>
            </div>
          )}

          {/* Work Coverage / Notes */}
          {leaveRequest.notes && (
            <div className="pb-3">
              <p className="text-sm font-medium text-gray-500">
                {leaveRequest.notes.includes('Work Coverage:') ? 'Work Coverage:' : 'Notes:'}
              </p>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                {leaveRequest.notes}
              </p>
            </div>
          )}

          {/* Status Badge */}
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-500 mb-2">Status:</p>
            {leaveRequest.status === 'approved' && (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Approved
              </span>
            )}
            {leaveRequest.status === 'rejected' && (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Rejected
              </span>
            )}
            {leaveRequest.status === 'pending' && (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestDetailsModal;