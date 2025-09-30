import React, { useMemo } from 'react';
import type { InventoryItem } from '../../../data/sampleInventory';

interface ItemsTableProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  items: InventoryItem[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const ItemsTableContainer: React.FC<ItemsTableProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  items,
  currentPage,
  onPageChange,
}) => {
  const itemsPerPage = 6;

  // Filter items based on search term and selected category
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    return items.filter(item => {
      // Search filter - check if search term is empty or matches any field
      const searchLower = (searchTerm || '').toLowerCase().trim();
      const matchesSearch = searchLower === '' || 
        (item.id && item.id.toLowerCase().includes(searchLower)) ||
        (item.name && item.name.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower)) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchLower)) ||
        (item.location && item.location.toLowerCase().includes(searchLower));
      
      // Category filter
      const matchesCategory = !selectedCategory || 
        selectedCategory === 'All Categories' || 
        item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Calculate pagination based on currentPage
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);



  const getStatusColor = (currentStock: number, reorderLevel: number) => {
    if (currentStock === 0) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (currentStock <= reorderLevel) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusText = (currentStock: number, reorderLevel: number) => {
    if (currentStock === 0) {
      return 'Out of Stock';
    } else if (currentStock <= reorderLevel) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };


  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Inventory Items</h3>
              <p className="text-sm text-gray-500 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items • Page {currentPage} of {totalPages}
                {searchTerm && <span className="ml-2 text-heritage-green">• Searching: "{searchTerm}"</span>}
                {selectedCategory !== 'All Categories' && <span className="ml-2 text-blue-600">• Category: {selectedCategory}</span>}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-heritage-green z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search items, categories, or suppliers..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-3 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-300"
            >
              <option value="All Categories">All Categories</option>
              <option value="Housekeeping Supplies">Housekeeping Supplies</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Technology">Technology</option>
              <option value="Furniture">Furniture</option>
            </select>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>
        </div>
      </div>
      
      {/* Items Table */}
      <div style={{ height: '480px' }}>
        <table className="w-full h-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Always render exactly 6 rows */}
            {Array.from({ length: 6 }).map((_, index) => {
              const item = currentItems[index];
              if (item) {
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200 h-16">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 font-mono">{item.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-heritage-green/10 text-heritage-green border border-heritage-green/20">
                        📂 {item.category === 'Housekeeping' ? 'Housekeeping Supplies' : item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.currentStock} {item.unit}</div>
                        <div className="text-xs text-gray-500">Min: {item.reorderLevel}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.currentStock, item.reorderLevel)}`}>
                        <div className="w-2 h-2 rounded-full mr-2 bg-current opacity-60"></div>
                        {getStatusText(item.currentStock, item.reorderLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.supplier}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-heritage-green bg-heritage-green/10 border border-heritage-green/30 rounded-lg hover:bg-heritage-green hover:text-white transition-all duration-200">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={`empty-${index}`} className="h-16">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination inside the container */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-6 pb-4 bg-white border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } transition-colors`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                      page === currentPage
                        ? 'bg-heritage-green text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } transition-colors`}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
