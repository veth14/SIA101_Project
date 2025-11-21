// utils.ts
import { DAYS, MAINTENANCE_CLASSIFICATIONS, HOUSEKEEPING_CLASSIFICATIONS } from './constants';
import { Schedule } from './types';

export const getDayFromDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return DAYS[date.getDay()];
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getWeekDateRange = (offset: number): { start: Date; end: Date; label: string } => {
  const today = new Date();
  const currentDay = today.getDay();
  
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - currentDay);
  startOfCurrentWeek.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date(startOfCurrentWeek);
  startOfWeek.setDate(startOfCurrentWeek.getDate() + (offset * 7));
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  let label = '';
  if (offset === 0) {
    label = 'This Week';
  } else if (offset === 1) {
    label = 'Next Week';
  } else if (offset === -1) {
    label = 'Last Week';
  } else if (offset > 1) {
    label = `${offset} Weeks Ahead`;
  } else {
    label = `${Math.abs(offset)} Weeks Ago`;
  }
  
  return { start: startOfWeek, end: endOfWeek, label };
};

export const formatWeekRange = (start: Date, end: Date): string => {
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

export const filterSchedulesByWeek = (
  schedulesData: Schedule[],
  start: Date,
  end: Date
): Schedule[] => {
  return schedulesData.filter(schedule => {
    if (!schedule.date) return false;
    const scheduleDate = new Date(schedule.date);
    return scheduleDate >= start && scheduleDate <= end;
  });
};

export const getDepartment = (classification: string): string => {
  if (MAINTENANCE_CLASSIFICATIONS.includes(classification)) return 'maintenance';
  if (HOUSEKEEPING_CLASSIFICATIONS.includes(classification)) return 'housekeeping';
  return 'other';
};

export const getShiftTime = (shift: string): string => {
  switch(shift) {
    case '7am-3pm': return '07:00-15:00';
    case '3pm-11pm': return '15:00-23:00';
    case '11pm-7am': return '23:00-07:00';
    default: return '07:00-15:00';
  }
};