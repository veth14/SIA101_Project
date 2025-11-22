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
  setDoc,
  runTransaction,
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
  // Optional fields - some schedule documents may store explicit start/end timestamps
  start?: any;
  end?: any;
  startAt?: any;
  endAt?: any;
  startTime?: string;
  endTime?: string;
  shiftStart?: string;
  shiftEnd?: string;
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
  // Use a single counters/tickets document and a transaction to allocate a monotonically
  // increasing ticket number. This avoids reading the tickets collection and prevents
  // reuse of ticket numbers when documents are deleted or archived.
  const counterRef = doc(db, 'counters', 'tickets');

  const newNumber = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    if (!snap.exists()) {
      tx.set(counterRef, { lastTicketNumber: 1 });
      return 1;
    }
    const data = snap.data() as any;
    const last = (data.lastTicketNumber || 0) + 1;
    tx.update(counterRef, { lastTicketNumber: last });
    return last;
  });

  return `TKT${String(newNumber).padStart(6, '0')}`;
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
 * Flexible name matching between attendance.fullName and staff_schedules.staffName
 * Returns true if exact match (case-insensitive) or first+last name tokens match.
 */
function namesMatch(fullNameA: string, fullNameB: string): boolean {
  if (!fullNameA || !fullNameB) return false;
  const a = fullNameA.toString().trim().toLowerCase();
  const b = fullNameB.toString().trim().toLowerCase();
  if (a === b) return true;

  const splitA = a.split(/\s+/).filter(Boolean);
  const splitB = b.split(/\s+/).filter(Boolean);
  if (splitA.length === 0 || splitB.length === 0) return false;

  const firstA = splitA[0];
  const lastA = splitA[splitA.length - 1];
  const firstB = splitB[0];
  const lastB = splitB[splitB.length - 1];

  // Match first and last tokens
  if (firstA === firstB && lastA === lastB) return true;

  // If last names match and first names start with same letter, accept
  if (lastA === lastB && firstA[0] === firstB[0]) return true;

  return false;
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
  console.debug('fetchEligibleStaff: date-filtered query returned size', snapshot.size);

  // If date-scoped query returned nothing, perform a fallback query by classification
  let sourceSnapshot = snapshot;
  if (snapshot.empty) {
    try {
      const fallbackQ = query(
        attendanceRef,
        where('classification', '==', category),
        limit(50)
      );
      const fallbackSnap = await getDocs(fallbackQ);
      console.debug('fetchEligibleStaff: fallback classification-only query returned size', fallbackSnap.size);
      // Log raw fallback docs so we can see field names and shapes
      fallbackSnap.forEach(d => console.debug('fetchEligibleStaff: fallback raw doc', d.id, d.data()));
      sourceSnapshot = fallbackSnap;
    } catch (err) {
      console.error('fetchEligibleStaff: error running fallback query', err);
    }
  }

  const records: AttendanceRecord[] = [];
  sourceSnapshot.forEach(doc => {
    const data = doc.data();
    // Log raw document for diagnosis
    console.debug('fetchEligibleStaff: raw attendance doc', doc.id, data);

    const timeIn = data.TimeIn || data.timeIn || null;
    const timeOut = data.TimeOut || data.timeOut || null;

    records.push({
      id: doc.id,
      fullName: data.fullName,
      classification: data.classification,
      timeIn,
      timeOut,
      date: data.date,
      rfid: data.rfid,
      staffId: data.staffId,
      working: data.working || false,
    });
  });

  // Debug: list fetched attendance records and working flags
  console.debug('fetchEligibleStaff: fetched', records.length, 'attendance records for category', category);
  records.forEach(r => console.debug('attendance record', { id: r.id, fullName: r.fullName, timeIn: r.timeIn && r.timeIn.toDate ? r.timeIn.toDate() : r.timeIn, working: r.working }));

  // Filter out staff currently working, those without a timeIn, and those who already timed out
  const available = records.filter(record => {
    const hasTimeIn = !!record.timeIn;
    const hasTimedOut = !!record.timeOut;
    return !record.working && hasTimeIn && !hasTimedOut;
  });
  console.debug('fetchEligibleStaff: available (not working)', available.map(a => a.fullName));
  return available;
}

