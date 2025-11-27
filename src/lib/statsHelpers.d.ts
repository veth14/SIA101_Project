/**
 * Increment total bookings and monthly bookings counter
 * @param delta - +1 for new booking, -1 for deleted booking
 * @param checkInDate - YYYY-MM-DD string (used to derive month key)
 */
export declare function updateBookingCount(delta: number, checkInDate: string): Promise<void>;
/**
 * Increment/decrement total revenue
 * @param delta - amount to add (positive) or subtract (negative)
 */
export declare function updateRevenue(delta: number): Promise<void>;
/**
 * Increment daily arrivals counter
 * @param delta - +1 or -1
 * @param arrivalDate - YYYY-MM-DD string
 */
export declare function updateArrivals(delta: number, arrivalDate: string): Promise<void>;
/**
 * Update room counts when room is added/removed/status changed
 * @param totalRoomsDelta - +1 when room added, -1 when removed
 * @param availableRoomsDelta - +1 when room becomes available, -1 when occupied/cleaning
 */
export declare function updateRoomCounts(totalRoomsDelta: number, availableRoomsDelta: number): Promise<void>;
/**
 * Update staff counts
 * @param totalStaffDelta - +1 when staff added, -1 when removed
 * @param activeStaffDelta - +1 when staff becomes active, -1 when inactive
 */
export declare function updateStaffCounts(totalStaffDelta: number, activeStaffDelta: number): Promise<void>;
/**
 * Update current guests count (checked-in bookings)
 * @param delta - +1 on check-in, -1 on check-out
 */
export declare function updateCurrentGuests(delta: number): Promise<void>;
