import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  Timestamp,
  writeBatch,
  getDoc,
  QueryConstraint,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

// ==================== TYPES ====================

export type Ticket = {
  id: string;
  taskTitle: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  roomNumber: string;
  assignedTo: string;
  createdAt: Timestamp;
  createdBy: string;
  dueDate: Timestamp;
  status: 'Open' | 'In Progress' | 'Completed';
  isCompleted: boolean;
  ticketNumber: string;
  updatedAt?: Timestamp;
  completedAt?: Timestamp;
};

export type AttendanceRecord = {
  id: string;
  fullName: string;
  classification: string;
  timeIn: Timestamp;
  timeOut?: Timestamp;
  date: Timestamp;
  rfid: string;
  staffId: string;
  working?: boolean; // Flag indicating if staff is currently handling a ticket
};

export type StaffSchedule = {
  id: string;
  staffName: string;
  staffId: string;
  email: string;
  classification: string;
  shift: string;
  shiftTime: string;
  day: string;
  week: string;
  year: number;
  status: string;
  createdAt: Timestamp;
};

type RotationState = {
  [category: string]: number; // Stores rotation index per category
};

// ==================== ROTATION INDEX MANAGEMENT ====================

// In-memory rotation state (consider persisting to Firestore for production)
const rotationIndexes: RotationState = {};

function getRotationIndex(category: string): number {
  return rotationIndexes[category] || 0;
}

