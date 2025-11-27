// Lightweight service layer for archive-related backend operations.
// TODO: Replace the stub implementations below with real API calls (fetch/axios/firebase/etc.).

import { db } from '../../../config/firebase';
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  limit as queryLimit,
  orderBy,
  startAfter,
  onSnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { jsPDF } from 'jspdf';

export type ArchiveRecord = {
  id: string;
  type: string;
  title?: string;
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
  date: string; // formatted for UI
  timeIn?: string;
  timeOut?: string;
  hoursWorked?: number;
  status?: 'On-Duty' | 'Off-Duty' | string;
  staffId?: string;
  // raw Date objects preserved for computations
  timeInRaw?: Date | null;
  timeOutRaw?: Date | null;
};

// IMPORTANT: minimize Firestore reads by using listeners, pagination, and caching.
// This module implements a small listener manager for the `attendance` collection.

const ATTENDANCE_COLLECTION = 'attendance';
const CACHE_KEY = 'attendance_clock_logs_cache_v1';

function formatDate(value: any): string {
  // Return a locale date string (no time). Handles Firestore Timestamp, Date, or string.
  try {
    if (!value) return '';
    const d = parseFirestoreDate(value);
    if (d) return d.toLocaleDateString();
    return String(value).split('T')[0];
  } catch (e) {
    return String(value);
  }
}

function formatTime(value: any): string {
  // Return a locale time string (no date). Handles Firestore Timestamp, Date, or string.
  try {
    if (!value) return '';
    const d = parseFirestoreDate(value);
    if (d) return d.toLocaleTimeString();
    // fallback: try to pick a time portion from string
    const s = String(value);
    const t = s.split('T')[1];
    return t ? t.split('Z')[0] : s;
  } catch (e) {
    return String(value);
  }
}

/**
 * Parse a Firestore-like value into a Date if possible.
 * Supports Firestore Timestamp objects (toDate()), numbers (ms), Date, and common string forms.
 */
function parseFirestoreDate(value: any): Date | null {
  if (value == null) return null;
  // Firestore Timestamp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof value === 'object' && typeof (value as any).toDate === 'function') {
    try {
      return (value as any).toDate();
    } catch (e) {
      return null;
    }
  }
  if (value instanceof Date) return value;
  if (typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    // Some values may look like: "22 November 2025 at 15:00:00 UTC+8"
    // Normalize by removing ' at ' and 'UTC±' timezone tokens which Date.parse may not like.
    let s = value.trim();
    // Replace ' at ' with space
    s = s.replace(/\s+at\s+/i, ' ');
    // Remove 'UTC+8' or 'UTC-8' tokens (we'll let the local timezone apply)
    s = s.replace(/UTC[+\-]\d+/i, '').trim();
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    // Last resort: try Date.parse directly
    const t = Date.parse(value);
    if (!isNaN(t)) return new Date(t);
    return null;
  }
  return null;
}

/**
 * Recursively convert Firestore Timestamp values into human-readable strings.
 * Supports:
 * - Firestore Timestamp objects (have toDate())
 * - Plain objects with { seconds, nanoseconds }
 * - Arrays and nested objects
 */
function normalizeFirestoreData(value: any): any {
  if (value == null) return value;

  // Firestore Timestamp instance (has toDate)
  if (typeof value === 'object' && typeof (value as any).toDate === 'function') {
    try {
      const d = (value as any).toDate();
      return d instanceof Date && !isNaN(d.getTime()) ? d.toLocaleString() : String(value);
    } catch (e) {
      return String(value);
    }
  }

  // Plain object that resembles a Firestore Timestamp: { seconds: number, nanoseconds: number }
  if (typeof value === 'object' && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
    const ms = (value.seconds * 1000) + Math.round((value.nanoseconds || 0) / 1e6);
    const d = new Date(ms);
    return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  }

  // Arrays: normalize each element
  if (Array.isArray(value)) {
    return value.map((v) => normalizeFirestoreData(v));
  }

  // Plain object: recurse into properties
  if (typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const k of Object.keys(value)) {
      try {
        out[k] = normalizeFirestoreData((value as Record<string, any>)[k]);
      } catch (e) {
        out[k] = String((value as Record<string, any>)[k]);
      }
    }
    return out;
  }

  // Dates
  if (value instanceof Date) return value.toLocaleString();

  // Primitives: leave as-is
  return value;
}

