import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  runTransaction,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';
import { getTimeValue } from '../lib/utils';

export type GuestProfile = {
  id?: string;
  guestId?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  totalSpent: number;
  loyaltyPoints: number;
  membershipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalBookings: number;
  lastBookingDate?: any;
  status?: 'Active' | 'Inactive' | 'active' | 'inactive';
  createdAt?: any;
};

const GUESTS = 'guestprofiles';
const REDEMPTIONS = 'guestRedemptions';
const POINTS_ADJUST = 'guestPointsAdjustments';

// Points calculation per transaction: 1 point per ₱100 spent on a transaction
export const computePointsFromTransaction = (amount: number) => Math.floor(amount / 100);
// Legacy helper (avoid using to derive current points from lifetime spend)
export const computePointsFromTotal = (totalSpent: number) => Math.floor(totalSpent / 100);

export const computeTierFromPoints = (points: number) => {
  if (points >= 7000) return 'Platinum';
  if (points >= 3000) return 'Gold';
  if (points >= 1000) return 'Silver';
  return 'Bronze';
};

// Normalize guest document data into a plain GuestProfile with safe numeric fields
function normalizeGuestData(data: any, id?: string): GuestProfile {
  const totalSpent = Number(data?.totalSpent) || 0;
  const loyaltyPoints = Number(data?.loyaltyPoints) || 0;
  const totalBookings = Number(data?.totalBookings) || 0;
  return {
    id: id || data?.id,
    guestId: data?.guestId,
    fullName: data?.fullName || '',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    totalSpent,
    loyaltyPoints,
    membershipTier: data?.membershipTier || computeTierFromPoints(loyaltyPoints),
    totalBookings,
    lastBookingDate: data?.lastBookingDate || null,
    status: data?.status || 'Active',
    createdAt: data?.createdAt || null,
  } as GuestProfile;
}

export type RewardRedemption = {
  id: string;
  guestId: string;
  rewardLabel: string;
  cost: number;
  redeemedBy: string;
  timestamp?: any;
};

