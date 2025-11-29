// Using ticketsService for alignment; no direct Firestore ops here
import { createTicket } from '../components/maintenance/tickets-tasks/ticketsService';

export type MaintenanceTicket = {
  id?: string;
  roomId: string;
  bookingId: string;
  type: 'Cleaning' | 'Repair' | 'Inspection';
  status: 'Open' | 'InProgress' | 'Closed';
  priority: 'Low' | 'Normal' | 'High';
  assignedTeam: 'Housekeeping' | 'Maintenance';
  assignedTo?: string;
  assignedToName?: string;
  source: 'Checkout' | 'Manual' | 'Auto';
  createdAt?: unknown;
  createdBy?: string;
  dueAt?: unknown;
};

// Note: auto-assignment now handled by ticketsService.createTicket

export async function createCleaningTicketForCheckout(
  roomId: string,
  bookingId: string,
  createdBy: string
) {
  if (!roomId || !bookingId) return null;
  // Align to maintenance tickets schema by using ticketsService.createTicket
  const title = 'Room Cleaning';
  const description = `Post-checkout cleaning required • Booking ${bookingId}`;
  const dueIso = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const ticket = await createTicket({
    taskTitle: title,
    description,
    category: 'Housekeeping',
    priority: 'Medium',
    roomNumber: String(roomId),
    dueDateTime: dueIso,
    createdBy: createdBy || 'system'
  });
  // Return the created ticket so caller can persist ticketNumber/ticketId back to booking or UI state.
  return ticket;
}
