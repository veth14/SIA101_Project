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
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Light Premium Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white via-heritage-green/5 to-heritage-light/10 rounded-3xl shadow-xl border border-heritage-green/20">
          {/* Light Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-transparent to-heritage-neutral/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-heritage-light/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-heritage-green/5 rounded-full animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-heritage-green/10 rounded-full animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-xl border border-heritage-green/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-heritage-light rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-heritage-green drop-shadow-sm">
                    Inventory Management
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Manage hotel inventory and stock levels
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className="bg-gradient-to-br from-white/90 to-heritage-green/5 backdrop-blur-xl rounded-3xl p-8 border border-heritage-green/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-heritage-light rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <p className="text-4xl font-black bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent drop-shadow-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-1 h-1 bg-heritage-green rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-heritage-neutral rounded-full animate-ping delay-75"></div>
                      <div className="w-1 h-1 bg-heritage-light rounded-full animate-ping delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Export functionality
              console.log('Export inventory data');
            }}
            className="bg-white/90 text-heritage-green border-2 border-heritage-green/30 px-6 py-3 rounded-xl hover:bg-heritage-green/5 hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Export CSV
          </button>
          <button
            onClick={handleAddItem}
            className="bg-gradient-to-r from-heritage-green to-heritage-neutral text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
              <span className="text-blue-600 text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Items</p>
              <p className="text-3xl font-black text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-lg">
              <span className="text-yellow-600 text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Low Stock Items</p>
              <p className="text-3xl font-black text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg">
              <span className="text-green-600 text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Value</p>
              <p className="text-3xl font-black text-gray-900">₱{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl shadow-lg">
              <span className="text-purple-600 text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Categories</p>
              <p className="text-3xl font-black text-gray-900">{categories.length}</p>
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
    </div>
  );
};
