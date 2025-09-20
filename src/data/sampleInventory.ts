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

export const sampleInventory: InventoryItem[] = [
  // Housekeeping Supplies
  {
    id: 'INV001',
    name: 'Bath Towels',
    category: 'Housekeeping',
    description: 'Premium cotton bath towels, white',
    currentStock: 45,
    reorderLevel: 20,
    unitPrice: 350,
    supplier: 'Textile Solutions Inc.',
    lastRestocked: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300',
    unit: 'pieces',
    location: 'Housekeeping Storage',
  },
  {
    id: 'INV002',
    name: 'Hand Towels',
    category: 'Housekeeping',
    description: 'Premium cotton hand towels, white',
    currentStock: 8,
    reorderLevel: 15,
    unitPrice: 180,
    supplier: 'Textile Solutions Inc.',
    lastRestocked: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300',
    unit: 'pieces',
    location: 'Housekeeping Storage',
  },
  {
    id: 'INV003',
    name: 'Bed Sheets (Queen)',
    category: 'Housekeeping',
    description: 'Egyptian cotton bed sheets, white, queen size',
    currentStock: 25,
    reorderLevel: 12,
    unitPrice: 1200,
    supplier: 'Luxury Linens Co.',
    lastRestocked: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=300',
    unit: 'sets',
    location: 'Housekeeping Storage',
  },
  {
    id: 'INV004',
    name: 'Pillowcases',
    category: 'Housekeeping',
    description: 'Egyptian cotton pillowcases, white',
    currentStock: 60,
    reorderLevel: 30,
    unitPrice: 250,
    supplier: 'Luxury Linens Co.',
    lastRestocked: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=300',
    unit: 'pieces',
    location: 'Housekeeping Storage',
  },
  {
    id: 'INV005',
    name: 'Toilet Paper',
    category: 'Housekeeping',
    description: '3-ply premium toilet paper rolls',
    currentStock: 120,
    reorderLevel: 50,
    unitPrice: 45,
    supplier: 'Hygiene Supplies Ltd.',
    lastRestocked: '2024-01-18',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300',
    unit: 'rolls',
    location: 'Housekeeping Storage',
  },

  // Amenities
  {
    id: 'INV006',
    name: 'Shampoo Bottles',
    category: 'Amenities',
    description: 'Hotel branded shampoo, 30ml bottles',
    currentStock: 85,
    reorderLevel: 40,
    unitPrice: 25,
    supplier: 'Hotel Amenities Co.',
    lastRestocked: '2024-01-16',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300',
    unit: 'bottles',
    location: 'Amenities Storage',
  },
  {
    id: 'INV007',
    name: 'Conditioner Bottles',
    category: 'Amenities',
    description: 'Hotel branded conditioner, 30ml bottles',
    currentStock: 78,
    reorderLevel: 40,
    unitPrice: 25,
    supplier: 'Hotel Amenities Co.',
    lastRestocked: '2024-01-16',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300',
    unit: 'bottles',
    location: 'Amenities Storage',
  },
  {
    id: 'INV008',
    name: 'Body Soap',
    category: 'Amenities',
    description: 'Hotel branded body soap bars, 40g',
    currentStock: 95,
    reorderLevel: 50,
    unitPrice: 15,
    supplier: 'Hotel Amenities Co.',
    lastRestocked: '2024-01-16',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300',
    unit: 'bars',
    location: 'Amenities Storage',
  },
  {
    id: 'INV009',
    name: 'Slippers',
    category: 'Amenities',
    description: 'Disposable hotel slippers, one size fits all',
    currentStock: 150,
    reorderLevel: 75,
    unitPrice: 35,
    supplier: 'Comfort Items Inc.',
    lastRestocked: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300',
    unit: 'pairs',
    location: 'Amenities Storage',
  },

  // Food & Beverage
  {
    id: 'INV010',
    name: 'Coffee Sachets',
    category: 'Food & Beverage',
    description: 'Premium instant coffee sachets, 3-in-1',
    currentStock: 200,
    reorderLevel: 100,
    unitPrice: 8,
    supplier: 'Beverage Supplies Co.',
    lastRestocked: '2024-01-17',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
    unit: 'sachets',
    location: 'F&B Storage',
  },
  {
    id: 'INV011',
    name: 'Tea Bags',
    category: 'Food & Beverage',
    description: 'Assorted tea bags (English Breakfast, Earl Grey)',
    currentStock: 180,
    reorderLevel: 80,
    unitPrice: 12,
    supplier: 'Beverage Supplies Co.',
    lastRestocked: '2024-01-17',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
    unit: 'bags',
    location: 'F&B Storage',
  },
  {
    id: 'INV012',
    name: 'Bottled Water',
    category: 'Food & Beverage',
    description: 'Complimentary bottled water, 500ml',
    currentStock: 240,
    reorderLevel: 120,
    unitPrice: 20,
    supplier: 'Pure Water Co.',
    lastRestocked: '2024-01-19',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
    unit: 'bottles',
    location: 'F&B Storage',
  },

  // Maintenance
  {
    id: 'INV013',
    name: 'Light Bulbs (LED)',
    category: 'Maintenance',
    description: 'LED light bulbs, 9W, warm white',
    currentStock: 35,
    reorderLevel: 20,
    unitPrice: 150,
    supplier: 'Electrical Supplies Ltd.',
    lastRestocked: '2024-01-11',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300',
    unit: 'pieces',
    location: 'Maintenance Storage',
  },
  {
    id: 'INV014',
    name: 'Air Fresheners',
    category: 'Maintenance',
    description: 'Room air fresheners, lavender scent',
    currentStock: 28,
    reorderLevel: 15,
    unitPrice: 85,
    supplier: 'Cleaning Supplies Co.',
    lastRestocked: '2024-01-13',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300',
    unit: 'bottles',
    location: 'Maintenance Storage',
  },
  {
    id: 'INV015',
    name: 'Cleaning Detergent',
    category: 'Maintenance',
    description: 'Multi-purpose cleaning detergent, 1L',
    currentStock: 12,
    reorderLevel: 8,
    unitPrice: 120,
    supplier: 'Cleaning Supplies Co.',
    lastRestocked: '2024-01-08',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300',
    unit: 'bottles',
    location: 'Maintenance Storage',
  },
];

