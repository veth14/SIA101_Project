import React from 'react';
import { WeeklySchedule } from './types';
interface ScheduleTableProps {
    weeklySchedule: WeeklySchedule;
    selectedDepartment: string;
    selectedClassification: string;
}
declare const ScheduleTable: React.FC<ScheduleTableProps>;
export default ScheduleTable;
