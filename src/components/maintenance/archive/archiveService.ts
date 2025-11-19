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
    // Firestore Timestamp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof value === 'object' && typeof (value as any).toDate === 'function') {
      return (value as any).toDate().toLocaleDateString();
    }
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleDateString();
    return String(value).split('T')[0];
  } catch (e) {
    return String(value);
  }
}

function formatTime(value: any): string {
  // Return a locale time string (no date). Handles Firestore Timestamp, Date, or string.
  try {
    if (!value) return '';
    // Firestore Timestamp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof value === 'object' && typeof (value as any).toDate === 'function') {
      return (value as any).toDate().toLocaleTimeString();
    }
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleTimeString();
    // attempt to split an ISO datetime
    const s = String(value);
    const t = s.split('T')[1];
    return t ? t.split('Z')[0] : s;
  } catch (e) {
    return String(value);
  }
}

function mapAttendanceDoc(docSnap: QueryDocumentSnapshot): ClockLog {
  const d = docSnap.data() as Record<string, any>;
  // prefer explicit date field, else derive from timeIn/TimeIn
  const rawDate = d.date ?? d.Date ?? d.dateCreated ?? d.createdAt ?? (d.TimeIn ?? d.timeIn);
  const rawTimeIn = d.TimeIn ?? d.timeIn ?? d.timeInRaw ?? null;
  const rawTimeOut = d.timeOut ?? d.TimeOut ?? d.timeOutRaw ?? null;

  return {
    id: docSnap.id,
    staffMember: d.fullName ?? d.staffName ?? d.name ?? '',
    classification: d.classification ?? d.department ?? '',
    date: formatDate(rawDate),
    timeIn: formatTime(rawTimeIn),
    timeOut: formatTime(rawTimeOut),
    hoursWorked: typeof d.hoursWorked === 'number' ? d.hoursWorked : undefined,
    status: d.status ?? (rawTimeOut ? 'Off-Duty' : 'On-Duty'),
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
  // TODO: implement efficient aggregations (use Firestore count() aggregation or maintain counters)
  return {};
}

export async function fetchArchiveRecords(): Promise<ArchiveRecord[]> {
  // TODO: implement paginated reads for your archive collection(s). Return empty for now.
  return [];
}

export async function deleteArchiveRecord(id: string, collectionName = 'archives'): Promise<void> {
  // Deletes a document from a specified collection. Use with care.
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    console.error('deleteArchiveRecord error', err);
    throw err;
  }
}

export async function downloadArchiveRecord(id: string, collectionName = 'archives'): Promise<string | void> {
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