export const sampleTransactions: StockTransaction[] = [
  {
    id: 'TXN001',
    itemId: 'INV002',
    itemName: 'Hand Towels',
    type: 'stock-out',
    quantity: -12,
    reason: 'Room service usage',
    performedBy: 'Maria Santos',
    timestamp: '2024-01-19T10:30:00Z',
    notes: 'Distributed to housekeeping for room 201-205',
  },
  {
    id: 'TXN002',
    itemId: 'INV012',
    itemName: 'Bottled Water',
    type: 'stock-in',
    quantity: 120,
    reason: 'New delivery',
    performedBy: 'John Dela Cruz',
    timestamp: '2024-01-19T08:15:00Z',
    notes: 'Weekly delivery from Pure Water Co.',
  },
  {
    id: 'TXN003',
    itemId: 'INV001',
    itemName: 'Bath Towels',
    type: 'stock-out',
    quantity: -8,
    reason: 'Room service usage',
    performedBy: 'Anna Reyes',
    timestamp: '2024-01-19T14:20:00Z',
    notes: 'Replacement for damaged towels',
  },
  {
    id: 'TXN004',
    itemId: 'INV015',
    itemName: 'Cleaning Detergent',
    type: 'stock-out',
    quantity: -3,
    reason: 'Maintenance usage',
    performedBy: 'Robert Garcia',
    timestamp: '2024-01-18T16:45:00Z',
    notes: 'Deep cleaning of lobby area',
  },
  {
    id: 'TXN005',
    itemId: 'INV010',
    itemName: 'Coffee Sachets',
    type: 'stock-out',
    quantity: -25,
    reason: 'Room restocking',
    performedBy: 'Lisa Mendoza',
    timestamp: '2024-01-18T11:30:00Z',
    notes: 'Restocked all occupied rooms',
  },
  {
    id: 'TXN006',
    itemId: 'INV013',
    itemName: 'Light Bulbs (LED)',
    type: 'stock-out',
    quantity: -5,
    reason: 'Maintenance replacement',
    performedBy: 'Michael Torres',
    timestamp: '2024-01-17T09:15:00Z',
    notes: 'Replaced burnt bulbs in corridor',
  },
  {
    id: 'TXN007',
    itemId: 'INV006',
    itemName: 'Shampoo Bottles',
    type: 'adjustment',
    quantity: -2,
    reason: 'Inventory correction',
    performedBy: 'Sarah Villanueva',
    timestamp: '2024-01-17T15:00:00Z',
    notes: 'Found 2 damaged bottles during audit',
  },
  {
    id: 'TXN008',
    itemId: 'INV005',
    itemName: 'Toilet Paper',
    type: 'stock-in',
    quantity: 48,
    reason: 'New delivery',
    performedBy: 'David Ramos',
    timestamp: '2024-01-18T07:30:00Z',
    notes: 'Monthly delivery from Hygiene Supplies Ltd.',
  },
];

export const getItemsByCategory = (category: string) => {
  return sampleInventory.filter(item => item.category === category);
};

export const getLowStockItems = () => {
  return sampleInventory.filter(item => item.currentStock <= item.reorderLevel);
};

export const getItemById = (id: string) => {
  return sampleInventory.find(item => item.id === id);
};

export const getTransactionsByItemId = (itemId: string) => {
  return sampleTransactions.filter(transaction => transaction.itemId === itemId);
};

export const categories = [
  'Housekeeping',
  'Amenities',
  'Food & Beverage',
  'Maintenance',
];
