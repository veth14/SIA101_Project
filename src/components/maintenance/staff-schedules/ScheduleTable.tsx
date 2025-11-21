// ScheduleTable.tsx
import React from 'react';
import { WeeklySchedule } from './types';
import { DAYS } from './constants';

interface ScheduleTableProps {
  weeklySchedule: WeeklySchedule;
  selectedDepartment: string;
  selectedClassification: string;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  weeklySchedule,
  selectedDepartment,
  selectedClassification
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Weekly Schedule</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff
              </th>
              {DAYS.map(day => (
                <th key={day} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.keys(weeklySchedule).length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  {selectedDepartment !== 'all' || selectedClassification !== 'all'
                    ? `No schedules found for the selected filters.`
                    : 'No schedules created yet. Click "Create Schedule" to add staff schedules.'
                  }
                </td>
              </tr>
            ) : (
              Object.entries(weeklySchedule).map(([staffId, data]) => (
                <tr key={staffId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.staffName}</div>
                    <div className="text-sm text-gray-500">{data.classification}</div>
                  </td>
                  {DAYS.map(day => (
                    <td key={day} className="px-6 py-4 text-center">
                      {data.schedule[day] ? (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {data.schedule[day].shiftTime}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Off</span>
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
  );
};

export default ScheduleTable;