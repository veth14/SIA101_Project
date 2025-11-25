import { db } from '../../../config/firebase';
import { collection, getDocs, query, limit as limitQuery, onSnapshot, doc, runTransaction, DocumentData, QueryDocumentSnapshot, orderBy, startAfter } from 'firebase/firestore';
import type { LostFoundItem } from './types';

// Module-level listener state so listeners survive navigation and we don't re-subscribe.
let isListening = false;
let unsubFound: (() => void) | null = null;
let unsubLost: (() => void) | null = null;

const CACHE_KEY_FOUND = 'lf_found_cache_v1';
const CACHE_KEY_LOST = 'lf_lost_cache_v1';

function mapDocToItem(d: QueryDocumentSnapshot<DocumentData>): LostFoundItem {
  const data = d.data() as DocumentData;
  // Determine which collection this document belongs to so we map fields correctly.
  const collectionId = d.ref && d.ref.parent ? d.ref.parent.id : undefined;
  let dateFoundVal = (data.dateFound ?? data.dateLost) ?? new Date().toISOString();
  let foundByVal = (data.foundBy ?? data.lostBy) ?? '';

  if (collectionId === 'found') {
    // For found collection, prefer dateFound and foundBy fields only.
    dateFoundVal = data.dateFound ?? new Date().toISOString();
    foundByVal = data.foundBy ?? '';
  } else if (collectionId === 'lost') {
    // For lost collection, prefer dateLost and lostBy, but normalize to the UI model (dateFound/foundBy).
    dateFoundVal = data.dateLost ?? new Date().toISOString();
    foundByVal = data.lostBy ?? '';
  }

  return {
    id: data.itemId ?? d.id,
    itemName: data.itemName ?? '',
    description: data.description ?? '',
    category: (data.category ?? 'other') as LostFoundItem['category'],
    location: data.location ?? '',
    dateFound: dateFoundVal,
    foundBy: foundByVal,
    status: (data.status ?? 'unclaimed') as LostFoundItem['status'],
    guestInfo: data.guestInfo,
    claimedDate: data.claimedDate,
    claimedBy: data.claimedBy
  } as LostFoundItem;
}

export async function startListeners(
  onFoundUpdate: (items: LostFoundItem[], docMap: Record<string, string>) => void,
  onLostUpdate: (items: LostFoundItem[], docMap: Record<string, string>) => void,
  pageSize = 20
) {
  // If already listening, immediately call callbacks with cache if present and return
  if (isListening) {
    try {
      const cachedF = sessionStorage.getItem(CACHE_KEY_FOUND);
      if (cachedF) {
        const parsed = JSON.parse(cachedF) as { items: LostFoundItem[]; map: Record<string,string> };
        onFoundUpdate(parsed.items, parsed.map);
      }
      const cachedL = sessionStorage.getItem(CACHE_KEY_LOST);
      if (cachedL) {
        const parsed2 = JSON.parse(cachedL) as { items: LostFoundItem[]; map: Record<string,string> };
        onLostUpdate(parsed2.items, parsed2.map);
      }
    } catch (err) {
      console.debug('startListeners cache read error', err);
    }
    return;
  }

  // Try to hydrate from session cache first (fast), then subscribe to live updates.
  try {
    const cachedF = sessionStorage.getItem(CACHE_KEY_FOUND);
    if (cachedF) {
      const parsed = JSON.parse(cachedF) as { items: LostFoundItem[]; map: Record<string,string> };
      onFoundUpdate(parsed.items, parsed.map);
    }
    const cachedL = sessionStorage.getItem(CACHE_KEY_LOST);
    if (cachedL) {
      const parsed2 = JSON.parse(cachedL) as { items: LostFoundItem[]; map: Record<string,string> };
      onLostUpdate(parsed2.items, parsed2.map);
    }
  } catch (err) {
    console.debug('startListeners cache parse error', err);
  }

  // Start real-time listeners; these will send deltas and keep clients in sync.
  try {
    // Subscribe to a limited query first to avoid reading the whole collection on mount.
    const foundQuery = query(collection(db, 'found'), orderBy('seqNumber', 'desc'), limitQuery(pageSize));
    unsubFound = onSnapshot(foundQuery, (snap) => {
      const items: LostFoundItem[] = [];
      const map: Record<string,string> = {};
      snap.docs.forEach(d => {
        const it = mapDocToItem(d);
        items.push(it);
        map[it.id] = d.id;
      });
      // dedupe not needed as docs are unique
      // cache only the first page to limit sessionStorage usage
      sessionStorage.setItem(CACHE_KEY_FOUND, JSON.stringify({ items, map }));
      onFoundUpdate(items, map);
    });

    const lostQuery = query(collection(db, 'lost'), orderBy('seqNumber', 'desc'), limitQuery(pageSize));
    unsubLost = onSnapshot(lostQuery, (snap) => {
      const items: LostFoundItem[] = [];
      const map: Record<string,string> = {};
      snap.docs.forEach(d => {
        const it = mapDocToItem(d);
        items.push(it);
        map[it.id] = d.id;
      });
      sessionStorage.setItem(CACHE_KEY_LOST, JSON.stringify({ items, map }));
      onLostUpdate(items, map);
    });

    isListening = true;
  } catch (err) {
    console.warn('Failed to start lost&found listeners', err);
  }
}

