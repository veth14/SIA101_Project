import { collection, getDocs, query, orderBy, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

export interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  basePrice: number;
  maxGuests: number;
  amenities: string[];
  features: string[];
  guest?: string;
  checkIn?: string;
  checkOut?: string;
  floor?: number;
  roomSize?: string;
  description?: string;
}

export interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  cleaningRooms: number;
  occupancyRate: number;
}

export interface RoomFilters {
  searchTerm: string;
  statusFilter: string;
  roomTypeFilter: string;
}

/**
 * Fetch all rooms from Firebase with sorting (available first)
 * OPTIMIZED: Cache results for 2 minutes to reduce Firestore reads
 */
let roomsCache: { data: Room[]; timestamp: number } | null = null;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export const fetchRooms = async (forceRefresh = false): Promise<Room[]> => {
  try {
    // Return cached data if still valid
    if (!forceRefresh && roomsCache !== null && (Date.now() - roomsCache.timestamp) < CACHE_TTL) {
      console.log('📦 Using cached rooms data');
      return roomsCache.data;
    }
    
    console.log('🔄 Fetching rooms from Firebase...');
    
    const roomsQuery = query(
      collection(db, 'rooms'),
      orderBy('roomNumber', 'asc')
    );
    
    const querySnapshot = await getDocs(roomsQuery);
    const roomsData: Room[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      roomsData.push({
        id: doc.id,
        roomNumber: data.roomNumber || '',
        roomType: data.roomType || data.type || '',
        status: data.status || 'available',
        basePrice: data.basePrice || data.price || 0,
        maxGuests: data.maxGuests || 2,
        amenities: data.amenities || [],
        features: data.features || data.amenities || [],
        guest: data.guest || undefined,
        checkIn: data.checkIn || undefined,
        checkOut: data.checkOut || undefined,
        floor: data.floor || undefined,
        roomSize: data.roomSize || undefined,
        description: data.description || undefined
      });
    });
    
    // Sort rooms: available first, then by room number
    const sortedRooms = roomsData.sort((a, b) => {
      // Available rooms first
      if (a.status === 'available' && b.status !== 'available') return -1;
      if (a.status !== 'available' && b.status === 'available') return 1;
      
      // Then sort by room number
      return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
    });
    
    // Cache the results
    roomsCache = { data: sortedRooms, timestamp: Date.now() };
    
    console.log(`✅ Loaded ${sortedRooms.length} rooms from Firebase`);
    return sortedRooms;
    
  } catch (error) {
    console.error('❌ Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms from database');
  }
};

/**
 * Calculate room statistics from room data
 */
export const calculateRoomStats = (rooms: Room[]): RoomStats => {
  const stats = {
    totalRooms: rooms.length,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    cleaningRooms: 0,
    occupancyRate: 0
  };

  rooms.forEach(room => {
    switch (room.status) {
      case 'available':
        stats.availableRooms++;
        break;
      case 'occupied':
        stats.occupiedRooms++;
        break;
      case 'maintenance':
        stats.maintenanceRooms++;
        break;
      case 'cleaning':
        stats.cleaningRooms++;
        break;
    }
  });

  stats.occupancyRate = stats.totalRooms > 0 
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) 
    : 0;

  return stats;
};

/**
 * Filter rooms based on search term, status, and room type
 */
export const filterRooms = (rooms: Room[], filters: RoomFilters): Room[] => {
  return rooms.filter(room => {
    const matchesSearch = filters.searchTerm === '' || 
      room.roomNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      room.roomType.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      room.guest?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.statusFilter === 'all' || room.status === filters.statusFilter;
    
    // Improved room type matching
    const matchesType = filters.roomTypeFilter === 'all' || 
      room.roomType.toLowerCase().includes(filters.roomTypeFilter.toLowerCase()) ||
      (filters.roomTypeFilter === 'standard' && room.roomType.toLowerCase().includes('standard')) ||
      (filters.roomTypeFilter === 'deluxe' && room.roomType.toLowerCase().includes('deluxe')) ||
      (filters.roomTypeFilter === 'suite' && room.roomType.toLowerCase().includes('suite')) ||
      (filters.roomTypeFilter === 'family' && room.roomType.toLowerCase().includes('family'));
    
    return matchesSearch && matchesStatus && matchesType;
  });
};

/**
 * Get filter options with counts from actual room data
 */
export const getFilterOptions = (rooms: Room[]) => {
  const statusCounts = {
    all: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length
  };

  const roomTypes = [...new Set(rooms.map(room => room.roomType))];

  const statusOptions = [
    { value: 'all', label: 'All Status', count: statusCounts.all },
    { value: 'available', label: 'Available', count: statusCounts.available },
    { value: 'occupied', label: 'Occupied', count: statusCounts.occupied },
    { value: 'maintenance', label: 'Maintenance', count: statusCounts.maintenance },
    { value: 'cleaning', label: 'Cleaning', count: statusCounts.cleaning }
  ];

  const roomTypeOptions = [
    { value: 'all', label: 'All Room Types' },
    ...roomTypes.map(type => ({
      value: type.toLowerCase(),
      label: type
    }))
  ];

  return { statusOptions, roomTypeOptions };
};

/**
 * Update room status
 */
export const updateRoomStatus = async (roomId: string, status: Room['status']): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, { status });
    console.log(`✅ Updated room ${roomId} status to ${status}`);
  } catch (error) {
    console.error('❌ Error updating room status:', error);
    throw new Error('Failed to update room status');
  }
};

/**
 * Add new room
 */
export const addRoom = async (roomData: Omit<Room, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'rooms'), {
      ...roomData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Added new room with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding room:', error);
    throw new Error('Failed to add new room');
  }
};

/**
 * Delete room
 */
export const deleteRoom = async (roomId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'rooms', roomId));
    console.log(`✅ Deleted room ${roomId}`);
  } catch (error) {
    console.error('❌ Error deleting room:', error);
    throw new Error('Failed to delete room');
  }
};
