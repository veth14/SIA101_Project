import { doc, increment, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
/**
 * Client-side stats helpers for updating stats/dashboard atomically.
 * Use these when creating/updating/deleting bookings, rooms, or staff to keep aggregated counts in sync.
 * IMPORTANT: Only call these from admin/authenticated paths. Security rules must restrict writes to stats/dashboard.
 */
const statsDocRef = doc(db, 'stats', 'dashboard');
/**
 * Helper to safely update stats/dashboard with merge (creates the doc if it doesn't exist)
 */
async function updateStats(updates) {
    try {
        await setDoc(statsDocRef, updates, { merge: true });
    }
    catch (err) {
        console.error('Failed to update stats/dashboard:', err);
        // Don't throw — allow the main operation to succeed even if stats update fails
    }
}
/**
 * Increment total bookings and monthly bookings counter
 * @param delta - +1 for new booking, -1 for deleted booking
 * @param checkInDate - YYYY-MM-DD string (used to derive month key)
 */
export async function updateBookingCount(delta, checkInDate) {
    const monthKey = checkInDate.slice(0, 7); // "YYYY-MM"
    await updateStats({
        totalBookings: increment(delta),
        [`monthly.${monthKey}`]: increment(delta),
    });
}
/**
 * Increment/decrement total revenue
 * @param delta - amount to add (positive) or subtract (negative)
 */
export async function updateRevenue(delta) {
    await updateStats({
        totalRevenue: increment(delta),
    });
}
/**
 * Increment daily arrivals counter
 * @param delta - +1 or -1
 * @param arrivalDate - YYYY-MM-DD string
 */
export async function updateArrivals(delta, arrivalDate) {
    await updateStats({
        [`arrivals.${arrivalDate}`]: increment(delta),
    });
}
/**
 * Update room counts when room is added/removed/status changed
 * @param totalRoomsDelta - +1 when room added, -1 when removed
 * @param availableRoomsDelta - +1 when room becomes available, -1 when occupied/cleaning
 */
export async function updateRoomCounts(totalRoomsDelta, availableRoomsDelta) {
    const updates = {};
    if (totalRoomsDelta !== 0)
        updates.totalRooms = increment(totalRoomsDelta);
    if (availableRoomsDelta !== 0)
        updates.availableRooms = increment(availableRoomsDelta);
    if (Object.keys(updates).length > 0) {
        await updateStats(updates);
    }
}
/**
 * Update staff counts
 * @param totalStaffDelta - +1 when staff added, -1 when removed
 * @param activeStaffDelta - +1 when staff becomes active, -1 when inactive
 */
export async function updateStaffCounts(totalStaffDelta, activeStaffDelta) {
    const updates = {};
    if (totalStaffDelta !== 0)
        updates.totalStaff = increment(totalStaffDelta);
    if (activeStaffDelta !== 0)
        updates.activeStaff = increment(activeStaffDelta);
    if (Object.keys(updates).length > 0) {
        await updateStats(updates);
    }
}
/**
 * Update current guests count (checked-in bookings)
 * @param delta - +1 on check-in, -1 on check-out
 */
export async function updateCurrentGuests(delta) {
    await updateStats({
        currentGuests: increment(delta),
    });
}