function sameDate(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function mapAttendanceDoc(docSnap: QueryDocumentSnapshot): ClockLog {
  const d = docSnap.data() as Record<string, any>;
  // Prefer TimeIn's date portion as authoritative for the shift date. Fall back to explicit date fields.
  const rawTimeIn = d.TimeIn ?? d.timeIn ?? d.time_in ?? d.timeInRaw ?? null;
  const rawTimeOut = d.timeOut ?? d.TimeOut ?? d.time_out ?? d.timeOutRaw ?? null;
  const explicitDate = d.date ?? d.Date ?? d.dateCreated ?? d.createdAt ?? null;

  const parsedTimeIn = parseFirestoreDate(rawTimeIn) ?? parseFirestoreDate(explicitDate) ?? parseFirestoreDate(rawTimeOut);
  const parsedTimeOut = parseFirestoreDate(rawTimeOut);

  const today = new Date();
  let status: ClockLog['status'] = 'Off-Duty';

  // Determine status more robustly:
  // - If both timeIn and timeOut exist -> Off-Duty (completed shift)
  // - If timeIn exists but no timeOut -> consider On-Duty only if the shift is recent (within 12 hours)
  //   otherwise mark Off-Duty (no salary). This prevents extremely old open shifts from showing On-Duty.
  // - Otherwise fall back to explicit status field or Off-Duty.
  const now = new Date();
  const MAX_ON_DUTY_MS = 12 * 60 * 60 * 1000; // 12 hours

  if (parsedTimeIn && parsedTimeOut) {
    status = 'Off-Duty';
  } else if (parsedTimeIn && !parsedTimeOut) {
    const since = now.getTime() - parsedTimeIn.getTime();
    if (since >= 0 && since <= MAX_ON_DUTY_MS) {
      status = 'On-Duty';
    } else {
      // Shift started long ago and still no timeOut -> treat as Off-Duty and do not grant salary
      status = 'Off-Duty';
    }
  } else {
    status = d.status ?? 'Off-Duty';
  }

  return {
    id: docSnap.id,
    staffMember: d.fullName ?? d.staffName ?? d.name ?? '',
    classification: d.classification ?? d.department ?? '',
    date: parsedTimeIn ? parsedTimeIn.toLocaleDateString() : formatDate(explicitDate),
    timeIn: parsedTimeIn ? parsedTimeIn.toLocaleTimeString() : formatTime(rawTimeIn),
    timeOut: parsedTimeOut ? parsedTimeOut.toLocaleTimeString() : formatTime(rawTimeOut),
    hoursWorked: typeof d.hoursWorked === 'number' ? d.hoursWorked : (parsedTimeIn && parsedTimeOut ? Math.round(((parsedTimeOut.getTime() - parsedTimeIn.getTime()) / (1000*60*60)) * 100) / 100 : undefined),
    status,
    staffId: d.staffId ?? d.staff_id ?? d.staff ?? undefined,
    timeInRaw: parsedTimeIn,
    timeOutRaw: parsedTimeOut,
  };
}

// ------ Listener manager (singleton within module) ------
type ClockLogsDelta = { added?: ClockLog[]; modified?: ClockLog[]; removed?: string[] };

const clockLogsManager = {
  subscribers: new Set<(delta: ClockLogsDelta, full?: ClockLog[]) => void>(),
  unsubscribe: null as null | (() => void),
  cached: [] as ClockLog[],
};

/**
 * Subscribe to live updates for recent clock logs.
 * - Uses onSnapshot and keeps a single listener across multiple subscribers to avoid re-reads.
 * - Caches the latest page in sessionStorage so re-mounts can show immediately.
 *
 * Returns an unsubscribe function that removes this subscriber; when no subscribers remain, the
 * Firestore listener is detached.
 */
export function subscribeClockLogs(
  cb: (delta: ClockLogsDelta, full?: ClockLog[]) => void,
  options?: { limit?: number }
): () => void {
  const limitCount = options?.limit ?? 50;

  // Add subscriber
  clockLogsManager.subscribers.add(cb);

  // If we already have cached data, immediately notify the new subscriber with the full set
  if (clockLogsManager.cached.length > 0) {
    // send full data as added set
    cb({ added: clockLogsManager.cached }, clockLogsManager.cached.slice());
  } else {
    // attempt to hydrate from sessionStorage
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ClockLog[];
        clockLogsManager.cached = parsed;
        if (parsed.length) cb({ added: parsed }, parsed.slice());
      }
    } catch (e) {
      // ignore cache errors
    }
  }

  // If listener already active, done — the snapshot handler will call our cb on updates.
  if (clockLogsManager.unsubscribe) {
    return () => {
      clockLogsManager.subscribers.delete(cb);
      if (clockLogsManager.subscribers.size === 0 && clockLogsManager.unsubscribe) {
        clockLogsManager.unsubscribe();
        clockLogsManager.unsubscribe = null;
      }
    };
  }

  // Create a single onSnapshot listener for the recent logs page
  const q = query(collection(db, ATTENDANCE_COLLECTION), orderBy('date', 'desc'), queryLimit(limitCount));
  const unsub = onSnapshot(q, (snapshot) => {
    const added: ClockLog[] = [];
    const modified: ClockLog[] = [];
    const removed: string[] = [];

    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') added.push(mapAttendanceDoc(change.doc));
      if (change.type === 'modified') modified.push(mapAttendanceDoc(change.doc));
      if (change.type === 'removed') removed.push(change.doc.id);
    });

    // update cached with snapshot top page
    let full = snapshot.docs.map(mapAttendanceDoc);

    // Ensure logs are ordered so latest (most recent) entries appear first (top of UI).
    // Use timeInRaw or timeOutRaw as canonical timestamp, fall back to Date parsed from `date` string.
    const getLogTimeMs = (l: ClockLog) => {
      if (l.timeInRaw) return l.timeInRaw.getTime();
      if (l.timeOutRaw) return l.timeOutRaw.getTime();
      const parsed = parseFirestoreDate(l.date);
      if (parsed) return parsed.getTime();
      return 0;
    };

    full.sort((a, b) => {
      return getLogTimeMs(b) - getLogTimeMs(a);
    });

    // NOTE: base-salary running totals have been removed from the live clock logs payload.

    clockLogsManager.cached = full;

    // update sessionStorage cache quickly
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(full));
    } catch (e) {
      // ignore quota errors
    }

    // notify all subscribers with the delta and full set
    clockLogsManager.subscribers.forEach((s) => {
      try {
        s({ added, modified, removed }, full.slice());
      } catch (e) {
        // swallow handler errors per-subscriber
      }
    });
  });

  clockLogsManager.unsubscribe = () => unsub();

  // return unsubscribe for this subscriber
  return () => {
    clockLogsManager.subscribers.delete(cb);
    if (clockLogsManager.subscribers.size === 0 && clockLogsManager.unsubscribe) {
      clockLogsManager.unsubscribe();
      clockLogsManager.unsubscribe = null;
    }
  };
}

/**
 * Paginated read for clock logs. Use for 'load more' functionality.
 * - Avoids full collection scan by using a limit and a startAfter cursor (doc id).
 * - Returns mapped logs and the lastDocId (use to request next page).
 */
export async function fetchClockLogsPage(opts?: { limit?: number; startAfterId?: string }): Promise<{ logs: ClockLog[]; lastDocId?: string }> {
  const limitCount = opts?.limit ?? 50;
  try {
    let q;
    if (opts?.startAfterId) {
      // one read to obtain the doc snapshot used as cursor
      const cursorDoc = await getDoc(doc(db, ATTENDANCE_COLLECTION, opts.startAfterId));
      if (!cursorDoc.exists()) {
        q = query(collection(db, ATTENDANCE_COLLECTION), orderBy('date', 'desc'), queryLimit(limitCount));
      } else {
        q = query(collection(db, ATTENDANCE_COLLECTION), orderBy('date', 'desc'), startAfter(cursorDoc as DocumentSnapshot), queryLimit(limitCount));
      }
    } else {
      q = query(collection(db, ATTENDANCE_COLLECTION), orderBy('date', 'desc'), queryLimit(limitCount));
    }

    const snap = await getDocs(q);
    const logs = snap.docs.map(mapAttendanceDoc);

    // Ensure paginated results are also returned with newest first (latest on top)
    const getLogTimeMs = (l: ClockLog) => {
      if (l.timeInRaw) return l.timeInRaw.getTime();
      if (l.timeOutRaw) return l.timeOutRaw.getTime();
      const parsed = parseFirestoreDate(l.date);
      if (parsed) return parsed.getTime();
      return 0;
    };
    logs.sort((a, b) => getLogTimeMs(b) - getLogTimeMs(a));
    const last = snap.docs[snap.docs.length - 1];
    return { logs, lastDocId: last ? last.id : undefined };
  } catch (err) {
    // Let caller handle errors; return empty list on failure to avoid crashing UI
    console.error('fetchClockLogsPage error', err);
    return { logs: [] };
  }
}

