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
