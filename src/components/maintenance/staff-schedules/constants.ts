// constants.ts
import { Shift } from 'types';

export const SHIFTS: Shift[] = [
  { value: '7am-3pm', label: '7:00 AM - 3:00 PM' },
  { value: '3pm-11pm', label: '3:00 PM - 11:00 PM' },
  { value: '11pm-7am', label: '11:00 PM - 7:00 AM' },
];

export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const MAINTENANCE_CLASSIFICATIONS = [
  'HVAC Technician',
  'Electrician',
  'Plumber',
  'General Maintenance',
  'Carpenter',
  'Painter'
];

export const HOUSEKEEPING_CLASSIFICATIONS = [
  'Housekeeper',
  'Room Attendant',
  'Laundry Attendant',
  'Housekeeping Supervisor',
  'Public Area Attendant'
];