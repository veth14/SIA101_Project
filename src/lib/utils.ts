import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Philippine peso currency helpers
export const formatCurrencyPH = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(options || {})
  }).format(value);
};

export const formatShortCurrencyPH = (value: number) => {
  // Simple compact formatting fallback (K / M)
  if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₱${(value / 1000).toFixed(0)}K`;
  return `₱${value.toLocaleString('en-PH')}`;
};

// Normalize various Firestore/JS timestamp representations to milliseconds since epoch
export function getTimeValue(v: unknown): number | null {
  if (v == null) return null;

  // If it's a number already (ms)
  if (typeof v === 'number' && !Number.isNaN(v)) return v;

  // If it's a Firestore Timestamp-like object with toDate()
  if (typeof v === 'object') {
    try {
      const anyV = v as any;
      if (anyV?.toDate && typeof anyV.toDate === 'function') {
        const d = anyV.toDate();
        if (d instanceof Date && !Number.isNaN(d.getTime())) return d.getTime();
      }

      // Firestore may also store { seconds, nanoseconds }
      if (typeof anyV.seconds === 'number') {
        const seconds = anyV.seconds as number;
        const nanos = typeof anyV.nanoseconds === 'number' ? anyV.nanoseconds : 0;
        return seconds * 1000 + Math.floor(nanos / 1e6);
      }
    } catch (e) {
      // fallthrough to string parsing
    }
  }

  // If it's a string, try parsing
  if (typeof v === 'string') {
    const parsed = Date.parse(v);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}
