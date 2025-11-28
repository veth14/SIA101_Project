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
    totalDays?: number;
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
  const [loading, setLoading] = useState(false);

  const selectedStaff = useMemo(() => {
    return staffList.find(s => s.id === staffId) || null;
  }, [staffId, staffList]);

  const requestedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return calculateLeaveDays(startDate, endDate);
  }, [startDate, endDate]);

  const leaveBalance = useMemo(() => {
    if (!selectedStaff) return null;
    return calculateLeaveBalance(selectedStaff, existingLeaveRequests);
  }, [selectedStaff, existingLeaveRequests]);

  const hasEnoughBalance = useMemo(() => {
    if (!leaveBalance || requestedDays === 0) return true;
    return leaveBalance.remaining >= requestedDays;
  }, [leaveBalance, requestedDays]);

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

    if (hasActiveLeaveRequest) {
      alert('This staff member already has an active leave request. Please wait for it to be processed or rejected before creating a new one.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be after start date.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const leaveStartDate = new Date(startDate);
    leaveStartDate.setHours(0, 0, 0, 0);
    
    const daysDifference = Math.floor((leaveStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 7) {
      alert('Leave request must be filed at least 7 days before the leave start date. Please select a start date that is at least 7 days from today.');
      return;
    }

    if (!hasEnoughBalance) {
      alert(`Insufficient leave balance. You are requesting ${requestedDays} days but only have ${leaveBalance?.remaining || 0} days remaining.`);
      return;
    }

    try {
      setLoading(true);
      await onCreate({
        staffId,
        fullName: selectedStaff?.fullName || '',
        classification: selectedStaff?.classification || '',
        startDate,
        endDate,
        leaveType,
        notes,
        totalDays: requestedDays
      });

      setStaffId('');
      setStartDate('');
      setEndDate('');
      setLeaveType(leaveTypes[0]);
      setNotes('');
    } catch (error) {
      console.error('Error creating leave request:', error);
      alert('Failed to create leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slide-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.4s ease-out;
        }
      `}</style>
      
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/40">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in-up">
          
          {/* Header - matching CreateScheduleModal style */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Create Leave Request</h3>
                  <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                      Time Off Management
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>Request leave or time off</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 transition-colors rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)] space-y-6 bg-gray-50">
            
            {loadingStaff ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#82A33D]"></div>
              </div>
            ) : (
              <>
                {/* Staff & Leave Type Card */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Staff & Leave Type</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Staff Selection */}
                    <div className="p-4 space-y-3 bg-white border border-gray-200/60 rounded-lg">
                      <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">
                        Select Staff <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent bg-white font-medium"
                      >
                        <option value="">Choose staff member...</option>
                        {staffList.map(s => {
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
                        })}
                      </select>
                      {selectedStaff && (
                        <p className="text-xs text-gray-600 mt-2">
                          Classification: <span className="font-semibold text-[#82A33D]">{selectedStaff.classification || 'N/A'}</span>
                        </p>
                      )}
                    </div>

                    {/* Leave Type Selection */}
                    <div className="p-4 space-y-3 bg-white border border-gray-200/60 rounded-lg">
                      <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">
                        Leave Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent bg-white font-medium"
                      >
                        {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Active Leave Request Warning */}
                  {hasActiveLeaveRequest && activeLeaveRequest && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-50/40 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-orange-900">Active Leave Request Exists</p>
                          <p className="text-xs text-orange-700 mt-1">
                            {activeLeaveRequest.leaveType} ({activeLeaveRequest.status})
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dates Card */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Leave Dates</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                      <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">
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
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent bg-white font-medium"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        At least 7 days in advance
                      </p>
                    </div>

                    {/* End Date */}
                    <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                      <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent bg-white font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Leave Balance Card */}
                {selectedStaff && leaveBalance && (
                  <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Leave Balance ({leaveBalance.year})</h4>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-600">Total Entitlement</p>
                        <p className="text-2xl font-black text-blue-600 mt-1">{leaveBalance.totalEntitlement}</p>
                        <p className="text-xs text-gray-600 mt-1">days</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-gray-600">Used (Approved)</p>
                        <p className="text-2xl font-black text-green-600 mt-1">{leaveBalance.used}</p>
                        <p className="text-xs text-gray-600 mt-1">days</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-gray-600">Pending</p>
                        <p className="text-2xl font-black text-yellow-600 mt-1">{leaveBalance.pending}</p>
                        <p className="text-xs text-gray-600 mt-1">days</p>
                      </div>
                      <div className={`p-3 rounded-lg border ${
                        leaveBalance.remaining >= requestedDays && requestedDays > 0
                          ? 'bg-emerald-50 border-emerald-200'
                          : leaveBalance.remaining < requestedDays && requestedDays > 0
                          ? 'bg-red-50 border-red-200'
                          : 'bg-purple-50 border-purple-200'
                      }`}>
                        <p className="text-xs text-gray-600">Remaining</p>
                        <p className={`text-2xl font-black mt-1 ${
                          leaveBalance.remaining >= requestedDays && requestedDays > 0
                            ? 'text-emerald-600'
                            : leaveBalance.remaining < requestedDays && requestedDays > 0
                            ? 'text-red-600'
                            : 'text-purple-600'
                        }`}>
                          {leaveBalance.remaining}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">days</p>
                      </div>
                    </div>

                    {/* Requested Days Info */}
                    {requestedDays > 0 && (
                      <div className={`mt-4 p-4 rounded-xl border ${
                        hasEnoughBalance 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-semibold ${hasEnoughBalance ? 'text-blue-900' : 'text-red-900'}`}>
                              Requesting: {requestedDays} day{requestedDays !== 1 ? 's' : ''}
                            </p>
                            <p className={`text-xs mt-1 ${hasEnoughBalance ? 'text-blue-700' : 'text-red-700'}`}>
                              After approval: {leaveBalance.remaining - requestedDays} day{(leaveBalance.remaining - requestedDays) !== 1 ? 's' : ''} remaining
                            </p>
                          </div>
                          {hasEnoughBalance ? (
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes Card */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Additional Notes</h4>
                  </div>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional information about your leave request..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent bg-white font-medium resize-none"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={hasActiveLeaveRequest || !staffId || !startDate || !endDate || !hasEnoughBalance || loading}
                className="px-6 py-3 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white rounded-xl hover:from-[#6d8735] hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
              >
                {loading ? 'Creating...' : 'Create Leave Request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLeaveRequestModal;