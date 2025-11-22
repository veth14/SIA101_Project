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
  limit as queryLimit,
  orderBy,
  startAfter,
  onSnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

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
  date: string; // formatted for UI
  timeIn?: string;
  timeOut?: string;
  hoursWorked?: number;
  status?: 'On-Duty' | 'Off-Duty' | string;
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

  // If the record's date (from TimeIn) matches today and there's no TimeOut -> On-Duty
  if (parsedTimeIn && sameDate(parsedTimeIn, today)) {
    status = parsedTimeOut ? 'Off-Duty' : 'On-Duty';
  } else {
    // If TimeIn is not today, rely on explicit status or presence of TimeOut
    status = d.status ?? (parsedTimeOut ? 'Off-Duty' : 'Off-Duty');
  }

  return {
    id: docSnap.id,
    staffMember: d.fullName ?? d.staffName ?? d.name ?? '',
    classification: d.classification ?? d.department ?? '',
    date: parsedTimeIn ? parsedTimeIn.toLocaleDateString() : formatDate(explicitDate),
    timeIn: parsedTimeIn ? parsedTimeIn.toLocaleTimeString() : formatTime(rawTimeIn),
    timeOut: parsedTimeOut ? parsedTimeOut.toLocaleTimeString() : formatTime(rawTimeOut),
    hoursWorked: typeof d.hoursWorked === 'number' ? d.hoursWorked : undefined,
    status,
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
    const full = snapshot.docs.map(mapAttendanceDoc);
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
        // (subscriber should handle its own try/catch if needed)
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
    const last = snap.docs[snap.docs.length - 1];
    return { logs, lastDocId: last ? last.id : undefined };
  } catch (err) {
    // Let caller handle errors; return empty list on failure to avoid crashing UI
    console.error('fetchClockLogsPage error', err);
    return { logs: [] };
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
    const archivedRef = collection(db, 'archived_tickets');
    const q = query(archivedRef, orderBy('archivedAt', 'desc'), queryLimit(200));
    const snap = await getDocs(q);
    const records: ArchiveRecord[] = [];
    snap.forEach(d => {
      const data = d.data() as any;
      records.push({
        id: d.id, // For archived tickets we write ticketNumber as doc id so this will be the ticket number
        type: 'Completed Ticket',
        description: data.taskTitle ?? data.description ?? '',
        dateArchived: data.archivedAt ? (data.archivedAt as Timestamp).toDate().toLocaleString() : '',
      });
    });
    return records;
  } catch (err) {
    console.error('fetchArchiveRecords error', err);
    return [];
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

export async function downloadArchiveRecord(id: string, collectionName = 'archived_tickets'): Promise<string | void> {
  // By convention, archive docs may store a fileUrl field pointing to storage or an external URL.
  // To avoid extra reads, consider returning a pre-signed URL from your backend instead.
  try {
    const d = await getDoc(doc(db, collectionName, id));
    if (!d.exists()) return;
    const data = d.data() as any;
    return data.fileUrl as string | undefined;
  } catch (err) {
    console.error('downloadArchiveRecord error', err);
    throw err;
  }
}
