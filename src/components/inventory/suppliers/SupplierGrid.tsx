import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SupplierCard } from './SupplierCard';

// Simple Category Dropdown Component
const CategoryDropdown: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All Categories',
    'Food & Beverage',
    'Housekeeping',
    'Maintenance',
    'Technology',
    'Furniture'
  ];

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
            <span className="text-gray-800">{selectedCategory}</span>
          </div>
          <svg 
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
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
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                  : 'bg-gray-300'
              }`}></div>
              <span className="flex-1">{category}</span>
              {selectedCategory === category && (
                <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
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

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'suspended';
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

interface SupplierGridProps {
  suppliers: Supplier[];
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getRatingStars: (rating: number) => React.ReactNode;
}

export const SupplierGrid: React.FC<SupplierGridProps> = ({
  suppliers,
  formatCurrency,
  getStatusBadge,
  getRatingStars,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const itemsPerPage = 3;

  // Filter suppliers based on search term and selected category
  const filteredSuppliers = useMemo(() => {
    if (!suppliers || suppliers.length === 0) {
      return [];
    }

    return suppliers.filter(supplier => {
      // Search filter - check if search term is empty or matches any field
      const searchLower = (searchTerm || '').toLowerCase().trim();
      const matchesSearch = searchLower === '' || 
        (supplier.name && supplier.name.toLowerCase().includes(searchLower)) ||
        (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchLower)) ||
        (supplier.email && supplier.email.toLowerCase().includes(searchLower)) ||
        (supplier.category && supplier.category.toLowerCase().includes(searchLower)) ||
        (supplier.status && supplier.status.toLowerCase().includes(searchLower));
      
      // Category filter
      const matchesCategory = !selectedCategory || 
        selectedCategory === 'All Categories' || 
        supplier.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [suppliers, searchTerm, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Fill remaining slots with placeholder cards for proper alignment
  const placeholderCount = Math.max(0, itemsPerPage - currentSuppliers.length);
  const placeholders = Array(placeholderCount).fill(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  if (suppliers.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Suppliers</h3>
              <p className="text-sm text-gray-500 font-medium">No suppliers found</p>
            </div>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Suppliers</h3>
              <p className="text-sm text-gray-500 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers • Page {currentPage} of {totalPages}
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
                  placeholder="Search suppliers, contacts, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </div>
            <CategoryDropdown
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Supplier
            </button>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="opacity-0 animate-pulse"
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`
              }}
            >
              <SupplierCard
                supplier={supplier}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                getRatingStars={getRatingStars}
              />
            </div>
          ))}
          
          {/* Placeholder cards for alignment */}
          {placeholders.map((_, index) => (
            <div key={`placeholder-${index}`} className="invisible">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                <div className="h-full flex flex-col">
                  <div className="flex-grow"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-6 pb-4">
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
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
                {getPaginationRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                      page === currentPage
                        ? 'bg-heritage-green text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  );
};

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
