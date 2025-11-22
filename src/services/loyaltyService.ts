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
} from 'firebase/firestore';

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

export const computePointsFromTotal = (totalSpent: number) => Math.floor(totalSpent / 100);

export const computeTierFromPoints = (points: number) => {
  if (points >= 7000) return 'Platinum';
  if (points >= 3000) return 'Gold';
  if (points >= 1000) return 'Silver';
  return 'Bronze';
};

export async function getGuests({ limitResults = 200 } = {}) {
  const col = collection(db, GUESTS);
  const q = query(col, orderBy('lastBookingDate', 'desc'), limit(limitResults));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as GuestProfile[];
}

export async function getGuestById(id: string) {
  const ref = doc(db, GUESTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as GuestProfile;
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
    loyaltyPoints: payload.loyaltyPoints ?? computePointsFromTotal(payload.totalSpent ?? 0),
    membershipTier: payload.membershipTier ?? computeTierFromPoints(payload.loyaltyPoints ?? computePointsFromTotal(payload.totalSpent ?? 0)),
    totalBookings: payload.totalBookings ?? 0,
    lastBookingDate: payload.lastBookingDate ?? null,
    status: payload.status ?? 'Active',
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(col, toSave);
  return { id: docRef.id, ...toSave };
}

export async function updateGuest(id: string, patch: Partial<GuestProfile>) {
  const ref = doc(db, GUESTS, id);
  await updateDoc(ref, { ...patch });
  return getGuestById(id);
}

export async function adjustPoints(guestId: string, delta: number, reason: string, adjustedBy: string) {
  const guestRef = doc(db, GUESTS, guestId);
  const adjustmentCol = collection(db, POINTS_ADJUST);
  return runTransaction(db, async (tx) => {
    const guestSnap = await tx.get(guestRef as any);
    if (!guestSnap.exists()) throw new Error('Guest not found');
    const current = guestSnap.data() as any;
    const newTotalSpent = (current.totalSpent ?? 0);
    const newPoints = Math.max(0, (current.loyaltyPoints ?? computePointsFromTotal(newTotalSpent)) + delta);

    tx.update(guestRef as any, { loyaltyPoints: newPoints, membershipTier: computeTierFromPoints(newPoints) });

    const adjRef = doc(adjustmentCol);
    tx.set(adjRef, {
      guestId,
      delta,
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
    const currentPoints = current.loyaltyPoints ?? computePointsFromTotal(current.totalSpent ?? 0);
    if (currentPoints < cost) throw new Error('Insufficient points');

    const newPoints = currentPoints - cost;
    tx.update(guestRef as any, { loyaltyPoints: newPoints, membershipTier: computeTierFromPoints(newPoints) });

    const rdRef = doc(redemptionCol);
    tx.set(rdRef, {
      guestId,
      rewardLabel,
      cost,
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
    const newTotalSpent = (current.totalSpent ?? 0) + bookingTotal;
    const newTotalBookings = (current.totalBookings ?? 0) + 1;
    const newPoints = computePointsFromTotal(newTotalSpent);
    const newTier = computeTierFromPoints(newPoints);

    tx.update(guestRef as any, {
      totalSpent: newTotalSpent,
      totalBookings: newTotalBookings,
      lastBookingDate: serverTimestamp(),
      loyaltyPoints: newPoints,
      membershipTier: newTier
    });
    return { newTotalSpent, newPoints, newTier };
  });
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
  computeTierFromPoints
};
