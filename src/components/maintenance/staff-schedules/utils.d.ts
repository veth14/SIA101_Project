import { Schedule } from './types';
export declare const getDayFromDate: (dateString: string) => string;
export declare const formatDateForDisplay: (dateString: string) => string;
export declare const getWeekNumber: (date: Date) => number;
export declare const getWeekDateRange: (offset: number) => {
    start: Date;
    end: Date;
    label: string;
};
export declare const formatWeekRange: (start: Date, end: Date) => string;
export declare const filterSchedulesByWeek: (schedulesData: Schedule[], start: Date, end: Date) => Schedule[];
export declare const getDepartment: (classification: string) => string;
export declare const getShiftTime: (shift: string) => string;
