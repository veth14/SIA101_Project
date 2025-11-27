// src/components/maintenance/staff-schedules/CreateLeaveRequestModal.tsx
import React, { useMemo, useState } from 'react';
import { Staff, LeaveRequest } from './types';
import { 
  calculateLeaveDays, 
  calculateLeaveBalance, 
  getLeaveBalanceMessage,
  getLeaveBalanceColor,
  getLeaveBalanceBackground
} from './utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  loadingStaff: boolean;
  existingLeaveRequests?: LeaveRequest[];
  onCreate: (payload: {
    staffId: string;
    fullName: string;
    classification?: string;
    startDate: string;
    endDate: string;
    leaveType: string;
    notes?: string;
    totalDays?: number; // ✅ Make optional to match usage
  }) => Promise<void> | void;
}

const leaveTypes = ['Vacation', 'Sick', 'Emergency', 'Maternity', 'Paternity', 'Bereavement', 'Other'];

const CreateLeaveRequestModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  staffList, 
  loadingStaff, 
  existingLeaveRequests = [],
  onCreate 
}) => {
  const [staffId, setStaffId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [leaveType, setLeaveType] = useState<string>(leaveTypes[0]);
  const [notes, setNotes] = useState<string>('');

  const selectedStaff = useMemo(() => {
    return staffList.find(s => s.id === staffId) || null;
  }, [staffId, staffList]);

  // ✅ Calculate requested days
  const requestedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return calculateLeaveDays(startDate, endDate);
  }, [startDate, endDate]);

  // ✅ Calculate leave balance for selected staff
  const leaveBalance = useMemo(() => {
    if (!selectedStaff) return null;
    return calculateLeaveBalance(selectedStaff, existingLeaveRequests);
  }, [selectedStaff, existingLeaveRequests]);

  // ✅ Check if staff has enough balance
  const hasEnoughBalance = useMemo(() => {
    if (!leaveBalance || requestedDays === 0) return true;
    return leaveBalance.remaining >= requestedDays;
  }, [leaveBalance, requestedDays]);

  // ✅ Check if staff has an active leave request
  const hasActiveLeaveRequest = useMemo(() => {
    if (!staffId || !existingLeaveRequests) return false;
    
    try {
      return existingLeaveRequests.some(request => 
        request?.staffId === staffId && 
        (request?.status === 'pending' || request?.status === 'approved')
      );
    } catch (error) {
      console.error('Error checking active leave requests:', error);
      return false;
    }
  }, [staffId, existingLeaveRequests]);

  // ✅ Get the active leave request details if exists
  const activeLeaveRequest = useMemo(() => {
    if (!staffId || !existingLeaveRequests) return null;
    
    try {
      return existingLeaveRequests.find(request => 
        request?.staffId === staffId && 
        (request?.status === 'pending' || request?.status === 'approved')
      ) || null;
    } catch (error) {
      console.error('Error finding active leave request:', error);
      return null;
    }
  }, [staffId, existingLeaveRequests]);

  const handleSubmit = async () => {
    if (!staffId || !startDate || !endDate || !leaveType) {
      alert('Please fill required fields.');
      return;
    }

    // ✅ Check for active request
    if (hasActiveLeaveRequest) {
      alert('This staff member already has an active leave request. Please wait for it to be processed or rejected before creating a new one.');
      return;
    }

    // ✅ Validate date range
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be after start date.');
      return;
    }

    // ✅ Check if leave is filed at least 7 days in advance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const leaveStartDate = new Date(startDate);
    leaveStartDate.setHours(0, 0, 0, 0);
    
    const daysDifference = Math.floor((leaveStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 7) {
      alert('Leave request must be filed at least 7 days before the leave start date. Please select a start date that is at least 7 days from today.');
      return;
    }

    // ✅ NEW: Check if staff has enough leave balance
    if (!hasEnoughBalance) {
      alert(`Insufficient leave balance. You are requesting ${requestedDays} days but only have ${leaveBalance?.remaining || 0} days remaining.`);
      return;
    }

    try {
      await onCreate({
        staffId,
        fullName: selectedStaff?.fullName || '',
        classification: selectedStaff?.classification || '',
        startDate,
        endDate,
        leaveType,
        notes,
        totalDays: requestedDays // ✅ NEW: Pass total days
      });

      // reset
      setStaffId('');
      setStartDate('');
      setEndDate('');
      setLeaveType(leaveTypes[0]);
      setNotes('');
    } catch (error) {
      console.error('Error creating leave request:', error);
      alert('Failed to create leave request. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Add Leave Request</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff <span className="text-red-500">*</span>
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
            >
              <option value="">Select staff</option>
              {loadingStaff ? (
                <option>Loading...</option>
              ) : (
                staffList.map(s => {
                  const hasActive = existingLeaveRequests?.some(request => 
                    request?.staffId === s.id && 
                    (request?.status === 'pending' || request?.status === 'approved')
                  );
                  
                  return (
                    <option key={s.id} value={s.id} disabled={hasActive}>
                      {s.fullName || 'Unnamed Staff'} 
                      {s.classification ? ` — ${s.classification}` : ''} 
                      {hasActive ? ' (Active Request)' : ''}
                    </option>
                  );
                })
              )}
            </select>
            
            {/* ✅ Warning message if staff has active leave */}
            {hasActiveLeaveRequest && activeLeaveRequest && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800">Active Leave Request Exists</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {activeLeaveRequest.leaveType} ({activeLeaveRequest.status})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ NEW: Leave Balance Display */}
            {selectedStaff && leaveBalance && (
              <div className={`mt-2 p-3 border rounded-lg ${getLeaveBalanceBackground(leaveBalance.remaining)}`}>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Leave Balance ({leaveBalance.year})</p>
                    <div className="mt-1 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Entitlement:</span>
                        <span className="font-medium">{leaveBalance.totalEntitlement} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Used (Approved):</span>
                        <span className="font-medium">{leaveBalance.used} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-medium">{leaveBalance.pending} days</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-600">Remaining:</span>
                        <span className={`font-bold ${getLeaveBalanceColor(leaveBalance.remaining)}`}>
                          {leaveBalance.remaining} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
            >
              {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={(() => {
                const minDate = new Date();
                minDate.setDate(minDate.getDate() + 7);
                return minDate.toISOString().split('T')[0];
              })()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 7 days from today
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
            />
          </div>

          {/* ✅ NEW: Display requested days and balance check */}
          {requestedDays > 0 && (
            <div className="md:col-span-2">
              <div className={`p-3 border rounded-lg ${
                hasEnoughBalance 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Requesting: {requestedDays} day{requestedDays !== 1 ? 's' : ''}
                    </p>
                    {leaveBalance && (
                      <p className="text-xs mt-1">
                        After approval: {leaveBalance.remaining - requestedDays} day{(leaveBalance.remaining - requestedDays) !== 1 ? 's' : ''} remaining
                      </p>
                    )}
                  </div>
                  {!hasEnoughBalance && (
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent resize-none"
              rows={3}
              placeholder="Additional information about the leave request..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={hasActiveLeaveRequest || !staffId || !startDate || !endDate || !hasEnoughBalance}
            className="px-5 py-2 rounded-lg bg-[#82A33D] text-white hover:bg-[#6d8a33] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Leave Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaveRequestModal;