// Lightweight service layer for archive-related backend operations.
// TODO: Replace the stub implementations below with real API calls (fetch/axios/firebase/etc.).

export type ArchiveRecord = {
  id: string;
  type: string;
  description?: string;
  dateArchived?: string; // ISO or formatted string
};

export type ArchiveStats = {
  totalRecords?: number;
  completedTickets?: number;
  staffRecords?: number;
  equipmentLogs?: number;
};

export type ClockLog = {
  id: string;
  staffMember: string;
  classification: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
  hoursWorked?: number;
  status?: 'On-Duty' | 'Off-Duty' | string;
};

export async function fetchArchiveStats(): Promise<ArchiveStats> {
  // Replace with backend call. Returning empty object so UI can render safely.
  return Promise.resolve({});
}

export async function fetchArchiveRecords(): Promise<ArchiveRecord[]> {
  // Replace with backend call. Return empty list for now.
  return Promise.resolve([]);
}

export async function fetchClockLogs(): Promise<ClockLog[]> {
  // Replace with backend call. Return empty list for now.
  return Promise.resolve([]);
}

export async function deleteArchiveRecord(id: string): Promise<void> {
  // Replace with backend call to delete the archive record by id.
  // Example: await api.delete(`/archive/${id}`)
  return Promise.resolve();
}

export async function downloadArchiveRecord(id: string): Promise<void> {
  // Replace with logic that returns a file/blob or download URL for the record.
  // Example: const blob = await api.get(`/archive/${id}/download`)
  return Promise.resolve();
}
