// Export all inventory management backend logic
export * from './inventoryService';
export * from './useInventoryManagement';

// Re-export types for convenience
export type {
  InventoryItem,
  StockTransaction,
  InventoryStats,
  InventoryFilters
} from './inventoryService';

export type { UseInventoryManagementReturn } from './useInventoryManagement';