// -------------------- Salary computation utilities --------------------

export type SalaryShift = {
  shiftDate: Date | null;
  timeIn?: Date | null;
  timeOut?: Date | null;
  hoursWorked: number; // decimal hours
  expectedSalary: number; // 597 if completed shift, otherwise 0
  baseSalary: number; // running total per payout period
  cutoff: 'A' | 'B';
  payoutSaturday: Date;
};

function toDateOrNull(value: any): Date | null {
  if (!value) return null;
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    try {
      return value.toDate();
    } catch (e) {
      return null;
    }
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function hoursBetween(start?: Date | null, end?: Date | null): number {
  if (!start || !end) return 0;
  const ms = end.getTime() - start.getTime();
  if (ms <= 0) return 0;
  return Math.round((ms / (1000 * 60 * 60)) * 100) / 100; // round to 2 decimals
}

function firstSaturdayOnOrAfter(d: Date): Date {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = t.getDay(); // 0 Sunday .. 6 Saturday
  const delta = (6 - day + 7) % 7; // days to add to reach Saturday on or after
  t.setDate(t.getDate() + delta);
  t.setHours(0, 0, 0, 0);
  return t;
}

/**
 * Compute running baseSalary for an array of ClockLog entries.
 * Groups by staffId and iterates chronologically to apply cutoff/payout rules.
 */
// computeBaseSalaryForClockLogs removed: the live clock log payload no longer includes a running
// baseSalary total. Payroll-specific computations should use computeSalaryShiftsForEmployee
// or a dedicated payroll worker instead of embedding running totals into the logs stream.

/**
 * Fetch attendance for a staffId and compute per-shift salary info in-memory.
 * - Does not write anything to Firestore.
 */
export async function computeSalaryShiftsForEmployee(
  staffId: string,
  opts?: { startDate?: Date; endDate?: Date }
): Promise<SalaryShift[]> {
  try {
    const attendanceRef = collection(db, 'attendance');
    const constraints: any[] = [where('staffId', '==', staffId)];
    // If start/end are provided we filter by date range (date field expected to be a Timestamp)
    if (opts?.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(opts.startDate)));
    }
    if (opts?.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(opts.endDate)));
    }

    // Order by timeIn ascending so shifts are chronological
    const q = query(attendanceRef, ...constraints, orderBy('timeIn', 'asc'));
    const snap = await getDocs(q);
    const docs = snap.docs.map(d => ({ id: d.id, data: d.data() }));

    // Map to normalized shift objects sorted by timeIn
    const shifts = docs.map((d) => {
      const raw = d.data as any;
      const timeIn = toDateOrNull(raw.timeIn ?? raw.TimeIn ?? raw.time_in);
      const timeOut = toDateOrNull(raw.timeOut ?? raw.TimeOut ?? raw.time_out);
      const shiftDate = timeIn ?? toDateOrNull(raw.date) ?? null;
      return { shiftDate, timeIn, timeOut };
    }).sort((a, b) => {
      const at = a.timeIn ? a.timeIn.getTime() : (a.shiftDate ? a.shiftDate.getTime() : 0);
      const bt = b.timeIn ? b.timeIn.getTime() : (b.shiftDate ? b.shiftDate.getTime() : 0);
      return at - bt;
    });

    const RESULT: SalaryShift[] = [];
    let currentPayoutKey: string | null = null; // stringified payoutSaturday timestamp
    let accumulator = 0;

    for (const s of shifts) {
      const sd = s.shiftDate;
      // default to today if no shift date found (shouldn't happen often)
      const refDate = sd ? new Date(sd) : new Date();

      // Decide cutoff A or B based on day of month
      const dayOfMonth = refDate.getDate();
      const cutoff: 'A' | 'B' = dayOfMonth <= 15 ? 'A' : 'B';

      // Determine payout Saturday date for this shift
      let cutoffAnchor: Date;
      if (cutoff === 'A') {
        // 15th of same month
        cutoffAnchor = new Date(refDate.getFullYear(), refDate.getMonth(), 15);
      } else {
        // last day of month
        cutoffAnchor = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0); // day 0 = last day previous month
      }
      const payoutSaturday = firstSaturdayOnOrAfter(cutoffAnchor);

      // Use payoutSaturday timestamp as grouping key
      const payoutKey = String(payoutSaturday.getTime());

      // If payoutKey changed (new cutoff period), reset accumulator
      if (currentPayoutKey === null) {
        currentPayoutKey = payoutKey;
        accumulator = 0;
      } else if (payoutKey !== currentPayoutKey) {
        // We started seeing a different payoutSaturday -> reset accumulator for the new period
        currentPayoutKey = payoutKey;
        accumulator = 0;
      }

  const hours = hoursBetween(s.timeIn, s.timeOut);
  // Only count completed shifts of at least 1 hour as eligible for base salary
  const expectedSalary = (s.timeOut && hours >= 1) ? 597 : 0;

      // If this shift is completed (timeOut present) add to accumulator
      if (expectedSalary > 0) {
        accumulator += expectedSalary;
      }

      RESULT.push({
        shiftDate: sd,
        timeIn: s.timeIn ?? null,
        timeOut: s.timeOut ?? null,
        hoursWorked: hours,
        expectedSalary,
        baseSalary: accumulator,
        cutoff,
        payoutSaturday,
      });
    }

    return RESULT;
  } catch (err) {
    console.error('computeSalaryShiftsForEmployee error', err);
    return [];
  }
}

/**
 * Clear cached clock logs (sessionStorage + in-memory)
 */
export function clearClockLogsCache() {
  clockLogsManager.cached = [];
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch (e) {
    // ignore
  }
}

// --- Lightweight placeholder implementations for archive records / stats ---
// These are intentionally minimal: implement your backend endpoints or collection names
// here to avoid scans. For now they return empty data so UI can render safely.
export async function fetchArchiveStats(): Promise<ArchiveStats> {
  try {
    // Simple counts for archived_tickets — for larger collections prefer aggregation queries
    const archivedRef = collection(db, 'archived_tickets');
    const snap = await getDocs(query(archivedRef, orderBy('archivedAt', 'desc'), queryLimit(1)));
    const total = snap.size; // Note: this is only the page size; in absence of count() aggregation we return page size as approximation

    // Attempt to get total by fetching up to 1000 documents (keep lightweight)
    const allSnap = await getDocs(query(archivedRef, orderBy('archivedAt', 'desc'), queryLimit(1000)));

    return {
      totalRecords: allSnap.size,
      completedTickets: allSnap.size,
    };
  } catch (err) {
    console.error('fetchArchiveStats error', err);
    return {};
  }
}

export async function fetchArchiveRecords(): Promise<ArchiveRecord[]> {
  try {
    // Keep a lightweight page-by-page fetch (avoid full collection scans). This function
    // returns up to 200 recent archive records sorted by archivedAt desc. For live updates
    // prefer subscribeArchivedRecords below which uses onSnapshot and delta updates.
    const archivedRef = collection(db, 'archived_tickets');
    const q = query(archivedRef, orderBy('archivedAt', 'desc'), queryLimit(200));
    const snap = await getDocs(q);
    const records: ArchiveRecord[] = [];
    snap.forEach(d => {
      const data = d.data() as any;
      records.push({
        id: d.id,
        type: 'Completed Ticket',
        title: data.taskTitle ?? data.title ?? '',
        description: data.description ?? data.taskTitle ?? '',
        dateArchived: data.archivedAt ? (data.archivedAt as Timestamp).toDate().toLocaleString() : '',
      });
    });
    return records;
  } catch (err) {
    console.error('fetchArchiveRecords error', err);
    return [];
  }
}

