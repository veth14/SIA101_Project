// types.ts
export interface Staff {
  id: string;
  fullName?: string;
  classification?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  gender?: string;
  rfid?: string;
  adminId?: string;
  createdAt?: any;
}

export interface Schedule {
  id: string;
  staffId: string;
  staffName: string;
  classification: string;
  day: string;
  shift: string;
  shiftTime: string;
  status: string;
  date?: string;
  createdAt?: any;
}

export interface WeeklySchedule {
  [staffId: string]: {
    staffName: string;
    classification: string;
    schedule: {
      [day: string]: {
        shift: string;
        shiftTime: string;
      };
    };
  };
}

export interface Shift {
  value: string;
  label: string;
}

export interface LeaveRequest {
  id: string;       
  staffId: string;
  fullName: string;
  classification: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
}

