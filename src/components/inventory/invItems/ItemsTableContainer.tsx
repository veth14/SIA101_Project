import React, { useMemo, useState, useEffect, useRef } from 'react';
import type { InventoryItem } from './items-backendLogic/inventoryService';

// Category Dropdown Component
export const CategoryDropdown: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryOptions: Array<{ value: string; label: string; count: number }>;
}> = ({ selectedCategory, onCategoryChange, categoryOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between px-6 py-3 w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
            <span className="text-gray-800">
              {categoryOptions.find(option => option.value === selectedCategory)?.label || selectedCategory}
            </span>
          </div>
          <svg 
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}` } 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleCategorySelect(option.value)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedCategory === option.value 
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedCategory === option.value 
                    ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                    : 'bg-gray-300'
                }`}></div>
                <span className="flex-1">{option.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {option.value !== 'All Categories' && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {option.count}
                  </span>
                )}
                {selectedCategory === option.value && (
                  <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998]" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Stock Status Dropdown Component
export const StockStatusDropdown: React.FC<{
  selectedStockStatus: string;
  onStockStatusChange: (status: string) => void;
  stockStatusOptions: Array<{ value: string; label: string; count: number }>;
}> = ({ selectedStockStatus, onStockStatusChange, stockStatusOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusSelect = (status: string) => {
    onStockStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between px-6 py-3 w-44 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
            <span className="text-gray-800">
              {stockStatusOptions.find(option => option.value === selectedStockStatus)?.label || selectedStockStatus}
            </span>
          </div>
          <svg 
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}` } 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]">
          {stockStatusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedStockStatus === option.value 
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedStockStatus === option.value 
                    ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                    : 'bg-gray-300'
                }`}></div>
                <span className="flex-1">{option.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {option.value !== 'all' && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {option.count}
                  </span>
                )}
                {selectedStockStatus === option.value && (
                  <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998]" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

interface ItemsTableProps {
  searchTerm: string;
  selectedCategory: string;
  items: InventoryItem[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewDetails?: (item: InventoryItem) => void;
  onEditItem?: (item: InventoryItem) => void;
}

export const ItemsTableContainer: React.FC<ItemsTableProps> = ({
  searchTerm,
  selectedCategory,
  items,
  currentPage,
  onPageChange,
  onViewDetails = () => {},
  onEditItem = () => {}
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
    <>
      {/* Items Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Item ID
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Item
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Category
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                Stock
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Location
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Always render exactly 6 rows for consistent height */}
            {Array.from({ length: 6 }).map((_, index) => {
              const item = currentItems[index];

              if (item) {
                return (
                  <tr
                    key={item.id}
                    className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50"
                    style={{ height: '74px' }}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#82A33D]/10">
                          <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                            {item.id}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            {item.supplier || 'No supplier'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                          {item.name}
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          Min level: {item.reorderLevel}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-heritage-green/10 text-heritage-green border border-heritage-green/20">
                        📂 {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${getStatusColor(item.currentStock, item.reorderLevel)}`}
                      >
                        <span
                          className="w-1.5 h-1.5 mr-2 rounded-full bg-current opacity-70"
                        />
                        {getStatusText(item.currentStock, item.reorderLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        Reorder at {item.reorderLevel}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.location || '—'}</div>
                      <div className="text-xs font-medium text-gray-500">Last restocked: {item.lastRestocked || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(item);
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditItem(item);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-[#82A33D] to-emerald-600 hover:from-[#6d8735] hover:to-emerald-700 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={`empty-${index}`} style={{ height: '74px' }}>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-center">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-right">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-center">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-center">-</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination styled similar to InvoiceList */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-white/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-1">Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum: number;

                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                    pageNum = start + i;
                  }

                  const isActive = pageNum === currentPage;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-1">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};