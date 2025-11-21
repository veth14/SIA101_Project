// ScheduleFilters.tsx
import React from 'react';
import { MAINTENANCE_CLASSIFICATIONS, HOUSEKEEPING_CLASSIFICATIONS } from './constants';
import { formatWeekRange } from './utils';

interface ScheduleFiltersProps {
  onCreateSchedule: () => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number | ((prev: number) => number)) => void;
  currentWeekRange: { start: Date; end: Date; label: string };
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedClassification: string;
  setSelectedClassification: (classification: string) => void;
  uniqueClassifications: string[];
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  onCreateSchedule,
  currentWeekOffset,
  setCurrentWeekOffset,
  currentWeekRange,
  selectedDepartment,
  setSelectedDepartment,
  selectedClassification,
  setSelectedClassification,
  uniqueClassifications
}) => {
  const getFilteredClassifications = (): string[] => {
    if (selectedDepartment === 'maintenance') {
      return uniqueClassifications.filter(c => MAINTENANCE_CLASSIFICATIONS.includes(c));
    } else if (selectedDepartment === 'housekeeping') {
      return uniqueClassifications.filter(c => HOUSEKEEPING_CLASSIFICATIONS.includes(c));
    }
    return uniqueClassifications;
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
      <button 
        onClick={onCreateSchedule}
        className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors"
      >
        Create Schedule
      </button>
      
      {/* Week Navigation */}
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
        <button
          onClick={() => setCurrentWeekOffset(prev => prev - 1)}
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
          onClick={() => setCurrentWeekOffset(prev => prev + 1)}
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
            title="Go to current week"
          >
            Today
          </button>
        )}
      </div>
      
      {/* Department Filter */}
      <select 
        value={selectedDepartment}
        onChange={(e) => {
          setSelectedDepartment(e.target.value);
          setSelectedClassification('all');
        }}
        className="border border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="all">All Departments</option>
        <option value="maintenance">Maintenance</option>
        <option value="housekeeping">Housekeeping</option>
      </select>
      
      {/* Classification Filter */}
      <select 
        value={selectedClassification}
        onChange={(e) => setSelectedClassification(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="all">All Classifications</option>
        {getFilteredClassifications().map(classification => (
          <option key={classification} value={classification}>
            {classification}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScheduleFilters;