// src/components/maintenance/staff-schedules/LeaveRequestFilters.tsx
import React from 'react';
import { formatWeekRange } from './utils';

interface Props {
  onAdd: () => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  classificationFilter: string;
  setClassificationFilter: (s: string) => void;
  uniqueClassifications: string[];
  currentWeekOffset: number;
  setCurrentWeekOffset: (o: number | ((prev: number) => number)) => void;
  currentWeekRange: { start: Date; end: Date; label: string };
}

const LeaveRequestFilters: React.FC<Props> = ({
  onAdd,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  classificationFilter,
  setClassificationFilter,
  uniqueClassifications,
  currentWeekOffset,
  setCurrentWeekOffset,
  currentWeekRange
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
      <button
        onClick={onAdd}
        className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors"
      >
        Add Leave Request
      </button>

      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
        <button
          onClick={() => setCurrentWeekOffset((p: number) => p - 1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Previous week"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col items-center min-w-[200px]">
          <span className="text-sm font-semibold text-gray-800">{currentWeekRange.label}</span>
          <span className="text-xs text-gray-500">{formatWeekRange(currentWeekRange.start, currentWeekRange.end)}</span>
        </div>

        <button
          onClick={() => setCurrentWeekOffset((p: number) => p + 1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Next week"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {currentWeekOffset !== 0 && (
          <button
            onClick={() => setCurrentWeekOffset(0)}
            className="ml-2 px-2 py-1 text-xs bg-[#82A33D] text-white rounded hover:bg-[#6d8a33] transition-colors"
          >
            Today
          </button>
        )}
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={classificationFilter}
        onChange={(e) => setClassificationFilter(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="all">All Classifications</option>
        {uniqueClassifications.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search staff or leave type..."
        className="border border-gray-300 rounded-lg px-3 py-2 min-w-[220px]"
      />
    </div>
  );
};

export default LeaveRequestFilters;
