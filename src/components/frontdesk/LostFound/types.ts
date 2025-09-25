/**
 * Lost & Found Types and Interfaces
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the Lost & Found management system.
 */

/**
 * Represents a lost and found item in the hotel system
 */
export interface LostFoundItem {
  /** Unique identifier for the item */
  id: string;
  
  /** Name/title of the lost item */
  itemName: string;
  
  /** Detailed description of the item */
  description: string;
  
  /** Category classification of the item */
  category: 'electronics' | 'clothing' | 'jewelry' | 'documents' | 'personal' | 'other';
  
  /** Location where the item was found */
  location: string;
  
  /** Date when the item was found (ISO string format) */
  dateFound: string;
  
  /** Staff member who found the item */
  foundBy: string;
  
  /** Current status of the item */
  status: 'unclaimed' | 'claimed' | 'disposed';
  
  /** Guest information (if item has been claimed) */
  guestInfo?: {
    /** Guest's full name */
    name: string;
    /** Room number where guest stayed */
    room: string;
    /** Contact information */
    contact: string;
  };
  
  /** Date when item was claimed (ISO string format) */
  claimedDate?: string;
  
  /** Person who claimed the item */
  claimedBy?: string;
}

/**
 * Filter options for lost and found items
 */
export type StatusFilter = 'all' | 'unclaimed' | 'claimed' | 'disposed';
export type CategoryFilter = 'all' | LostFoundItem['category'];

/**
 * Statistics for lost and found items
 */
export interface LostFoundStats {
  /** Total number of items */
  all: number;
  /** Number of unclaimed items */
  unclaimed: number;
  /** Number of claimed items */
  claimed: number;
  /** Number of disposed items */
  disposed: number;
}

/**
 * Props for status badge component
 */
export interface StatusBadgeProps {
  /** Status to display */
  status: LostFoundItem['status'];
}

/**
 * Props for category icon component
 */
export interface CategoryIconProps {
  /** Category to display icon for */
  category: LostFoundItem['category'];
  /** Optional size class */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for filter components
 */
export interface FilterProps {
  /** Current search term */
  searchTerm: string;
  /** Function to update search term */
  onSearchChange: (term: string) => void;
  /** Current status filter */
  statusFilter: StatusFilter;
  /** Function to update status filter */
  onStatusChange: (status: StatusFilter) => void;
  /** Current category filter */
  categoryFilter: CategoryFilter;
  /** Function to update category filter */
  onCategoryChange: (category: CategoryFilter) => void;
  /** Function to handle adding new item */
  onAddNew: () => void;
}

/**
 * Props for item card component
 */
export interface ItemCardProps {
  /** Lost and found item data */
  item: LostFoundItem;
  /** Function to handle viewing item details */
  onViewDetails: (item: LostFoundItem) => void;
  /** Function to handle marking item as claimed */
  onMarkClaimed: (item: LostFoundItem) => void;
}

/**
 * Props for stats component
 */
export interface StatsProps {
  /** Statistics data */
  stats: LostFoundStats;
}