const ARCHIVE_CACHE_KEY = 'archived_tickets_cache_v1';

type ArchiveDelta = { added?: ArchiveRecord[]; modified?: ArchiveRecord[]; removed?: string[] };

const archivedManager = {
  subscribers: new Set<(delta: ArchiveDelta, full?: ArchiveRecord[]) => void>(),
  unsubscribe: null as null | (() => void),
  cached: [] as ArchiveRecord[],
};

/**
 * Subscribe to archived_tickets collection with a single onSnapshot listener shared across
 * subscribers. Returns an unsubscribe function for the caller.
 */
export function subscribeArchivedRecords(
  cb: (delta: ArchiveDelta, full?: ArchiveRecord[]) => void,
  options?: { limit?: number }
): () => void {
  const limitCount = options?.limit ?? 200;

  archivedManager.subscribers.add(cb);

  // hydrate from memory or sessionStorage
  if (archivedManager.cached.length > 0) {
    cb({ added: archivedManager.cached }, archivedManager.cached.slice());
  } else {
    try {
      const raw = sessionStorage.getItem(ARCHIVE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ArchiveRecord[];
        archivedManager.cached = parsed;
        if (parsed.length) cb({ added: parsed }, parsed.slice());
      }
    } catch (e) {
      // ignore
    }
  }

  if (archivedManager.unsubscribe) {
    return () => {
      archivedManager.subscribers.delete(cb);
      if (archivedManager.subscribers.size === 0 && archivedManager.unsubscribe) {
        archivedManager.unsubscribe();
        archivedManager.unsubscribe = null;
      }
    };
  }

  const q = query(collection(db, 'archived_tickets'), orderBy('archivedAt', 'desc'), queryLimit(limitCount));
  const unsub = onSnapshot(q, (snapshot) => {
    const added: ArchiveRecord[] = [];
    const modified: ArchiveRecord[] = [];
    const removed: string[] = [];

    snapshot.docChanges().forEach((change) => {
      const d = change.doc.data() as any;
      const rec: ArchiveRecord = {
        id: change.doc.id,
        type: 'Completed Ticket',
        title: d.taskTitle ?? d.title ?? '',
        description: d.description ?? d.taskTitle ?? '',
        dateArchived: d.archivedAt ? (d.archivedAt as Timestamp).toDate().toLocaleString() : '',
      };
      if (change.type === 'added') added.push(rec);
      if (change.type === 'modified') modified.push(rec);
      if (change.type === 'removed') removed.push(change.doc.id);
    });

    const full = snapshot.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        type: 'Completed Ticket',
        title: data.taskTitle ?? data.title ?? '',
        description: data.description ?? data.taskTitle ?? '',
        dateArchived: data.archivedAt ? (data.archivedAt as Timestamp).toDate().toLocaleString() : '',
      } as ArchiveRecord;
    });

    archivedManager.cached = full;
    try { sessionStorage.setItem(ARCHIVE_CACHE_KEY, JSON.stringify(full)); } catch (e) { /* ignore */ }

    archivedManager.subscribers.forEach((s) => {
      try { s({ added, modified, removed }, full.slice()); } catch (e) { /* swallow */ }
    });
  });

  archivedManager.unsubscribe = () => unsub();

  return () => {
    archivedManager.subscribers.delete(cb);
    if (archivedManager.subscribers.size === 0 && archivedManager.unsubscribe) {
      archivedManager.unsubscribe();
      archivedManager.unsubscribe = null;
    }
  };
}

/**
 * Fetch a single archived ticket document by id and return its full data object (raw fields).
 */
export async function fetchArchiveRecordById(id: string): Promise<Record<string, any> | null> {
  try {
    const d = await getDoc(doc(db, 'archived_tickets', id));
    if (!d.exists()) return null;
    // Normalize any Timestamp fields to human-readable strings before returning
    const raw = d.data() as Record<string, any>;
    return normalizeFirestoreData(raw) as Record<string, any>;
  } catch (err) {
    console.error('fetchArchiveRecordById error', err);
    return null;
  }
}