/**
 * Validate staff against staff_schedules
 */
async function validateStaffSchedule(
  staffName: string,
  ticketCreationDate: Date,
  ticketDueDate: Date,
  category: string
): Promise<boolean> {
  const schedulesRef = collection(db, 'staff_schedules');

  // Query schedules for the classification and filter client-side by staffName (case-insensitive)
  const q = query(
    schedulesRef,
    where('classification', '==', category),
    limit(50)
  );

  const snapshot = await getDocs(q);

  // Validation should ensure staff has at least one schedule block that covers the full
  // interval from ticketCreationDate to ticketDueDate. If schedule documents contain
  // explicit start/end timestamps, use them. Otherwise fall back to shiftTime + day
  // matching. If no schedule rows exist for this staff, reject by default.

  let foundScheduleForStaff = false;

  // Helper to parse shift time strings into minutes since midnight
  function parseTimeToMinutes(t: string | undefined): number | null {
    if (!t) return null;
    const s = t.toString().trim().toLowerCase();

    // Handle formats like '07:00' or '7:00'
    const hhmm = s.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmm) {
      const h = parseInt(hhmm[1], 10);
      const m = parseInt(hhmm[2], 10);
      return h * 60 + m;
    }

    // Handle formats like '7am' or '7:30pm'
    const ampm = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
    if (ampm) {
      let h = parseInt(ampm[1], 10);
      const m = ampm[2] ? parseInt(ampm[2], 10) : 0;
      const period = ampm[3];
      if (period === 'pm' && h !== 12) h += 12;
      if (period === 'am' && h === 12) h = 0;
      return h * 60 + m;
    }

    // Couldn't parse
    return null;
  }

    // Attempt to validate using schedule documents
    for (const docSnap of snapshot.docs) {
      const schedule = docSnap.data() as any as StaffSchedule;
      const scheduleStaffNameRaw = (schedule.staffName || '').toString().trim();

      if (!namesMatch(scheduleStaffNameRaw, staffName)) continue;

      foundScheduleForStaff = true;

      // If schedule document has explicit start/end fields as Timestamps or ISO strings, prefer them
      const scheduleStartRaw = (schedule.start || schedule.startAt || schedule.startTime || schedule.shiftStart) as any;
      const scheduleEndRaw = (schedule.end || schedule.endAt || schedule.endTime || schedule.shiftEnd) as any;

      if (scheduleStartRaw && scheduleEndRaw) {
        // Parse possible Timestamp objects or ISO strings
        let scheduleStart: Date | null = null;
        let scheduleEnd: Date | null = null;
        try {
          if (scheduleStartRaw.toDate) scheduleStart = scheduleStartRaw.toDate();
          else scheduleStart = new Date(scheduleStartRaw);
        } catch (e) {
          scheduleStart = null;
        }

        try {
          if (scheduleEndRaw.toDate) scheduleEnd = scheduleEndRaw.toDate();
          else scheduleEnd = new Date(scheduleEndRaw);
        } catch (e) {
          scheduleEnd = null;
        }

        if (scheduleStart && scheduleEnd) {
          // Check if schedule block covers the ticket interval
          if (scheduleStart <= ticketCreationDate && scheduleEnd >= ticketDueDate) {
            return true;
          }
          // otherwise continue to next schedule doc
          continue;
        }
      }

      // Fallback: use shiftTime + day fields
      const shiftRaw = (schedule.shiftTime || schedule.shift || '').toString().trim();
      const scheduleDayRaw = (schedule.day || '').toString().trim();

      if (!shiftRaw) {
        // No usable timing information — this schedule cannot prove coverage; continue
        console.debug('validateStaffSchedule: schedule row for', staffName, 'missing shiftTime/start-end; skipping', schedule);
        continue;
      }

      const parts = shiftRaw.split('-').map(p => p.trim()).filter(Boolean);
      if (parts.length === 0) {
        console.debug('validateStaffSchedule: unable to parse shiftTime for', staffName, 'shiftRaw', shiftRaw);
        continue;
      }

      const startMin = parseTimeToMinutes(parts[0]);
      const endMin = parts[1] ? parseTimeToMinutes(parts[1]) : null;
      if (startMin === null || endMin === null) {
        console.debug('validateStaffSchedule: partial/invalid shiftTime parsing for', staffName, { shiftRaw, startMin, endMin });
        continue;
      }

      // Derive minutes for creation and due times
      const creationMinutes = ticketCreationDate.getHours() * 60 + ticketCreationDate.getMinutes();
      const dueMinutes = ticketDueDate.getHours() * 60 + ticketDueDate.getMinutes();

      // If schedule.day is set, ensure the schedule covers the creation->due interval.
      // For normal shifts (start <= end) both creation and due should be on the same schedule day.
      // For overnight shifts (start > end) we interpret schedule.day as the start day and
      // require creation on start day and due on the next day.
      if (scheduleDayRaw) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const creationDay = dayNames[ticketCreationDate.getDay()];
        const dueDay = dayNames[ticketDueDate.getDay()];

        if (startMin <= endMin) {
          // Non-overnight: both creation and due must be on the declared schedule day
          if (creationDay !== scheduleDayRaw || dueDay !== scheduleDayRaw) {
            continue;
          }
        } else {
          // Overnight: scheduleDayRaw is considered the start day. Accept the schedule if either:
          //  - creation is on start day and due is on next day (strict), OR
          //  - both creation and due fall within the overnight time window and the schedule start day
          //    matches the shift start day (which may be the previous calendar day relative to creation time).
          const startDayIndex = dayNames.indexOf(scheduleDayRaw);
          if (startDayIndex === -1) {
            // Unknown schedule day string; skip this schedule row
            continue;
          }
          const nextDay = dayNames[(startDayIndex + 1) % 7];

          if (creationDay === scheduleDayRaw && dueDay === nextDay) {
            // Strict overnight match
          } else {
            // Looser match: allow creation after midnight (creation day may be nextDay) as long as
            // both creation and due minutes fall inside the overnight shift window and the schedule start
            // day corresponds to the shift start (either equal to the day before creation or equal to creation day).
            const creationDayIndex = ticketCreationDate.getDay();
            const creationInWindow = creationMinutes >= startMin || creationMinutes < endMin;
            const dueInWindow = dueMinutes >= startMin || dueMinutes < endMin;
            const startMatchesCreationOrPrev = startDayIndex === creationDayIndex || startDayIndex === ((creationDayIndex + 6) % 7);

            if (!(creationInWindow && dueInWindow && startMatchesCreationOrPrev)) {
              continue;
            }
          }
        }
      }

      // Check that shift start <= creation time AND shift end >= due time.
      // Handle overnight shifts where end <= start by interpreting end as next day.
      if (startMin <= endMin) {
        if (startMin <= creationMinutes && endMin >= dueMinutes) {
          return true;
        }
      } else {
        // Overnight: e.g., 22:00 - 06:00
        // For overnight, a shift covers times >= start OR < end. To ensure it covers both creation and due,
        // both times must fall within that overnight window.
        const creationInWindow = creationMinutes >= startMin || creationMinutes < endMin;
        const dueInWindow = dueMinutes >= startMin || dueMinutes < endMin;
        if (creationInWindow && dueInWindow) return true;
      }
      // otherwise continue to next schedule doc
    }

  // If we found schedule rows but none satisfied the interval check, reject
  if (foundScheduleForStaff) {
    console.debug('validateStaffSchedule: found schedule entries for', staffName, 'but none covered the ticket interval');
    return false;
  }

  // No schedule rows found for staff — reject (require explicit schedule block)
  console.debug('validateStaffSchedule: no schedule entries found for', staffName, '— rejecting assignment');
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
  const now = new Date();
  const eligibleStaff = await fetchEligibleStaff(category, now);
  
  if (eligibleStaff.length === 0) {
    console.warn(`No eligible staff found for category: ${category}`);
    return null;
  }
  
  // Sort by timeIn (FIFO)
  eligibleStaff.sort((a, b) => a.timeIn.toMillis() - b.timeIn.toMillis());
  
  // Get rotation index for this category
  const rotationIndex = getRotationIndex(category);
  
  // Debug: show eligible staff and rotation state
  console.debug('Eligible staff fetched for category', category, eligibleStaff.map(s => ({ id: s.id, fullName: s.fullName, timeIn: s.timeIn && s.timeIn.toDate ? s.timeIn.toDate() : s.timeIn })), 'rotationIndex', rotationIndex);

  // Try to assign starting from rotation index
  for (let i = 0; i < eligibleStaff.length; i++) {
    const staffIndex = (rotationIndex + i) % eligibleStaff.length;
    const staff = eligibleStaff[staffIndex];
  // Validate against staff_schedules using staff full name and the ticket creation/due dates
  const isValid = await validateStaffSchedule(staff.fullName, now, dueDate, category);
  console.debug('Schedule validation for', staff.fullName, { isValid, creation: now, dueDate });

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
    
    // Clear working flag for assigned staff using staff fullName
    if (ticketData.assignedTo) {
      await clearStaffWorkingFlag(ticketData.assignedTo, ticketData.category);
    }
  } catch (error) {
    console.error('Error marking ticket as completed:', error);
    throw error;
  }
}

