// ===== TYPES =====
export interface Staff {
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
