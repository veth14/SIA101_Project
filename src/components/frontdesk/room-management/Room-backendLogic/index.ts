// Export all room management backend logic
export * from './roomService';
export * from './useRoomManagement';

// Re-export types for convenience
export type {
  Room,
  RoomStats,
  RoomFilters
} from './roomService';

export type { UseRoomManagementReturn } from './useRoomManagement';