export async function getRedemptionsByGuest(
  guestId: string,
  { limitResults = 20, startAfterValue }: { limitResults?: number; startAfterValue?: number | any } = {}
) {
  const col = collection(db, REDEMPTIONS);
  let q;
  if (startAfterValue) {
    const startVal = typeof startAfterValue === 'number' ? Timestamp.fromMillis(startAfterValue) : startAfterValue;
    q = query(col, where('guestId', '==', guestId), orderBy('timestamp', 'desc'), startAfter(startVal), limit(limitResults));
  } else {
    q = query(col, where('guestId', '==', guestId), orderBy('timestamp', 'desc'), limit(limitResults));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as RewardRedemption[];
}

/**
 * Get list of guest profiles.
 * @param limitResults maximum results to return
 * @param startAfterValue optional - either a millisecond timestamp (number) or a DocumentSnapshot to startAfter (for pagination)
 */
export async function getGuests({ limitResults = 200, startAfterValue }: { limitResults?: number; startAfterValue?: number | any } = {}) {
  const col = collection(db, GUESTS);
  let q;
  if (startAfterValue) {
    // Accept a millisecond timestamp or a DocumentSnapshot; convert number -> Timestamp
    const startVal = typeof startAfterValue === 'number' ? Timestamp.fromMillis(startAfterValue) : startAfterValue;
    q = query(col, orderBy('lastBookingDate', 'desc'), startAfter(startVal), limit(limitResults));
  } else {
    q = query(col, orderBy('lastBookingDate', 'desc'), limit(limitResults));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => normalizeGuestData(d.data(), d.id));
}

export async function getGuestById(id: string) {
  const ref = doc(db, GUESTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return normalizeGuestData(snap.data(), snap.id);
}

export async function createGuest(payload: Partial<GuestProfile>) {
  const col = collection(db, GUESTS);
  const toSave: any = {
    fullName: payload.fullName || `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
    firstName: payload.firstName || undefined,
    lastName: payload.lastName || undefined,
    email: payload.email || '',
    phone: payload.phone || '',
    totalSpent: payload.totalSpent ?? 0,
    // Points should only be set explicitly or start at 0. Do NOT derive from lifetime spend.
    loyaltyPoints: payload.loyaltyPoints ?? 0,
    membershipTier: payload.membershipTier ?? computeTierFromPoints(payload.loyaltyPoints ?? 0),
    totalBookings: payload.totalBookings ?? 0,
    lastBookingDate: payload.lastBookingDate ?? null,
    status: payload.status ?? 'Active',
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(col, toSave);
  // Read back the created document so serverTimestamp() is resolved to a real Timestamp
  const snap = await getDoc(docRef);
  const raw = snap.exists() ? snap.data() : toSave;
  return normalizeGuestData(raw, docRef.id);
}

export async function updateGuest(id: string, patch: Partial<GuestProfile>) {
  const ref = doc(db, GUESTS, id);
  // Use a transaction to ensure we never decrease totalSpent accidentally
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref as any);
    if (!snap.exists()) throw new Error('Guest not found');
    const current = snap.data() as any;

    const toUpdate: any = { ...patch };

    // Enforce that totalSpent never decreases
    if (patch.totalSpent !== undefined && patch.totalSpent !== null) {
      const patched = Number(patch.totalSpent) || 0;
      const currentTotal = Number(current.totalSpent ?? 0);
      toUpdate.totalSpent = Math.max(currentTotal, patched);
    }

    // If loyaltyPoints provided, allow update (points balance can go up or down via adjust/redeem)
    if (toUpdate.loyaltyPoints !== undefined) {
      const lp = Number(toUpdate.loyaltyPoints) || 0;
      toUpdate.loyaltyPoints = lp;
      toUpdate.membershipTier = computeTierFromPoints(lp);
    }
    tx.update(ref as any, toUpdate);
    await tx.get(ref as any); // ensure transaction completes
    return getGuestById(id);
  });
}

export async function adjustPoints(guestId: string, delta: number, reason: string, adjustedBy: string) {
  const guestRef = doc(db, GUESTS, guestId);
  const adjustmentCol = collection(db, POINTS_ADJUST);
  return runTransaction(db, async (tx) => {
    const guestSnap = await tx.get(guestRef as any);
    if (!guestSnap.exists()) throw new Error('Guest not found');
    const current = guestSnap.data() as any;
    const currentPoints = Number(current.loyaltyPoints ?? 0);
    const deltaNum = Number(delta) || 0;
    const newPoints = Math.max(0, currentPoints + deltaNum);

    tx.update(guestRef as any, { loyaltyPoints: newPoints, membershipTier: computeTierFromPoints(newPoints) });

    const adjRef = doc(adjustmentCol);
    tx.set(adjRef, {
      guestId,
      delta: deltaNum,
      reason,
      adjustedBy,
      timestamp: serverTimestamp()
    });
    return { loyaltyPoints: newPoints };
  });
}

export async function redeemReward(guestId: string, cost: number, rewardLabel: string, redeemedBy: string) {
  const guestRef = doc(db, GUESTS, guestId);
  const redemptionCol = collection(db, REDEMPTIONS);

  return runTransaction(db, async (tx) => {
    const guestSnap = await tx.get(guestRef as any);
    if (!guestSnap.exists()) throw new Error('Guest not found');
    const current = guestSnap.data() as any;
    const currentPoints = Number(current.loyaltyPoints ?? 0);
    const costNum = Number(cost) || 0;
    if (currentPoints < costNum) throw new Error('Insufficient points');

    const newPoints = currentPoints - costNum;
    tx.update(guestRef as any, { loyaltyPoints: newPoints, membershipTier: computeTierFromPoints(newPoints) });

    const rdRef = doc(redemptionCol);
    tx.set(rdRef, {
      guestId,
      rewardLabel,
      cost: costNum,
      redeemedBy,
      timestamp: serverTimestamp()
    });

    return { loyaltyPoints: newPoints };
  });
}

export async function applyCheckoutUpdate(guestId: string, bookingTotal: number) {
  // update totalSpent, totalBookings, lastBookingDate, loyaltyPoints, membershipTier in one batch
  const guestRef = doc(db, GUESTS, guestId);
  return runTransaction(db, async (tx) => {
    const guestSnap = await tx.get(guestRef as any);
    if (!guestSnap.exists()) throw new Error('Guest not found');
    const current = guestSnap.data() as any;
    const bookingNum = Number(bookingTotal) || 0;
    const newTotalSpent = (Number(current.totalSpent ?? 0)) + bookingNum;
    const newTotalBookings = (Number(current.totalBookings ?? 0)) + 1;
    // Points are earned per transaction — compute points for this booking and add to existing points
    const earned = computePointsFromTransaction(bookingNum);
    const currentPoints = Number(current.loyaltyPoints ?? 0);
    const newPoints = currentPoints + earned;
    const newTier = computeTierFromPoints(newPoints);

    tx.update(guestRef as any, {
      totalSpent: newTotalSpent,
      totalBookings: newTotalBookings,
      lastBookingDate: serverTimestamp(),
      loyaltyPoints: newPoints,
      membershipTier: newTier
    });
    return { newTotalSpent, earned, newPoints, newTier };
  });
}

/**
 * Get latest checkout date for a user by email from bookings collection.
 * Returns ISO string, or null when none.
 */
export async function getLatestCheckoutByEmail(email: string): Promise<string | null> {
  if (!email) return null;
  const col = collection(db, 'bookings');
  try {
    const q = query(col, where('userEmail', '==', email), orderBy('checkOut', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0].data() as any;
    const ms = getTimeValue(d?.checkOut);
    if (ms) return new Date(ms).toISOString();
    return typeof d?.checkOut === 'string' ? d.checkOut : null;
  } catch (err) {
    try {
      const q2 = query(col, where('userEmail', '==', email), orderBy('createdAt', 'desc'), limit(5));
      const snap2 = await getDocs(q2);
      let best: number | null = null;
      snap2.forEach(docSnap => {
        const data = docSnap.data() as any;
        const t = getTimeValue(data?.checkOut);
        if (t && (best === null || t > best)) best = t;
      });
      return best ? new Date(best).toISOString() : null;
    } catch {
      return null;
    }
  }
}

export default {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  adjustPoints,
  redeemReward,
  applyCheckoutUpdate,
  computePointsFromTotal,
  computePointsFromTransaction,
  computeTierFromPoints,
  getRedemptionsByGuest,
  getLatestCheckoutByEmail
};
