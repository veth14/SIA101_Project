// ===== TYPES =====
export interface Staff {
  isActive?: boolean;

  id: string
  adminId?: string
  fullName: string
  age: number
  gender: "Male" | "Female"
  classification: "Housekeeping" | "Maintenance"
  email: string
  phoneNumber: string
  rfid?: string
  createdAt: Date
}

export interface StaffFormData {
  adminId: string
  fullName: string
  age: string
  gender: "Male" | "Female"
  classification: "Housekeeping" | "Maintenance"
  email: string
  phoneNumber: string
  rfid: string
}

export interface StaffWithAttendance extends Staff {
  timeIn?: any; // Firebase Timestamp
  timeOut?: any; // Firebase Timestamp
  date?: string;
}
