// utils.ts
import { DAYS, MAINTENANCE_CLASSIFICATIONS, HOUSEKEEPING_CLASSIFICATIONS } from './constants';
import { Schedule } from './types';
import { Staff, LeaveRequest } from './types';

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

/**
 * Calculate working days between two dates (excluding weekends)
 */
export const calculateLeaveDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let count = 0;
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
};

/**
 * Calculate leave balance for a staff member
 * Default yearly allocation: 25 days
 */
export const calculateLeaveBalance = (
  staff: Staff,
  allLeaveRequests: LeaveRequest[]
): {
  totalEntitlement: number;
  used: number;
  pending: number;
  remaining: number;
  year: number;
} => {
  const currentYear = new Date().getFullYear();
  const yearlyAllocation = 25; // Default 25 days per year

  // Filter leave requests for this staff and current year
  const staffLeaveRequests = allLeaveRequests.filter(request => {
    if (request.staffId !== staff.id) return false;
    
    const requestYear = new Date(request.startDate).getFullYear();
    return requestYear === currentYear;
  });

  // Calculate used days (approved leaves only)
  const usedDays = staffLeaveRequests
    .filter(request => request.status === 'approved')
    .reduce((total, request) => {
      const days = request.totalDays || calculateLeaveDays(request.startDate, request.endDate);
      return total + days;
    }, 0);

  // Calculate pending days
  const pendingDays = staffLeaveRequests
    .filter(request => request.status === 'pending')
    .reduce((total, request) => {
      const days = request.totalDays || calculateLeaveDays(request.startDate, request.endDate);
      return total + days;
    }, 0);

  // Calculate remaining days
  const remainingDays = yearlyAllocation - usedDays - pendingDays;

  return {
    totalEntitlement: yearlyAllocation,
    used: usedDays,
    pending: pendingDays,
    remaining: Math.max(0, remainingDays), // Ensure it doesn't go negative
    year: currentYear
  };
};

/**
 * Get color class for leave balance display
 */
export const getLeaveBalanceColor = (remaining: number): string => {
  if (remaining <= 0) return 'text-red-600';
  if (remaining <= 5) return 'text-orange-600';
  if (remaining <= 10) return 'text-yellow-600';
  return 'text-green-600';
};

/**
 * Get background color class for leave balance display
 */
export const getLeaveBalanceBackground = (remaining: number): string => {
  if (remaining <= 0) return 'bg-red-50 border-red-200';
  if (remaining <= 5) return 'bg-orange-50 border-orange-200';
  if (remaining <= 10) return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-200';
};

/**
 * Get message for leave balance status
 */
export const getLeaveBalanceMessage = (remaining: number): string => {
  if (remaining <= 0) return 'No leave days remaining';
  if (remaining <= 5) return 'Low leave balance - consider planning carefully';
  if (remaining <= 10) return 'Moderate leave balance available';
  return 'Good leave balance available';
};