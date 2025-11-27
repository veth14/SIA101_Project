import React from 'react';
interface ScheduleFiltersProps {
    onCreateSchedule: () => void;
    currentWeekOffset: number;
    setCurrentWeekOffset: (offset: number | ((prev: number) => number)) => void;
    currentWeekRange: {
        start: Date;
        end: Date;
        label: string;
    };
    selectedDepartment: string;
    setSelectedDepartment: (dept: string) => void;
    selectedClassification: string;
    setSelectedClassification: (classification: string) => void;
    uniqueClassifications: string[];
}
declare const ScheduleFilters: React.FC<ScheduleFiltersProps>;
export default ScheduleFilters;
