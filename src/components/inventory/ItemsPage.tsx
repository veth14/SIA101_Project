import { useState } from 'react';
import { DataTable } from '../admin/DataTable';
import { SearchInput } from '../admin/SearchInput';
import { Modal } from '../admin/Modal';
import { ConfirmDialog } from '../admin/ConfirmDialog';
import { ItemForm } from './ItemForm';
import { sampleInventory, getLowStockItems, getItemsByCategory, categories, type InventoryItem } from '../../data/sampleInventory';

export const ItemsPage = () => {
  const [items, setItems] = useState<InventoryItem[]>(sampleInventory);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(sampleInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterItems(query, categoryFilter, stockFilter);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    filterItems(searchQuery, category, stockFilter);
  };

  const handleStockFilter = (filter: string) => {
    setStockFilter(filter);
    filterItems(searchQuery, categoryFilter, filter);
  };

  const filterItems = (query: string, category: string, stock: string) => {
    let filtered = items;

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.supplier.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter((item) => item.category === category);
    }

    // Stock filter
    if (stock === 'low') {
      filtered = filtered.filter((item) => item.currentStock <= item.reorderLevel);
    } else if (stock === 'out') {
      filtered = filtered.filter((item) => item.currentStock === 0);
    }

    setFilteredItems(filtered);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      filterItems(searchQuery, categoryFilter, stockFilter);
      setItemToDelete(null);
    }
  };

  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    if (selectedItem) {
      // Edit existing item
      setItems(prev =>
        prev.map(item =>
          item.id === selectedItem.id
            ? { ...item, ...itemData }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: `INV${Date.now().toString().slice(-6)}`,
        name: itemData.name || '',
        category: itemData.category || '',
        description: itemData.description || '',
        currentStock: itemData.currentStock || 0,
        reorderLevel: itemData.reorderLevel || 0,
        unitPrice: itemData.unitPrice || 0,
        supplier: itemData.supplier || '',
        lastRestocked: itemData.lastRestocked || new Date().toISOString().split('T')[0],
        image: itemData.image,
        unit: itemData.unit || 'pcs',
        location: itemData.location || '',
      };
      setItems(prev => [...prev, newItem]);
    }
    filterItems(searchQuery, categoryFilter, stockFilter);
    setShowItemForm(false);
    setSelectedItem(null);
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value: string, row: InventoryItem) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {value ? (
            <img src={value} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-xs">📦</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Item Name',
      sortable: true,
      render: (value: string, row: InventoryItem) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-heritage-light text-heritage-green">
          {value}
        </span>
      ),
    },
    {
      key: 'currentStock',
      label: 'Stock',
      sortable: true,
      render: (value: number, row: InventoryItem) => {
        const isLow = value <= row.reorderLevel;
        const isOut = value === 0;
        return (
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${isOut ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-gray-900'}`}>
              {value}
            </span>
            <span className="text-sm text-gray-500">{row.unit}</span>
            {isLow && (
              <span className="text-xs px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                {isOut ? 'OUT' : 'LOW'}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'reorderLevel',
      label: 'Reorder Level',
      render: (value: number, row: InventoryItem) => `${value} ${row.unit}`,
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      sortable: true,
      render: (value: number) => `₱${value.toLocaleString()}`,
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      render: (value: any, row: InventoryItem) => `₱${(row.currentStock * row.unitPrice).toLocaleString()}`,
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (value: string) => (
        <div className="text-sm text-gray-600 max-w-32 truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'lastRestocked',
      label: 'Last Restocked',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const getActions = (item: InventoryItem) => (
    <div className="flex space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditItem(item);
        }}
        className="text-heritage-green hover:text-heritage-green/80 text-sm font-medium"
      >
        Edit
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteItem(item);
        }}
        className="text-red-600 hover:text-red-900 text-sm font-medium"
      >
        Delete
      </button>
    </div>
  );

  const lowStockItems = getLowStockItems();
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage hotel inventory and stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Export functionality
              console.log('Export inventory data');
            }}
            className="bg-white text-heritage-green border border-heritage-green px-4 py-2 rounded-md hover:bg-heritage-light transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={handleAddItem}
            className="bg-heritage-green text-white px-4 py-2 rounded-md hover:bg-heritage-green/90 transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">💰</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₱{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
              <p className="text-sm text-yellow-700">
                {lowStockItems.length} items are running low on stock and need to be reordered.
              </p>
            </div>
            <button className="ml-auto text-sm text-yellow-800 hover:text-yellow-900 font-medium">
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by item name, description, or supplier..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => handleStockFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <DataTable
        columns={columns}
        data={filteredItems}
        actions={getActions}
        onRowClick={(item) => {
          console.log('Selected item:', item);
        }}
      />

      {/* Item Form Modal */}
      {showItemForm && (
        <ItemForm
          isOpen={showItemForm}
          onClose={() => {
            setShowItemForm(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onSave={handleSaveItem}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};
