// src/components/maintenance/staff-schedules/LeaveRequestDetailsModal.tsx
import React from 'react';
import { createPortal } from 'react-dom';

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
  const totalDays = leaveRequest.totalDays || Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get status badge styling
  const getStatusBadge = () => {
    switch (leaveRequest.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full mr-2 bg-emerald-500" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-red-100 text-red-800 border border-red-200">
            <span className="w-2 h-2 rounded-full mr-2 bg-red-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
            <span className="w-2 h-2 rounded-full mr-2 bg-yellow-500" />
            Pending
          </span>
        );
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white/95 shadow-2xl border border-white/60 max-h-[90vh] overflow-hidden">
        {/* Header - aligned with new modal design */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#82A33D] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#82A33D]">Leave Request Details</h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  {leaveRequest.fullName} • {leaveRequest.staffId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 rounded-md ring-1 ring-[#82A33D]/20 hover:bg-[#82A33D]/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)] bg-gray-50">
          {/* Status Alert Banner */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-bold text-yellow-800">{leaveRequest.leaveType} Leave</p>
                <p className="text-xs text-yellow-700">Status: {leaveRequest.status.charAt(0).toUpperCase() + leaveRequest.status.slice(1)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-5">
            {/* Left Column - Employee Information */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-gray-900">Employee Information</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Name:</p>
                  <p className="font-semibold text-gray-900">{leaveRequest.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Employee ID:</p>
                  <p className="font-semibold text-gray-900">{leaveRequest.staffId}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Classification:</p>
                  <p className="font-semibold text-gray-900">{leaveRequest.classification || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Leave Details */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-gray-900">Leave Details</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Leave Type:</p>
                  <p className="font-semibold text-gray-900">{leaveRequest.leaveType}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Status:</p>
                  {getStatusBadge()}
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Start Date:</p>
                  <p className="font-semibold text-gray-900">{formatDate(startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">End Date:</p>
                  <p className="font-semibold text-gray-900">{formatDate(endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Period Summary */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-base font-bold text-gray-900 mb-3">Leave Period Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(startDate)} — {formatDate(endDate)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-gray-600">Total Days:</span>
                <span className="text-lg font-bold text-[#82A33D]">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {leaveRequest.notes && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-base font-bold text-gray-900 mb-2">Additional Notes</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{leaveRequest.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LeaveRequestDetailsModal;