# Room Management Backend Logic

This folder contains all the backend logic for the room management system, organized into separate modules for better maintainability and reusability.

## Files Structure

### `roomService.ts`
**Core Firebase service functions for room management**

**Interfaces:**
- `Room` - Room data structure
- `RoomStats` - Room statistics structure  
- `RoomFilters` - Filter parameters structure

**Functions:**
- `fetchRooms()` - Fetch all rooms from Firebase (sorted: available first)
- `calculateRoomStats()` - Calculate statistics from room data
- `filterRooms()` - Filter rooms based on search/status/type
- `getFilterOptions()` - Get filter options with real counts
- `updateRoomStatus()` - Update room status in Firebase
- `addRoom()` - Add new room to Firebase
- `deleteRoom()` - Delete room from Firebase

### `useRoomManagement.ts`
**Custom React hook for room management**

**Returns:**
- `rooms` - All rooms from Firebase
- `filteredRooms` - Filtered rooms based on current filters
- `roomStats` - Calculated room statistics
- `filterOptions` - Dynamic filter options with counts
- `loading` - Loading state
- `error` - Error state
- `filters` - Current filter values
- `setFilters()` - Update filters
- `refreshRooms()` - Refresh room data
- `updateStatus()` - Update room status

### `index.ts`
**Barrel export file for easy imports**

## Usage Example

```tsx
import { useRoomManagement } from './Room-backendLogic';

const RoomManagementPage = () => {
  const {
    filteredRooms,
    roomStats,
    filterOptions,
    loading,
    error,
    filters,
    setFilters
  } = useRoomManagement();

  return (
    <div>
      <RoomStats roomStats={roomStats} loading={loading} />
      <RoomFilters 
        {...filters}
        {...filterOptions}
        onSearchChange={(term) => setFilters({ searchTerm: term })}
      />
      <RoomGrid rooms={filteredRooms} loading={loading} error={error} />
    </div>
  );
};
```

## Key Features

1. **Firebase Integration**: Direct connection to `rooms` collection
2. **Real-time Data**: Live statistics and room counts
3. **Smart Sorting**: Available rooms appear first
4. **Dynamic Filtering**: Real-time filter options with counts
5. **Error Handling**: Comprehensive error states
6. **Type Safety**: Full TypeScript support
7. **Performance**: Optimized data fetching and state management

## Data Flow

1. `useRoomManagement` hook fetches rooms from Firebase
2. Rooms are sorted (available first, then by room number)
3. Statistics are calculated from room data
4. Filter options are generated with real counts
5. Rooms are filtered based on current filter state
6. Components receive processed data via props

## Benefits

- **Separation of Concerns**: UI components focus on presentation
- **Reusability**: Backend logic can be used across components
- **Maintainability**: Centralized data management
- **Testing**: Easy to unit test business logic
- **Performance**: Optimized data processing and caching
