// Task type definition for Firebase integration
export interface Task {
  id: string;
  staffName: string;
  roomNumber: string;
  actionNeeded: string;
  classification: "maintenance" | "housekeeping";
}
