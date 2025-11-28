// CreateScheduleModal.tsx - UPDATED WITH ELEGANT DESIGN
import React, { useMemo } from 'react';
import { Staff, LeaveRequest } from './types';
import { SHIFTS } from './constants';
import { formatDateForDisplay } from './utils';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedShift: string;
  setSelectedShift: (shift: string) => void;
  selectedStaff: string[];
  handleStaffToggle: (staffId: string) => void;
  staffList: Staff[];
  loading: boolean;
  onSubmit: () => void;
  leaveRequests: LeaveRequest[];
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
  selectedShift,
  setSelectedShift,
  selectedStaff,
  handleStaffToggle,
  staffList,
  loading,
  onSubmit,
  leaveRequests
}) => {
  // Check which staff members are on approved leave for the selected date
  const staffOnLeaveMap = useMemo(() => {
    if (!selectedDate) return new Map<string, LeaveRequest>();
    
    const scheduleDate = new Date(selectedDate);
    const onLeaveMap = new Map<string, LeaveRequest>();
    
    leaveRequests.forEach(request => {
      if (request.status !== 'approved') return;
      
      const leaveStart = new Date(request.startDate);
      const leaveEnd = new Date(request.endDate);
      
      if (scheduleDate >= leaveStart && scheduleDate <= leaveEnd) {
        onLeaveMap.set(request.staffId, request);
      }
    });
    
    return onLeaveMap;
  }, [selectedDate, leaveRequests]);

  const isStaffOnLeave = (staffId: string): boolean => {
    return staffOnLeaveMap.has(staffId);
  };

  const getLeaveDetails = (staffId: string): LeaveRequest | undefined => {
    return staffOnLeaveMap.get(staffId);
  };

  const selectedValidStaff = useMemo(() => {
    return selectedStaff.filter(id => !isStaffOnLeave(id));
  }, [selectedStaff, staffOnLeaveMap]);

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
          
          {/* Header - matching TransactionDetails style */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Create New Schedule</h3>
                  <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                      Staff Assignment
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>Assign staff to shifts</span>
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

          {/* Main Content - card-based layout */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)] space-y-6 bg-gray-50">
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#82A33D]"></div>
              </div>
            ) : (
              <>
                {/* Schedule Details Card */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Schedule Details</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Selection */}
                    <div className="p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg">
                      <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">
                        Schedule Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent bg-white font-medium"
                      />
                      {selectedDate && (
                        <p className="text-xs text-gray-600 mt-2">
                          Selected: <span className="font-semibold text-[#82A33D]">{formatDateForDisplay(selectedDate)}</span>
                        </p>
                      )}
                    </div>

                    {/* Staff Count Display */}
                    {selectedValidStaff.length > 0 && (
                      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-50/40 border border-emerald-200">
                        <label className="text-xs font-semibold tracking-wide uppercase text-gray-600 mb-2 block">
                          Staff Selected
                        </label>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-black text-gray-900">{selectedValidStaff.length}</p>
                            <p className="text-xs text-gray-600">member{selectedValidStaff.length !== 1 ? 's' : ''}</p>
                          </div>
                          <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shift Selection Card */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Shift Time</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {SHIFTS.map(shift => (
                      <label
                        key={shift.value}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedShift === shift.value
                            ? 'border-[#82A33D] bg-[#82A33D]/10'
                            : 'border-gray-200 hover:border-[#82A33D]/30 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shift"
                          value={shift.value}
                          checked={selectedShift === shift.value}
                          onChange={(e) => setSelectedShift(e.target.value)}
                          className="sr-only"
                        />
                        <svg className={`w-6 h-6 mb-2 ${selectedShift === shift.value ? 'text-[#82A33D]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-sm font-semibold ${selectedShift === shift.value ? 'text-[#82A33D]' : 'text-gray-700'}`}>
                          {shift.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Staff Selection Card */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Staff Members</h4>
                  </div>

                  {/* Warning if date not selected */}
                  {!selectedDate && (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/40 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-blue-900">Select a Date First</p>
                          <p className="text-xs text-blue-700 mt-1">
                            Please select a schedule date to check staff availability and leave status
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Staff on leave warning */}
                  {selectedDate && staffOnLeaveMap.size > 0 && (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-50/40 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-orange-900">Staff on Leave</p>
                          <p className="text-xs text-orange-700 mt-1">
                            {staffOnLeaveMap.size} staff member{staffOnLeaveMap.size !== 1 ? 's' : ''} unavailable due to approved leave
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Staff List */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {staffList.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-sm text-gray-500 font-medium">No staff members available</p>
                      </div>
                    ) : (
                      staffList.map(staff => {
                        const onLeave = isStaffOnLeave(staff.id);
                        const leaveDetails = getLeaveDetails(staff.id);
                        
                        return (
                          <label
                            key={staff.id}
                            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              onLeave 
                                ? 'bg-red-50 border-red-200 opacity-60 cursor-not-allowed' 
                                : selectedStaff.includes(staff.id)
                                ? 'bg-[#82A33D]/10 border-[#82A33D]'
                                : 'bg-white border-gray-200 hover:border-[#82A33D]/50 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStaff.includes(staff.id)}
                              onChange={() => handleStaffToggle(staff.id)}
                              disabled={onLeave}
                              className="w-5 h-5 text-[#82A33D] rounded-lg focus:ring-[#82A33D] border-gray-300 mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">
                                  {staff.fullName || 'Unnamed Staff'}
                                </span>
                                {onLeave && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                    On Leave
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {staff.classification || 'No classification'}
                              </p>
                              
                              {/* Leave details */}
                              {onLeave && leaveDetails && (
                                <div className="mt-2 p-2 bg-red-100 rounded-lg">
                                  <p className="text-xs text-red-700 font-medium">
                                    {leaveDetails.leaveType}
                                  </p>
                                  <p className="text-xs text-red-600">
                                    {new Date(leaveDetails.startDate).toLocaleDateString()} - {new Date(leaveDetails.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
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
                onClick={onSubmit}
                disabled={selectedValidStaff.length === 0 || loading || !selectedDate}
                className="px-6 py-3 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white rounded-xl hover:from-[#6d8735] hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
              >
                {loading ? 'Creating...' : 'Create Schedule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateScheduleModal;