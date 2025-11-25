// reservations.utils.ts

// --- Constants ---

export const ROOM_TYPES_CONFIG = [
  { id: 'standard', name: 'Silid Payapa', price: 2500, baseGuests: 2, maxGuests: 4, additionalGuestPrice: 500 },
  { id: 'deluxe', name: 'Silid Marahuyo', price: 3800, baseGuests: 2, maxGuests: 5, additionalGuestPrice: 750 },
  { id: 'suite', name: 'Silid Ginhawa', price: 5500, baseGuests: 2, maxGuests: 6, additionalGuestPrice: 1000 },
  { id: 'family', name: 'Silid Haraya', price: 8000, baseGuests: 4, maxGuests: 8, additionalGuestPrice: 1200 },
];

export const TYPE_ID_MAP: Record<string, string> = {
  'standard': 'standard', 'standard room': 'standard',
  'deluxe': 'deluxe', 'deluxe room': 'deluxe',
  'suite': 'suite', 'suite room': 'suite',
  'family': 'family', 'family suite': 'family',
  'premium family suite': 'family',
  'silid payapa': 'standard',
  'silid marahuyo': 'deluxe',
  'silid ginhawa': 'suite',
  'silid haraya': 'family',
  // Variations
  'silid payapa (standard room)': 'standard',
  'silid marahuyo (deluxe room)': 'deluxe',
  'silid ginhawa (suite room)': 'suite',
  'silid haraya (premium family suite)': 'family',
};

// --- Helper Functions ---

/**
 * Normalizes a room type string to a valid ID (e.g., 'Silid Payapa' -> 'standard').
 * * FIX EXPLANATION:
 * We return 'unknown' instead of defaulting to 'standard' to prevent
 * logic errors where an invalid room type accidentally gets assigned
 * Standard pricing/capacity. This forces the UI to handle the error
 * or prompt the user for a selection.
 */
export const normalizeTypeKey = (s: string): string => {
  if (!s) return 'unknown'; 
  const key = s.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
  return TYPE_ID_MAP[key] || 'unknown'; 
};

export const checkDateOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => {
  if (!checkIn1 || !checkOut1 || !checkIn2 || !checkOut2) return false;
  try {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    const start2 = new Date(checkIn2);
    const end2 = new Date(checkOut2);
    if (isNaN(start1.getTime()) || isNaN(end1.getTime()) || isNaN(start2.getTime()) || isNaN(end2.getTime())) {
      return false;
    }
    return start1 < end2 && start2 < end1;
  } catch(e) {
    return false;
  }
};