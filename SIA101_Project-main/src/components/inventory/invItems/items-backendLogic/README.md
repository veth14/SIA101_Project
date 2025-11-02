# Inventory Items Backend Logic

This folder contains all the backend logic for the inventory items management system, organized into separate modules for better maintainability and reusability.

## Files Structure

### `inventoryService.ts`
**Core Firebase service functions for inventory management**

**Interfaces:**
- `InventoryItem` - Inventory item data structure
- `StockTransaction` - Stock transaction structure  
- `InventoryStats` - Inventory statistics structure
- `InventoryFilters` - Filter parameters structure

**Functions:**
- `fetchInventoryItems()` - Fetch all inventory items from Firebase
- `calculateInventoryStats()` - Calculate statistics from inventory data
- `filterInventoryItems()` - Filter items based on search/category/stock status
- `getInventoryFilterOptions()` - Get filter options with real counts
- `updateItemStock()` - Update item stock quantity
- `addInventoryItem()` - Add new inventory item to Firebase
- `updateInventoryItem()` - Update existing inventory item
- `deleteInventoryItem()` - Delete inventory item from Firebase
- `getLowStockItems()` - Get items with low stock levels
- `getItemsByCategory()` - Get items filtered by category

### `useInventoryManagement.ts`
**Custom React hook for inventory management**

**Returns:**
- `items` - All inventory items from Firebase
- `filteredItems` - Filtered items based on current filters
- `inventoryStats` - Calculated inventory statistics
- `filterOptions` - Dynamic filter options with counts
- `loading` - Loading state
- `error` - Error state
- `filters` - Current filter values
- `setFilters()` - Update filters
- `refreshItems()` - Refresh inventory data
- `updateStock()` - Update item stock
- `addItem()` - Add new inventory item
- `updateItem()` - Update existing item
- `deleteItem()` - Delete inventory item

### `index.ts`
**Barrel export file for easy imports**

## Usage Example

```tsx
import { useInventoryManagement } from './items-backendLogic';

const ItemsPage = () => {
  const {
    filteredItems,
    inventoryStats,
    filterOptions,
    loading,
    error,
    filters,
    setFilters,
    updateStock,
    addItem,
    updateItem,
    deleteItem
  } = useInventoryManagement();

  return (
    <div>
      <ItemsStats stats={inventoryStats} loading={loading} />
      <ItemsFilters 
        {...filters}
        {...filterOptions}
        onSearchChange={(term) => setFilters({ searchTerm: term })}
      />
      <ItemsTable items={filteredItems} loading={loading} error={error} />
    </div>
  );
};
```

## Key Features

1. **Firebase Integration**: Direct connection to `inventory_items` collection
2. **Real-time Data**: Live statistics and item counts
3. **Advanced Filtering**: Search, category, stock status, and sorting
4. **CRUD Operations**: Complete Create, Read, Update, Delete functionality
5. **Stock Management**: Track stock levels and low stock alerts
6. **Error Handling**: Comprehensive error states and recovery
7. **Type Safety**: Full TypeScript support
8. **Performance**: Optimized data fetching and state management

## Data Flow

1. `useInventoryManagement` hook fetches items from Firebase
2. Items are processed and statistics calculated
3. Filter options are generated with real counts
4. Items are filtered based on current filter state
5. Components receive processed data via props
6. CRUD operations update both Firebase and local state

## Filter System

### Search Filter
- Item name, description, category, supplier, or ID
- Real-time search with instant results

### Category Filter
- All Categories, Housekeeping, Food & Beverage, etc.
- Dynamic categories based on actual data

### Stock Status Filter
- All Items, In Stock, Low Stock, Out of Stock
- Real-time counts for each status

### Sorting Options
- Name, Category, Stock Level, Value, Last Restocked
- Ascending or descending order

## Benefits

- **Separation of Concerns**: UI components focus on presentation
- **Reusability**: Backend logic can be used across components
- **Maintainability**: Centralized data management
- **Testing**: Easy to unit test business logic
- **Performance**: Optimized data processing and caching
- **Real-time Updates**: Immediate UI updates with optimistic updates
