import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Note: these functions are kept in the repo for local emulator testing and
// for reference. The root `firebase.json` intentionally does not reference
// functions to avoid accidental production deploys that may require Blaze.

admin.initializeApp();
const db = admin.firestore();
const statsRef = db.doc('stats/dashboard');

function formatDateKey(ts: any) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const onBookingWrite = functions.firestore
  .document('bookings/{bookingId}')
  .onWrite(async (change: any, context: any) => {
    const before = change.before?.exists ? change.before.data() : null;
    const after = change.after?.exists ? change.after.data() : null;

    let bookingsDelta = 0;
    let revenueDelta = 0;
    const arrivalsDeltas: Record<string, number> = {};
  const monthlyDeltas: Record<string, number> = {};

  const getRevenue = (doc: any) => Number(doc?.totalAmount ?? doc?.amount ?? 0);
  // Support several booking schemas: prefer `checkIn` (string), then `checkInDate`, then `arrivalDate`.
  const getArrival = (doc: any) => formatDateKey(doc?.checkIn ?? doc?.checkInDate ?? doc?.arrivalDate);

    if (!before && after) {
      bookingsDelta = 1;
      revenueDelta = getRevenue(after);
      const day = getArrival(after);
      if (day) arrivalsDeltas[day] = (arrivalsDeltas[day] || 0) + 1;
      const month = day ? day.slice(0, 7) : formatDateKey(new Date()).slice(0, 7);
      monthlyDeltas[month] = (monthlyDeltas[month] || 0) + 1;
    } else if (before && !after) {
      bookingsDelta = -1;
      revenueDelta = -getRevenue(before);
      const day = getArrival(before);
      if (day) arrivalsDeltas[day] = (arrivalsDeltas[day] || 0) - 1;
      const month = day ? day.slice(0, 7) : formatDateKey(new Date()).slice(0, 7);
      monthlyDeltas[month] = (monthlyDeltas[month] || 0) - 1;
    } else if (before && after) {
      const beforeRevenue = getRevenue(before);
      const afterRevenue = getRevenue(after);
      revenueDelta = afterRevenue - beforeRevenue;

      const beforeDay = getArrival(before);
      const afterDay = getArrival(after);
      if (beforeDay !== afterDay) {
        if (beforeDay) arrivalsDeltas[beforeDay] = (arrivalsDeltas[beforeDay] || 0) - 1;
        if (afterDay) arrivalsDeltas[afterDay] = (arrivalsDeltas[afterDay] || 0) + 1;
      }
      // If booking changed its arrival/check-in day, adjust monthly counters too
      const beforeMonth = beforeDay ? beforeDay.slice(0, 7) : null;
      const afterMonth = afterDay ? afterDay.slice(0, 7) : null;
      if (beforeMonth !== afterMonth) {
        if (beforeMonth) monthlyDeltas[beforeMonth] = (monthlyDeltas[beforeMonth] || 0) - 1;
        if (afterMonth) monthlyDeltas[afterMonth] = (monthlyDeltas[afterMonth] || 0) + 1;
      }
    }

    const updates: Record<string, any> = {};
    if (bookingsDelta !== 0) updates.totalBookings = admin.firestore.FieldValue.increment(bookingsDelta);
    // Apply any monthly deltas we collected above
    for (const [month, delta] of Object.entries(monthlyDeltas)) {
      updates[`monthly.${month}`] = admin.firestore.FieldValue.increment(delta);
    }
    if (revenueDelta !== 0) updates.totalRevenue = admin.firestore.FieldValue.increment(revenueDelta);
    for (const [day, delta] of Object.entries(arrivalsDeltas)) {
      updates[`arrivals.${day}`] = admin.firestore.FieldValue.increment(delta);
    }

    if (Object.keys(updates).length === 0) return null;

    try {
      await statsRef.set(updates, { merge: true });
    } catch (err) {
      console.error('Failed to update stats/dashboard', err);
    }

    return null;
  });

export const onRoomWrite = functions.firestore
  .document('rooms/{roomId}')
  .onWrite(async (change: any, context: any) => {
    const before = change.before?.exists ? change.before.data() : null;
    const after = change.after?.exists ? change.after.data() : null;

    const updates: Record<string, any> = {};

    if (!before && after) {
      updates.totalRooms = admin.firestore.FieldValue.increment(1);
      if ((after as any).status === 'available') {
        updates.availableRooms = admin.firestore.FieldValue.increment(1);
      }
    } else if (before && !after) {
      updates.totalRooms = admin.firestore.FieldValue.increment(-1);
      if ((before as any).status === 'available') {
        updates.availableRooms = admin.firestore.FieldValue.increment(-1);
      }
    } else if (before && after) {
      const beforeAvailable = (before as any).status === 'available';
      const afterAvailable = (after as any).status === 'available';

      if (beforeAvailable !== afterAvailable) {
        updates.availableRooms = admin.firestore.FieldValue.increment(afterAvailable ? 1 : -1);
      }
    }

    if (Object.keys(updates).length === 0) return null;

    try {
      await statsRef.set(updates, { merge: true });
    } catch (err) {
      console.error('Failed to update stats/dashboard for room change', err);
    }

    return null;
  });

// Maintain staff counts in stats/dashboard to avoid client-side collection scans.
export const onStaffWrite = functions.firestore
  .document('staff/{staffId}')
  .onWrite(async (change: any, context: any) => {
    const before = change.before?.exists ? change.before.data() : null;
    const after = change.after?.exists ? change.after.data() : null;

    const updates: Record<string, any> = {};

    // Track total staff count
    if (!before && after) {
      updates.totalStaff = admin.firestore.FieldValue.increment(1);
    } else if (before && !after) {
      updates.totalStaff = admin.firestore.FieldValue.increment(-1);
    }

    // Track active staff. Prefer an explicit `isActive` boolean if present; fall back to `status`.
    const beforeActive = before ? ((typeof before.isActive === 'boolean') ? before.isActive : (before.status === 'active')) : false;
    const afterActive = after ? ((typeof after.isActive === 'boolean') ? after.isActive : (after.status === 'active')) : false;

    if (!before && after && afterActive) {
      updates.activeStaff = admin.firestore.FieldValue.increment(1);
    } else if (before && !after && beforeActive) {
      updates.activeStaff = admin.firestore.FieldValue.increment(-1);
    } else if (before && after && beforeActive !== afterActive) {
      updates.activeStaff = admin.firestore.FieldValue.increment(afterActive ? 1 : -1);
    }

    if (Object.keys(updates).length === 0) return null;

    try {
      await statsRef.set(updates, { merge: true });
    } catch (err) {
      console.error('Failed to update stats/dashboard for staff change', err);
    }

    return null;
  });
