import React from 'react';

// Types
interface WeeklySchedule {
  [staffId: string]: {
    staffName: string;
    classification: string;
    schedule: {
      [day: string]: {
        shiftTime: string;
      } | null;
    };
  };
}

// Constants
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ✅ UPDATED: More flexible department classification matching
const MAINTENANCE_KEYWORDS = ['maintenance', 'electrician', 'plumber', 'hvac', 'carpenter', 'technician'];
const HOUSEKEEPING_KEYWORDS = ['housekeeping', 'room attendant', 'housekeeper', 'laundry', 'supervisor'];

// Utils
const formatWeekRange = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

// ✅ Helper function to match classification to department
const matchesDepartment = (classification: string, department: string): boolean => {
  const lowerClass = classification.toLowerCase();
  
  if (department === 'maintenance') {
    return MAINTENANCE_KEYWORDS.some(keyword => lowerClass.includes(keyword));
  } else if (department === 'housekeeping') {
    return HOUSEKEEPING_KEYWORDS.some(keyword => lowerClass.includes(keyword));
  }
  
  return true; // 'all' department
};

interface ScheduleTableProps {
  weeklySchedule: WeeklySchedule;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedClassification: string;
  setSelectedClassification: (classification: string) => void;
  uniqueClassifications: string[];
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number | ((prev: number) => number)) => void;
  currentWeekRange: { start: Date; end: Date; label: string };
  onCreateSchedule: () => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  weeklySchedule,
  selectedDepartment,
  setSelectedDepartment,
  selectedClassification,
  setSelectedClassification,
  uniqueClassifications,
  currentWeekOffset,
  setCurrentWeekOffset,
  currentWeekRange,
  onCreateSchedule
}) => {
  const totalStaff = Object.keys(weeklySchedule).length;

  // ✅ UPDATED: Filter classifications based on selected department
  const getFilteredClassifications = (): string[] => {
    console.log('🔍 Filtering classifications:', {
      selectedDepartment,
      uniqueClassifications,
      totalUnique: uniqueClassifications.length
    });

    if (selectedDepartment === 'all') {
      return uniqueClassifications;
    }

    const filtered = uniqueClassifications.filter(classification => 
      matchesDepartment(classification, selectedDepartment)
    );

    console.log('✅ Filtered classifications:', filtered);
    return filtered;
  };

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

      {/* Schedule Table */}
      <div className="flex flex-col bg-white border shadow-md rounded-xl border-gray-200/70 h-[600px]">
        {/* Header with Controls and Filters */}
        <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Weekly Schedule
              </h3>
              <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  {totalStaff === 0 ? '0 staff' : `${totalStaff} staff`}
                </span>
                <span className="text-gray-400">•</span>
                <span>{currentWeekRange.label}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={onCreateSchedule}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white transition-all bg-[#82A33D] rounded-xl hover:bg-[#6d8a33] shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Schedule</span>
              </button>
            </div>
          </div>

          {/* Filters and Week Navigation Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Week Navigation */}
            <div className="md:col-span-5 flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-4 py-3">
              <button
                onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous week"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-800">{currentWeekRange.label}</span>
                <span className="text-xs font-medium text-gray-500">
                  {formatWeekRange(currentWeekRange.start, currentWeekRange.end)}
                </span>
              </div>
              
              <button
                onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Next week"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {currentWeekOffset !== 0 && (
                <button
                  onClick={() => setCurrentWeekOffset(0)}
                  className="ml-2 px-3 py-1.5 text-xs font-bold bg-[#82A33D] text-white rounded-lg hover:bg-[#6d8a33] transition-colors"
                  title="Go to current week"
                >
                  Today
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select 
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedClassification('all');
                }}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
              >
                <option value="all">🏢 All Departments</option>
                <option value="maintenance">🔧 Maintenance</option>
                <option value="housekeeping">🧹 Housekeeping</option>
              </select>
            </div>

            {/* Classification Filter */}
            <div className="md:col-span-4">
              <select 
                value={selectedClassification}
                onChange={(e) => setSelectedClassification(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                disabled={uniqueClassifications.length === 0}
              >
                <option value="all">
                  {uniqueClassifications.length === 0 
                    ? '⏳ Loading classifications...' 
                    : '👥 All Classifications'}
                </option>
                {getFilteredClassifications().map(classification => (
                  <option key={classification} value={classification}>
                    {classification}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                  Staff Member
                </th>
                {DAYS.map(day => (
                  <th
                    key={day}
                    className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {totalStaff === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center"
                  >
                    <div className="mb-4 text-5xl text-gray-400">📅</div>
                    <p className="font-medium text-gray-500">
                      {selectedDepartment !== 'all' || selectedClassification !== 'all'
                        ? 'No schedules found for the selected filters'
                        : 'No schedules created yet'}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {selectedDepartment === 'all' && selectedClassification === 'all'
                        ? 'Click "Create Schedule" to add staff schedules'
                        : 'Try adjusting your filters'}
                    </p>
                  </td>
                </tr>
              ) : (
                Object.entries(weeklySchedule).map(([staffId, data], index) => (
                  <tr
                    key={staffId}
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
                            {data.staffName}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            {data.classification}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Schedule Columns */}
                    {DAYS.map(day => (
                      <td key={day} className="px-6 py-5 text-center whitespace-nowrap">
                        {data.schedule[day] ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                            <span className="w-1.5 h-1.5 mr-2 rounded-full bg-emerald-500" />
                            {data.schedule[day].shiftTime}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            Off
                          </span>
                        )}
                      </td>
                    ))}
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

export default ScheduleTable;