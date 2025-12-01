import { collection, getDocs, query, orderBy, doc, updateDoc, addDoc, deleteDoc, where, Timestamp, onSnapshot } from 'firebase/firestore';

import { db } from '../../../../config/firebase';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  image?: string;
  unit: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'stock-in' | 'stock-out' | 'adjustment';
  quantity: number;
  reason: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: string[];
  recentTransactions: StockTransaction[];
}

export interface InventoryFilters {
  searchTerm: string;
  selectedCategory: string;
  stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  sortBy: 'name' | 'category' | 'stock' | 'value' | 'lastRestocked';
  sortOrder: 'asc' | 'desc';
}

/**
 * Fetch all inventory items from Firebase
 * OPTIMIZED: Cache results for 5 minutes to reduce Firestore reads
 */
let inventoryCache: { data: InventoryItem[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const normalizeDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

const mapInventorySnapshot = (snapshot: any): InventoryItem[] => {
  const inventoryData: InventoryItem[] = [];

  snapshot.forEach((doc: any) => {
    const data = doc.data();

    inventoryData.push({
      id: doc.id,
      name: data.name || '',
      category: data.category || '',
      description: data.description || '',
      currentStock: data.currentStock || 0,
      reorderLevel: data.reorderLevel || 0,
      unitPrice: data.unitPrice || 0,
      supplier: data.supplier || '',
      lastRestocked: data.lastRestocked || '',
      image: data.image || undefined,
      unit: data.unit || 'pieces',
      location: data.location || '',
      createdAt: normalizeDate(data.createdAt),
      updatedAt: normalizeDate(data.updatedAt)
    });
  });

  return inventoryData;
};

export const fetchInventoryItems = async (forceRefresh = false): Promise<InventoryItem[]> => {
  try {
    // Return cached data if still valid
    if (!forceRefresh && inventoryCache !== null && (Date.now() - inventoryCache.timestamp) < CACHE_TTL) {
      console.log('📦 Using cached inventory data');
      return inventoryCache.data;
    }

    console.log('🔄 Fetching inventory items from Firebase...');

    const inventoryQuery = query(
      collection(db, 'inventory_items'),
      orderBy('name', 'asc')
    );

    const querySnapshot = await getDocs(inventoryQuery);
    const inventoryData = mapInventorySnapshot(querySnapshot);

    // Cache the results
    inventoryCache = { data: inventoryData, timestamp: Date.now() };

    console.log(`✅ Loaded ${inventoryData.length} inventory items from Firebase`);
    return inventoryData;

  } catch (error) {
    console.error('❌ Error fetching inventory items:', error);
    throw new Error('Failed to fetch inventory items from database');
  }
};

/**
 * Subscribe to real-time inventory updates using Firestore onSnapshot.
 * Keeps the shared cache in sync and pushes updates to the provided callback.
 */
export const subscribeToInventoryItems = (
  onItems: (items: InventoryItem[]) => void,
  onError?: (error: Error) => void
): () => void => {
  const inventoryQuery = query(
    collection(db, 'inventory_items'),
    orderBy('name', 'asc')
  );

  const unsubscribe = onSnapshot(
    inventoryQuery,
    (snapshot) => {
      const inventoryData = mapInventorySnapshot(snapshot);
      // Update cache so other consumers can use it without extra reads
      inventoryCache = { data: inventoryData, timestamp: Date.now() };
      onItems(inventoryData);
    },
    (error) => {
      console.error('❌ Error in inventory snapshot listener:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  );

  return unsubscribe;
};

/**
 * Calculate inventory statistics from items data
 */
export const calculateInventoryStats = (items: InventoryItem[]): InventoryStats => {
  const stats: InventoryStats = {
    totalItems: items.length,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    categories: [],
    recentTransactions: []
  };

  // Calculate totals and stock status
  items.forEach(item => {
    stats.totalValue += item.currentStock * item.unitPrice;
    
    if (item.currentStock === 0) {
      stats.outOfStockItems++;
    } else if (item.currentStock <= item.reorderLevel) {
      stats.lowStockItems++;
    }
  });

  // Get unique categories
  stats.categories = [...new Set(items.map(item => item.category))].sort();

  return stats;
};

/**
 * Filter inventory items based on search term, category, and stock status
 */
export const filterInventoryItems = (items: InventoryItem[], filters: InventoryFilters): InventoryItem[] => {
  const filteredItems = items.filter(item => {
    // Search filter
    const matchesSearch = filters.searchTerm === '' || 
      item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filters.selectedCategory === 'All Categories' || 
      item.category === filters.selectedCategory;
    
    // Stock status filter
    let matchesStockStatus = true;
    switch (filters.stockStatus) {
      case 'in-stock':
        matchesStockStatus = item.currentStock > item.reorderLevel;
        break;
      case 'low-stock':
        matchesStockStatus = item.currentStock > 0 && item.currentStock <= item.reorderLevel;
        break;
      case 'out-of-stock':
        matchesStockStatus = item.currentStock === 0;
        break;
      default:
        matchesStockStatus = true;
    }
    
    return matchesSearch && matchesCategory && matchesStockStatus;
  });

  // Sort items
  filteredItems.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'stock':
        comparison = a.currentStock - b.currentStock;
        break;
      case 'value':
        comparison = (a.currentStock * a.unitPrice) - (b.currentStock * b.unitPrice);
        break;
      case 'lastRestocked':
        comparison = new Date(a.lastRestocked).getTime() - new Date(b.lastRestocked).getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  return filteredItems;
};

/**
 * Get filter options with counts from actual inventory data
 */
export const getInventoryFilterOptions = (items: InventoryItem[]) => {
  const categories = ['All Categories', ...new Set(items.map(item => item.category))].sort();
  
  const stockStatusCounts = {
    all: items.length,
    'in-stock': items.filter(item => item.currentStock > item.reorderLevel).length,
    'low-stock': items.filter(item => item.currentStock > 0 && item.currentStock <= item.reorderLevel).length,
    'out-of-stock': items.filter(item => item.currentStock === 0).length
  };

  const categoryOptions = categories.map(category => ({
    value: category,
    label: category,
    count: category === 'All Categories' 
      ? items.length 
      : items.filter(item => item.category === category).length
  }));

  const stockStatusOptions = [
    { value: 'all', label: 'All Items', count: stockStatusCounts.all },
    { value: 'in-stock', label: 'In Stock', count: stockStatusCounts['in-stock'] },
    { value: 'low-stock', label: 'Low Stock', count: stockStatusCounts['low-stock'] },
    { value: 'out-of-stock', label: 'Out of Stock', count: stockStatusCounts['out-of-stock'] }
  ];

  return { categoryOptions, stockStatusOptions };
};

/**
 * Update inventory item stock
 */
export const updateItemStock = async (itemId: string, newStock: number): Promise<void> => {
  try {
    const itemRef = doc(db, 'inventory_items', itemId);
    await updateDoc(itemRef, { 
      currentStock: newStock,
      updatedAt: new Date()
    });
    console.log(`✅ Updated item ${itemId} stock to ${newStock}`);
  } catch (error) {
    console.error('❌ Error updating item stock:', error);
    throw new Error('Failed to update item stock');
  }
};

/**
 * Add new inventory item
 */
export const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'inventory_items'), {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Added new inventory item with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding inventory item:', error);
    throw new Error('Failed to add new inventory item');
  }
};

/**
 * Update inventory item
 */
export const updateInventoryItem = async (itemId: string, itemData: Partial<InventoryItem>): Promise<void> => {
  try {
    const itemRef = doc(db, 'inventory_items', itemId);
    await updateDoc(itemRef, {
      ...itemData,
      updatedAt: new Date()
    });
    console.log(`✅ Updated inventory item ${itemId}`);
  } catch (error) {
    console.error('❌ Error updating inventory item:', error);
    throw new Error('Failed to update inventory item');
  }
};

/**
 * Delete inventory item
 */
export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'inventory_items', itemId));
    console.log(`✅ Deleted inventory item ${itemId}`);
  } catch (error) {
    console.error('❌ Error deleting inventory item:', error);
    throw new Error('Failed to delete inventory item');
  }
};

/**
 * Get low stock items
 */
export const getLowStockItems = async (): Promise<InventoryItem[]> => {
  try {
    const items = await fetchInventoryItems();
    return items.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0);
  } catch (error) {
    console.error('❌ Error fetching low stock items:', error);
    throw new Error('Failed to fetch low stock items');
  }
};

/**
 * Get items by category
 */
export const getItemsByCategory = async (category: string): Promise<InventoryItem[]> => {
  try {
    const inventoryQuery = query(
      collection(db, 'inventory_items'),
      where('category', '==', category),
      orderBy('name', 'asc')
    );
    
    const querySnapshot = await getDocs(inventoryQuery);
    const items: InventoryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data
      } as InventoryItem);
    });
    
    return items;
  } catch (error) {
    console.error('❌ Error fetching items by category:', error);
    throw new Error('Failed to fetch items by category');
  }
};