function incrementRotationIndex(category: string, maxIndex: number): void {
  rotationIndexes[category] = ((rotationIndexes[category] || 0) + 1) % maxIndex;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate unique ticket number
 */
async function generateTicketNumber(): Promise<string> {
  const ticketsRef = collection(db, 'tickets_task');
  const q = query(ticketsRef, orderBy('createdAt', 'desc'), limit(1));
  const snapshot = await getDocs(q);
  
  let lastNumber = 0;
  if (!snapshot.empty) {
    const lastTicket = snapshot.docs[0].data();
    const match = lastTicket.ticketNumber?.match(/\d+/);
    if (match) {
      lastNumber = parseInt(match[0], 10);
    }
  }
  
  return `TKT${String(lastNumber + 1).padStart(6, '0')}`;
}

/**
 * Check if date/time matches schedule
 */
function isScheduleMatch(
  ticketDueDate: Date,
  scheduleDay: string,
  scheduleShiftTime: string
): boolean {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const ticketDay = dayNames[ticketDueDate.getDay()];
  
  // Check if the schedule day matches the ticket day
  if (scheduleDay !== ticketDay) {
    return false;
  }
  
  // Parse shift time (e.g., "07:00-15:00")
  const [shiftStart, shiftEnd] = scheduleShiftTime.split('-').map(t => t.trim());
  if (!shiftStart || !shiftEnd) return true; // If can't parse, allow it
  
  const ticketHour = ticketDueDate.getHours();
  const [startHour] = shiftStart.split(':').map(Number);
  const [endHour] = shiftEnd.split(':').map(Number);
  
  // Check if ticket time falls within shift time
  return ticketHour >= startHour && ticketHour < endHour;
}

/**
 * Fetch attendance records for current date filtered by category
 */
async function fetchEligibleStaff(
  category: string,
  currentDate: Date
): Promise<AttendanceRecord[]> {
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  const attendanceRef = collection(db, 'attendance');
  const q = query(
    attendanceRef,
    where('date', '>=', Timestamp.fromDate(startOfDay)),
    where('date', '<=', Timestamp.fromDate(endOfDay)),
    where('classification', '==', category),
    orderBy('date'),
    orderBy('timeIn', 'asc')
  );
  
  const snapshot = await getDocs(q);
  const records: AttendanceRecord[] = [];
  
  snapshot.forEach(doc => {
    const data = doc.data();
    records.push({
      id: doc.id,
      fullName: data.fullName,
      classification: data.classification,
      timeIn: data.TimeIn || data.timeIn,
      timeOut: data.TimeOut || data.timeOut,
      date: data.date,
      rfid: data.rfid,
      staffId: data.staffId,
      working: data.working || false,
    });
  });
  
  // Filter out staff currently working
  return records.filter(record => !record.working);
}

/**
 * Validate staff against staff_schedules
 */
async function validateStaffSchedule(
  staffName: string,
  ticketDueDate: Date,
  category: string
): Promise<boolean> {
  const schedulesRef = collection(db, 'staff_schedules');
  const q = query(
    schedulesRef,
    where('staffName', '==', staffName),
    where('classification', '==', category),
    limit(10)
  );
  
  const snapshot = await getDocs(q);
  
  for (const docSnap of snapshot.docs) {
    const schedule = docSnap.data() as StaffSchedule;
    
    // Check if schedule matches the ticket date/time
    if (isScheduleMatch(ticketDueDate, schedule.day, schedule.shiftTime)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Assign staff using FIFO rotation algorithm
 */
async function assignStaffToTicket(
  category: string,
  dueDate: Date
): Promise<string | null> {
  // Fetch eligible staff (present today, matching category, not working)
  const eligibleStaff = await fetchEligibleStaff(category, new Date());
  
  if (eligibleStaff.length === 0) {
    console.warn(`No eligible staff found for category: ${category}`);
    return null;
  }
  
  // Sort by timeIn (FIFO)
  eligibleStaff.sort((a, b) => a.timeIn.toMillis() - b.timeIn.toMillis());
  
  // Get rotation index for this category
  const rotationIndex = getRotationIndex(category);
  
  // Try to assign starting from rotation index
  for (let i = 0; i < eligibleStaff.length; i++) {
    const staffIndex = (rotationIndex + i) % eligibleStaff.length;
    const staff = eligibleStaff[staffIndex];
    
    // Validate against staff_schedules
    const isValid = await validateStaffSchedule(staff.fullName, dueDate, category);
    
    if (isValid) {
      // Mark staff as working
      const attendanceDocRef = doc(db, 'attendance', staff.id);
      await updateDoc(attendanceDocRef, { working: true });
      
      // Increment rotation index for next assignment
      incrementRotationIndex(category, eligibleStaff.length);
      
      return staff.fullName;
    }
  }
  
  console.warn(`No staff with valid schedule found for category: ${category}`);
  return null;
}

// ==================== TICKET OPERATIONS ====================

/**
 * Create a new ticket with automatic staff assignment
 */
export async function createTicket(payload: {
  taskTitle: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  roomNumber: string;
  dueDateTime: string;
  createdBy: string;
}): Promise<Ticket> {
  try {
    // Convert dueDateTime to Timestamp
    const dueDate = new Date(payload.dueDateTime);
    const dueDateTimestamp = Timestamp.fromDate(dueDate);
    
    // Generate ticket number
    const ticketNumber = await generateTicketNumber();
    
    // Assign staff using FIFO algorithm
    const assignedStaff = await assignStaffToTicket(payload.category, dueDate);
    
    if (!assignedStaff) {
      throw new Error(`No available staff found for category: ${payload.category}`);
    }
    
    // Create ticket document
    const ticketData = {
      taskTitle: payload.taskTitle,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      roomNumber: payload.roomNumber,
      assignedTo: assignedStaff,
      createdAt: Timestamp.now(),
      createdBy: payload.createdBy,
      dueDate: dueDateTimestamp,
      status: 'Open' as const,
      isCompleted: false,
      ticketNumber,
      updatedAt: Timestamp.now(),
    };
    
    const ticketsRef = collection(db, 'tickets_task');
    const docRef = await addDoc(ticketsRef, ticketData);
    
    return {
      id: docRef.id,
      ...ticketData,
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

/**
 * Fetch active tickets with pagination
 */
export async function fetchActiveTickets(
  pageSize = 50,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ tickets: Ticket[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  try {
    const ticketsRef = collection(db, 'tickets_task');
    const constraints: QueryConstraint[] = [
      where('isCompleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    ];
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(ticketsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const tickets: Ticket[] = [];
    snapshot.forEach(doc => {
      tickets.push({ id: doc.id, ...doc.data() } as Ticket);
    });
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
    
    return { tickets, lastDoc: lastVisible };
  } catch (error) {
    console.error('Error fetching active tickets:', error);
    return { tickets: [], lastDoc: null };
  }
}

/**
 * Fetch completed tickets with pagination
 */
export async function fetchCompletedTickets(
  pageSize = 50,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ tickets: Ticket[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  try {
    const ticketsRef = collection(db, 'tickets_task');
    const constraints: QueryConstraint[] = [
      where('isCompleted', '==', true),
      orderBy('completedAt', 'desc'),
      limit(pageSize)
    ];
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(ticketsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const tickets: Ticket[] = [];
    snapshot.forEach(doc => {
      tickets.push({ id: doc.id, ...doc.data() } as Ticket);
    });
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
    
    return { tickets, lastDoc: lastVisible };
  } catch (error) {
    console.error('Error fetching completed tickets:', error);
    return { tickets: [], lastDoc: null };
  }
}

/**
 * Subscribe to active tickets (real-time updates)
 */
export function subscribeToActiveTickets(
  callback: (tickets: Ticket[]) => void,
  pageSize = 50
): () => void {
  const ticketsRef = collection(db, 'tickets_task');
  const q = query(
    ticketsRef,
    where('isCompleted', '==', false),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  
  return onSnapshot(q, (snapshot) => {
    const tickets: Ticket[] = [];
    snapshot.forEach(doc => {
      tickets.push({ id: doc.id, ...doc.data() } as Ticket);
    });
    callback(tickets);
  }, (error) => {
    console.error('Error in active tickets subscription:', error);
  });
}

/**
 * Subscribe to completed tickets (real-time updates)
 */
export function subscribeToCompletedTickets(
  callback: (tickets: Ticket[]) => void,
  pageSize = 50
): () => void {
  const ticketsRef = collection(db, 'tickets_task');
  const q = query(
    ticketsRef,
    where('isCompleted', '==', true),
    orderBy('completedAt', 'desc'),
    limit(pageSize)
  );
  
  return onSnapshot(q, (snapshot) => {
    const tickets: Ticket[] = [];
    snapshot.forEach(doc => {
      tickets.push({ id: doc.id, ...doc.data() } as Ticket);
    });
    callback(tickets);
  }, (error) => {
    console.error('Error in completed tickets subscription:', error);
  });
}

/**
 * Mark ticket as completed
 */
export async function markTicketCompleted(ticketId: string): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets_task', ticketId);
    const ticketSnap = await getDoc(ticketRef);
    
    if (!ticketSnap.exists()) {
      throw new Error('Ticket not found');
    }
    
    const ticketData = ticketSnap.data() as Ticket;
    
    // Update ticket
    await updateDoc(ticketRef, {
      status: 'Completed',
      isCompleted: true,
      completedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    // Clear working flag for assigned staff
    if (ticketData.assignedTo) {
      await clearStaffWorkingFlag(ticketData.assignedTo, ticketData.category);
    }
  } catch (error) {
    console.error('Error marking ticket as completed:', error);
    throw error;
  }
}

/**
 * Clear working flag for staff in attendance
 */
async function clearStaffWorkingFlag(staffName: string, category: string): Promise<void> {
  try {
    const attendanceRef = collection(db, 'attendance');
    const q = query(
      attendanceRef,
      where('fullName', '==', staffName),
      where('classification', '==', category),
      where('working', '==', true),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = doc(db, 'attendance', snapshot.docs[0].id);
      await updateDoc(docRef, { working: false });
    }
  } catch (error) {
    console.error('Error clearing staff working flag:', error);
  }
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(
  ticketId: string, 
  status: 'Open' | 'In Progress' | 'Completed'
): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets_task', ticketId);
    await updateDoc(ticketRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
}

/**
 * Archive ticket (move to archive collection)
 */
export async function archiveTicket(ticketId: string): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets_task', ticketId);
    const ticketSnap = await getDoc(ticketRef);
    
    if (!ticketSnap.exists()) {
      throw new Error('Ticket not found');
    }
    
    // Add to archive collection
    const archiveRef = collection(db, 'tickets_archive');
    await addDoc(archiveRef, {
      ...ticketSnap.data(),
      archivedAt: Timestamp.now(),
    });
    
    // Delete from tickets_task
    const batch = writeBatch(db);
    batch.delete(ticketRef);
    await batch.commit();
  } catch (error) {
    console.error('Error archiving ticket:', error);
    throw error;
  }
}

/**
 * Search tickets with filters
 */
export async function searchTickets(filters: {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  isCompleted?: boolean;
}): Promise<Ticket[]> {
  try {
    const ticketsRef = collection(db, 'tickets_task');
    const constraints: QueryConstraint[] = [];
    
    if (filters.isCompleted !== undefined) {
      constraints.push(where('isCompleted', '==', filters.isCompleted));
    }
    
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    
    if (filters.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }
    
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(100));
    
    const q = query(ticketsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let tickets: Ticket[] = [];
    snapshot.forEach(doc => {
      tickets.push({ id: doc.id, ...doc.data() } as Ticket);
    });
    
    // Client-side search filter for title/description
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tickets = tickets.filter(ticket => 
        ticket.taskTitle.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.ticketNumber.toLowerCase().includes(searchLower)
      );
    }
    
    return tickets;
  } catch (error) {
    console.error('Error searching tickets:', error);
    return [];
  }
}