export function stopListeners() {
  if (unsubFound) {
    try { unsubFound(); } catch (err) { console.warn('unsubFound error', err); }
    unsubFound = null;
  }
  if (unsubLost) {
    try { unsubLost(); } catch (err) { console.warn('unsubLost error', err); }
    unsubLost = null;
  }
  isListening = false;
}

export async function fetchPage(collectionName: 'found' | 'lost', pageSize = 10, startAfterDoc?: unknown | null) {
  // Build a query ordered by seqNumber desc so newest items come first.
  const base = collection(db, collectionName);
  let q;
  if (startAfterDoc) {
    q = query(base, orderBy('seqNumber', 'desc'), startAfter(startAfterDoc), limitQuery(pageSize));
  } else {
    q = query(base, orderBy('seqNumber', 'desc'), limitQuery(pageSize));
  }
  const snap = await getDocs(q);
  const items: LostFoundItem[] = snap.docs.map(d => mapDocToItem(d));
  const map: Record<string,string> = {};
  snap.docs.forEach(d => {
    const it = mapDocToItem(d);
    map[it.id] = d.id;
  });
  return { items, map, docs: snap.docs };
}

// Allocate sequential id by scanning once and trying candidates (same optimized approach)
export const allocateSequentialId = async (collectionName: 'found' | 'lost') => {
  const prefix = collectionName === 'found' ? 'FND' : 'LST';
  try {
    // Prefer using a numeric seqNumber field for O(1) lookup of the latest sequence.
    const q = query(collection(db, collectionName), orderBy('seqNumber', 'desc'), limitQuery(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const top = snap.docs[0].data() as DocumentData;
      const seq = typeof top.seqNumber === 'number' ? top.seqNumber : undefined;
      if (typeof seq === 'number') {
        const next = seq + 1;
        return `${prefix}${String(next).padStart(3, '0')}`;
      }
    }

    // Fallback: if no seqNumber exists yet, fall back to scanning itemId suffixes.
    // This is rare and acceptable for small collections; try to limit impact.
    const full = await getDocs(collection(db, collectionName));
    let max = 0;
    full.docs.forEach(d => {
      const data = d.data() as DocumentData;
      const itemId = String(data.itemId ?? d.id).toUpperCase();
      const m = itemId.match(/(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!Number.isNaN(n) && n > max) max = n;
      }
    });
    const next = max + 1;
    return `${prefix}${String(next).padStart(3, '0')}`;
  } catch (err) {
    console.warn('allocateSequentialId failed', err);
    return null;
  }
};

// Create & reserve document using transaction + retries. Returns finalId or null.
export const createAndReserveDoc = async (
  collectionName: 'found' | 'lost',
  payload: DocumentData,
  maxRetries = 3
): Promise<string | null> => {
  const targetCol = collectionName === 'found' ? 'found' : 'lost';
  const prefix = collectionName === 'found' ? 'FND' : 'LST';

  // Use a small counter document to allocate monotonic sequence numbers without scanning.
  // Collection: `lf_sequence`, doc id = collectionName ('found'|'lost')
  const counterRef = (name: string) => doc(db, 'lf_sequence', name);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const finalId = await runTransaction(db, async (tx) => {
        const cRef = counterRef(collectionName);
        const cSnap = await tx.get(cRef);
        let lastSeq = 0;
        if (cSnap.exists()) {
          const cd = cSnap.data() as DocumentData;
          if (typeof cd.lastSeq === 'number') lastSeq = cd.lastSeq;
        }
        const nextSeq = lastSeq + 1;
        const candidateId = `${prefix}${String(nextSeq).padStart(3, '0')}`;
        const docRef = doc(db, targetCol, candidateId);
        const existing = await tx.get(docRef);
        if (existing.exists()) {
          // Very rare: increment counter but doc exists — try next attempt
          throw new Error('DOC_EXISTS');
        }

        // update counter and create doc atomically
        tx.set(cRef, { lastSeq: nextSeq });
        tx.set(docRef, { ...payload, itemId: candidateId, seqNumber: nextSeq });
        return candidateId;
      });

      return finalId;
    } catch (err) {
      const msg = (err && typeof err === 'object' && err !== null && 'message' in err) ? String((err as { message?: unknown }).message ?? '') : '';
      if (msg === 'DOC_EXISTS') {
        // retry a few times with small backoff
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
      console.warn('createAndReserveDoc transaction failed', err);
      await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
    }
  }

  return null;
};

export function getCached(collectionName: 'found' | 'lost') {
  try {
    const key = collectionName === 'found' ? CACHE_KEY_FOUND : CACHE_KEY_LOST;
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as { items: LostFoundItem[]; map: Record<string,string> };
  } catch {
    return null;
  }
}