/**
 * Generate a PDF for the archived ticket with `id` and trigger a client download named ticket_<id>.pdf.
 */
export async function downloadArchiveRecord(id: string, collectionName = 'archived_tickets'): Promise<void> {
  try {
    const d = await getDoc(doc(db, collectionName, id));
    if (!d.exists()) return;
  const data = d.data() as Record<string, any>;
  const normalized = normalizeFirestoreData(data) as Record<string, any>;
    // Create PDF using jsPDF and craft a ticket-like layout similar to the provided image.
    const docPdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = docPdf.internal.pageSize.getWidth();
    const margin = 40;
    let y = 36;

    // Helper: load logo from public folder as data URL
    async function loadImageDataUrl(path: string): Promise<string | null> {
      try {
        const res = await fetch(path);
        if (!res.ok) return null;
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        return null;
      }
    }

    // Draw soft rounded card background with subtle shadow
    const pageHeight = docPdf.internal.pageSize.getHeight();
    try {
      // subtle shadow
      (docPdf as any).setFillColor(220, 220, 220);
      (docPdf as any).roundedRect(24, 24, pageWidth - 48, pageHeight - 48, 8, 8, 'F');
      // main card
      (docPdf as any).setFillColor(249, 246, 238); // #F9F6EE
      (docPdf as any).roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 8, 8, 'F');
    } catch (e) {
      // fallback to plain rects if roundedRect not available
      docPdf.setFillColor(249, 246, 238);
      docPdf.rect(20, 20, pageWidth - 40, pageHeight - 40, 'F');
    }

    // Header: logo left, title center-left
    const logoPath = '/BalayGinhawa/balaylogopng.png';
    const logoData = await loadImageDataUrl(logoPath);
    if (logoData) {
      const mime = typeof logoData === 'string' ? logoData.split(',')[0].split(':')[1] : '';
      const imgType = mime && mime.indexOf('jpeg') !== -1 ? 'JPEG' : 'PNG';
      const logoW = 64;
      const logoH = 64;
      try {
        docPdf.addImage(logoData, imgType as any, margin, y, logoW, logoH);
      } catch (err) {
        // fallback: try PNG
        try { docPdf.addImage(logoData, 'PNG' as any, margin, y, logoW, logoH); } catch (e) { /* ignore */ }
      }
    }

  // Title (Helvetica, bold)
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(22);
  docPdf.setTextColor(22, 128, 73); // heritage green-ish
  docPdf.text(normalized.ticketNumber ?? `Ticket ${id}`, margin + 80, y + 20);

    // Subtitle details (type, room, small badges)
  docPdf.setFont('helvetica', 'normal');
  docPdf.setFontSize(10);
  docPdf.setTextColor(80, 80, 80);
  const subtitleX = margin + 80;
  docPdf.text(`${normalized.type ?? normalized.category ?? ''}`.trim(), subtitleX, y + 36);

    // Right aligned badges (Archived/High) small rounded boxes
    const badge1 = 'Archived';
    const badge2 = normalized.priority ?? 'High';
    docPdf.setFontSize(9);
    const badgeW = 72;
    const badgeH = 20;
    const rightX = pageWidth - margin - badgeW;
    // Rounded badges
    try {
      (docPdf as any).setFillColor(245, 235, 210);
      (docPdf as any).roundedRect(rightX, y, badgeW, badgeH, 6, 6, 'F');
      docPdf.setTextColor(120, 80, 40);
      docPdf.text(badge1, rightX + 8, y + 13);

      (docPdf as any).setFillColor(255, 235, 238);
      (docPdf as any).roundedRect(rightX, y + 26, badgeW, badgeH, 6, 6, 'F');
      docPdf.setTextColor(160, 40, 40);
      docPdf.text(badge2, rightX + 8, y + 39);
    } catch (e) {
      docPdf.setFillColor(245, 235, 210);
      docPdf.rect(rightX, y, badgeW, badgeH, 'F');
      docPdf.setTextColor(120, 80, 40);
      docPdf.text(badge1, rightX + 8, y + 13);
      docPdf.setFillColor(255, 235, 238);
      docPdf.rect(rightX, y + 26, badgeW, badgeH, 'F');
      docPdf.setTextColor(160, 40, 40);
      docPdf.text(badge2, rightX + 8, y + 39);
    }

    y += 80;

    // Description section
    docPdf.setFontSize(12);
    docPdf.setTextColor(34, 34, 34);
    docPdf.text('Description:', margin, y);
    y += 14;
    const descBoxHeight = 64;
    try {
      (docPdf as any).setFillColor(255, 255, 255);
      (docPdf as any).roundedRect(margin, y, pageWidth - margin * 2, descBoxHeight, 6, 6, 'F');
      docPdf.setDrawColor(230, 230, 230);
      (docPdf as any).roundedRect(margin + 0.5, y + 0.5, pageWidth - margin * 2 - 1, descBoxHeight - 1, 6, 6, 'S');
    } catch (e) {
      docPdf.setFillColor(255, 255, 255);
      docPdf.rect(margin, y, pageWidth - margin * 2, descBoxHeight, 'F');
      docPdf.setDrawColor(230, 230, 230);
      docPdf.rect(margin, y, pageWidth - margin * 2, descBoxHeight);
    }
    const descText = normalized.taskTitle ?? normalized.description ?? '';
    docPdf.setFontSize(11);
    const descLines = docPdf.splitTextToSize(String(descText), pageWidth - margin * 2 - 12);
    docPdf.setTextColor(50, 50, 50);
    docPdf.text(descLines, margin + 6, y + 16);
    y += descBoxHeight + 16;

    // Top detail row (Assigned to / Created / Completed)
    const col1x = margin;
    const col2x = margin + (pageWidth - margin * 2) / 3;
    const col3x = margin + 2 * (pageWidth - margin * 2) / 3;
    docPdf.setFontSize(10);
    docPdf.setTextColor(100, 100, 100);
    docPdf.text('Assigned to', col1x, y);
    docPdf.text('Created', col2x, y);
    docPdf.text('Completed', col3x, y);
    y += 14;
    docPdf.setFontSize(11);
    docPdf.setTextColor(20, 20, 20);
  docPdf.text(String(normalized.assignedTo ?? normalized.assignee ?? normalized.assigned ?? ''), col1x, y);
  // created - prefer createdAt, createdOn, dateCreated, dateArchived
  const createdVal = normalized.createdAt ?? normalized.createdOn ?? normalized.dateCreated ?? normalized.dateArchived ?? normalized.created ?? '';
  docPdf.text(String(createdVal), col2x, y);
  // completed: prefer completedAt/date or status
  const completedVal = normalized.completedAt ?? normalized.completed ?? (typeof normalized.status === 'string' && normalized.status.toLowerCase().includes('complete') ? normalized.status : '') ;
  docPdf.text(String(completedVal), col3x, y);
    y += 24;

    // Divider
    docPdf.setDrawColor(230, 230, 230);
    docPdf.line(margin, y, pageWidth - margin, y);
    y += 12;

    // Bottom fields table: Ticket, Task, Created by (two columns)
    const leftCol = margin;
    const rightCol = pageWidth / 2 + 10;
    const rows = [
      ['Ticket', normalized.ticketNumber ?? id],
      ['Task', normalized.taskTitle ?? normalized.task ?? ''],
      ['Created by', normalized.createdBy ?? normalized.creatorEmail ?? normalized.creator ?? ''],
    ];

    for (const [label, val] of rows) {
      docPdf.setFontSize(10);
      docPdf.setTextColor(100, 100, 100);
      docPdf.text(label, leftCol, y);
      docPdf.setFontSize(11);
      docPdf.setTextColor(20, 20, 20);
      docPdf.text(String(val ?? ''), rightCol, y);
      y += 18;
    }

    const filename = `ticket_${id}.pdf`;
    docPdf.save(filename);
  } catch (err) {
    console.error('downloadArchiveRecord error', err);
    throw err;
  }
}

export async function deleteArchiveRecord(id: string, collectionName = 'archived_tickets'): Promise<void> {
  // Deletes a document from a specified collection. Use with care.
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    console.error('deleteArchiveRecord error', err);
    throw err;
  }
}