/**
 * Update ticket details when reporting a complication — do not create a new ticket.
 * Updates description, priority, dueDate and updatedAt.
 */
export async function updateTicketDetails(
  ticketId: string,
  updates: { description?: string; priority?: 'High' | 'Medium' | 'Low'; dueDateTime?: string }
): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets_task', ticketId);
    const ticketSnap = await getDoc(ticketRef);
    if (!ticketSnap.exists()) throw new Error('Ticket not found');

    const updatePayload: any = {
      updatedAt: Timestamp.now(),
    };

    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.priority !== undefined) updatePayload.priority = updates.priority;
    if (updates.dueDateTime) updatePayload.dueDate = Timestamp.fromDate(new Date(updates.dueDateTime));

    await updateDoc(ticketRef, updatePayload);
  } catch (err) {
    console.error('Error updating ticket details:', err);
    throw err;
  }
}

/**
 * Clear working flag for staff in attendance
 */
async function clearStaffWorkingFlag(staffName: string, category: string): Promise<void> {
  try {
    const attendanceRef = collection(db, 'attendance');

    // Find attendance entries for the classification and match by name flexibly (client-side)
    const q = query(
      attendanceRef,
      where('classification', '==', category),
      limit(50)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      for (const d of snapshot.docs) {
        const data = d.data();
        const recordName = (data.fullName || '').toString().trim();
        if (namesMatch(recordName, staffName)) {
          const docRef = doc(db, 'attendance', d.id);
          await updateDoc(docRef, { working: false });
          return;
        }
      }
    }

    console.debug('clearStaffWorkingFlag: no attendance doc found for', staffName, 'category', category);
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

    const data = ticketSnap.data() as any;

    // Only archive the required fields
    const archivedPayload: Record<string, any> = {
      ticketNumber: data.ticketNumber,
      taskTitle: data.taskTitle,
      category: data.category,
      description: data.description,
      roomNumber: data.roomNumber,
      priority: data.priority,
      assignedTo: data.assignedTo,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      completedAt: data.completedAt,
      archivedAt: Timestamp.now(),
    };

    // Use ticketNumber as document ID in archived_tickets so UI can show it as Record ID
    const targetId = String(data.ticketNumber || ticketId);
    const archiveRef = doc(db, 'archived_tickets', targetId);

    // Write archived document and delete original atomically with a batch
    const batch = writeBatch(db);
    batch.set(archiveRef, archivedPayload);
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
