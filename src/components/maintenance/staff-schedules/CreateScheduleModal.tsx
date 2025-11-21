// CreateScheduleModal.tsx
import React from 'react';
import { Staff } from './types';
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
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#9CB347] rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#9CB347]">Create New Schedule</h2>
                <p className="text-sm text-gray-500 mt-1">Assign staff members to their shifts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)] bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9CB347]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Schedule Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#9CB347]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                    </svg>
                    <h3 className="text-lg font-bold text-[#9CB347]">Schedule Details</h3>
                  </div>

                  {/* Select Date */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Schedule Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9CB347] focus:border-transparent bg-white"
                    />
                    {selectedDate && (
                      <p className="mt-2 text-xs text-gray-600">
                        Selected: <span className="font-semibold text-[#9CB347]">{formatDateForDisplay(selectedDate)}</span>
                      </p>
                    )}
                  </div>

                  {/* Select Shift */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Shift Time
                    </label>
                    <div className="space-y-2">
                      {SHIFTS.map(shift => (
                        <label
                          key={shift.value}
                          className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-white hover:border-[#9CB347]/30 cursor-pointer transition-all bg-white"
                        >
                          <input
                            type="radio"
                            name="shift"
                            value={shift.value}
                            checked={selectedShift === shift.value}
                            onChange={(e) => setSelectedShift(e.target.value)}
                            className="w-4 h-4 text-[#9CB347] focus:ring-[#9CB347] border-gray-300"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {shift.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Staff Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[#9CB347]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <h3 className="text-lg font-bold text-[#9CB347]">Staff Members</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Select Staff Members
                  </label>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto border border-gray-200 rounded-xl p-4 bg-white">
                    {staffList.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No staff members found</p>
                    ) : (
                      staffList.map(staff => (
                        <label
                          key={staff.id}
                          className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStaff.includes(staff.id)}
                            onChange={() => handleStaffToggle(staff.id)}
                            className="w-4 h-4 text-[#9CB347] rounded focus:ring-[#9CB347] border-gray-300 mt-0.5"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">
                              {staff.fullName || 'Unnamed Staff'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {staff.classification || 'No classification'}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  {selectedStaff.length > 0 && (
                    <div className="mt-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium">
                        {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-8 py-5 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={selectedStaff.length === 0 || loading || !selectedDate}
            className="px-6 py-2.5 bg-[#9CB347] text-white rounded-xl hover:bg-[#8a9f3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;