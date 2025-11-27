export declare const ROOM_TYPES_CONFIG: {
    id: string;
    name: string;
    price: number;
    baseGuests: number;
    maxGuests: number;
    additionalGuestPrice: number;
}[];
export declare const TYPE_ID_MAP: Record<string, string>;
/**
 * Normalizes a room type string to a valid ID (e.g., 'Silid Payapa' -> 'standard').
 * * FIX EXPLANATION:
 * We return 'unknown' instead of defaulting to 'standard' to prevent
 * logic errors where an invalid room type accidentally gets assigned
 * Standard pricing/capacity. This forces the UI to handle the error
 * or prompt the user for a selection.
 */
export declare const normalizeTypeKey: (s: string) => string;
export declare const checkDateOverlap: (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string) => boolean;
