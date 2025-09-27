import React, { useState } from 'react';
import InventoryItemsHeader from './InventoryItemsHeader';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

const InventoryItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sample inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: 'INV001',
      name: 'Bed Sheets (Queen)',
      category: 'Linens',
      quantity: 45,
      minStock: 20,
      unit: 'pieces',
      price: 1200,
      supplier: 'Hotel Linens Co.',
      location: 'Storage Room A',
      status: 'in-stock',
      lastUpdated: '2024-09-20'
    },
    {
      id: 'INV002',
      name: 'Towels (Bath)',
      category: 'Linens',
      quantity: 15,
      minStock: 25,
      unit: 'pieces',
      price: 450,
      supplier: 'Hotel Linens Co.',
      location: 'Storage Room A',
      status: 'low-stock',
      lastUpdated: '2024-09-19'
    },
    {
      id: 'INV003',
      name: 'Toilet Paper',
      category: 'Amenities',
      quantity: 0,
      minStock: 50,
      unit: 'rolls',
      price: 35,
      supplier: 'Cleaning Supplies Inc.',
      location: 'Storage Room B',
      status: 'out-of-stock',
      lastUpdated: '2024-09-18'
    },
    {
      id: 'INV004',
      name: 'Shampoo Bottles',
      category: 'Amenities',
      quantity: 120,
      minStock: 30,
      unit: 'bottles',
      price: 85,
      supplier: 'Hotel Amenities Ltd.',
      location: 'Storage Room B',
      status: 'in-stock',
      lastUpdated: '2024-09-20'
    },
    {
      id: 'INV005',
      name: 'Coffee Beans',
      category: 'Food & Beverage',
      quantity: 8,
      minStock: 10,
      unit: 'kg',
      price: 650,
      supplier: 'Premium Coffee Co.',
      location: 'Kitchen Storage',
      status: 'low-stock',
      lastUpdated: '2024-09-19'
    },
    {
      id: 'INV006',
      name: 'Cleaning Spray',
      category: 'Cleaning',
      quantity: 25,
      minStock: 15,
      unit: 'bottles',
      price: 120,
      supplier: 'Cleaning Supplies Inc.',
      location: 'Housekeeping',
      status: 'in-stock',
      lastUpdated: '2024-09-20'
    }
  ];

  const categories = ['all', ...Array.from(new Set(inventoryItems.map(item => item.category)))];
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'in-stock': { bg: 'bg-green-100', text: 'text-green-800', label: 'In Stock' },
      'low-stock': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Low Stock' },
      'out-of-stock': { bg: 'bg-red-100', text: 'text-red-800', label: 'Out of Stock' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['in-stock'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <InventoryItemsHeader />

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by item name, category, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              
              <button className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium">
                Add New Item
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">ID: {item.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity} {item.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.minStock} {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-heritage-green hover:text-heritage-green/80 transition-colors">
                          Edit
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryItemsPage;
