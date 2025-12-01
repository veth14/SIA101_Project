import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SupplierCard } from './SupplierCard';
import { SupplierDetailsModal } from './SupplierDetailsModal';
import { SupplierEditModal } from './SupplierEditModal';
import { SupplierNewModal } from './SupplierNewModal';

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
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

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

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsEditOpen(true);
  };

  const handleNewSupplierClick = () => {
    setIsNewOpen(true);
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);
    
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
      <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
        <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: title + stats */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                Suppliers
              </h3>
              <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  0 results
                </span>
                <span className="text-gray-400"> Paginated view</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-12 px-6">
          <div className="w-full max-w-xl p-6 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6M4 6h16M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No suppliers found</h3>
            <p className="text-sm text-gray-600">Try adjusting your search criteria or category filters.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: title + stats */}
          <div>
            <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
              <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              Suppliers
            </h3>
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                {filteredSuppliers.length === 0
                  ? '0 results'
                  : `${startIndex + 1}-${Math.min(endIndex, filteredSuppliers.length)} of ${filteredSuppliers.length}`}
              </span>
              <span className="text-gray-400"> Paginated view</span>
            </p>
          </div>

          {/* Right: search, category filter, and New Supplier button */}
          <div className="flex flex-wrap items-center gap-3 justify-end">
            {/* Search */}
            <div className="relative group max-w-sm w-full md:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search suppliers, contacts, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center min-w-[190px]">
              <CategoryDropdown
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Primary Action */}
            <button
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] transition-all bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] shadow-sm hover:shadow-md"
              onClick={handleNewSupplierClick}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Supplier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3 min-h-[260px]">
          {currentSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="opacity-0 animate-pulse"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`,
              }}
            >
              <SupplierCard
                supplier={supplier}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                getRatingStars={getRatingStars}
                onViewDetails={handleViewDetails}
                onEdit={handleEditSupplier}
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
      {selectedSupplier && (
        <SupplierDetailsModal
          supplier={selectedSupplier}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          getRatingStars={getRatingStars}
        />
      )}
      {editingSupplier && (
        <SupplierEditModal
          supplier={editingSupplier}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
      {isNewOpen && (
        <SupplierNewModal
          isOpen={isNewOpen}
          onClose={() => setIsNewOpen(false)}
        />
      )}
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