import React, { useState } from 'react';
import { ItemsBackground } from './ItemsBackground';
import { ItemsStats } from './ItemsStats';
import { ItemsTableContainer } from './ItemsTableContainer';
import { ItemsEmptyState } from './ItemsEmptyState';
import { useInventoryManagement } from './items-backendLogic/useInventoryManagement';
import ItemDetailsModal from './ItemDetailsModal';
import AddItemModal from './AddItemModal';
import ItemEditModal from './ItemEditModal';

import type { InventoryItem } from './items-backendLogic/inventoryService';

// Import the dropdown components from ItemsTableContainer
import { CategoryDropdown, StockStatusDropdown } from './ItemsTableContainer';

const ItemsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    filteredItems,
    filterOptions,
    loading,
    error,
    filters,
    setFilters,
    addItem
  } = useInventoryManagement();

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setFilters({ searchTerm: value });
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ selectedCategory: category });
    setCurrentPage(1);
  };

  const handleStockStatusChange = (status: string) => {
    setFilters({ stockStatus: status as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' });
    setCurrentPage(1);
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddItem = () => {
    setShowAddItemModal(true);
  };

  const handleCloseAddItemModal = () => {
    setShowAddItemModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate if we have filtered results
  const hasResults = filteredItems.length > 0;
  const itemsPerPage = 6;
  const totalItems = filteredItems.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStart = totalItems === 0 ? 0 : startIndex + 1;
  const displayedEnd = Math.min(endIndex, totalItems);

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background Elements */}
      <ItemsBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        {/* Stats */}
        <ItemsStats items={filteredItems} formatCurrency={formatCurrency} />

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green"></div>
            <span className="ml-3 text-gray-600">Loading inventory items...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">Error Loading Inventory</div>
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        ) : (
          <>
            {/* Always show the header with search and filters */}
            <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70">
              {/* Header */}
              <div className="p-5 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                      <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                        Inventory Items
                      </h3>
                      <p className="flex items-center gap-2 mt-2 text-sm text-gray-600 font-medium">
                        <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                          {hasResults
                            ? `${displayedStart}-${displayedEnd} of ${totalItems}`
                            : '0 results'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>Paginated view</span>

                        {filters.searchTerm && (
                          <span className="ml-2 text-heritage-green">
                            • Searching: "{filters.searchTerm}"
                          </span>
                        )}
                        {filters.selectedCategory !== 'All Categories' && (
                          <span className="ml-2 text-blue-600">
                            • Category: {filters.selectedCategory}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search, Filters, and Add Button Row */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* Search */}
                  <div className="relative flex-1 max-w-xl min-w-[260px] group">

                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search items, categories, or suppliers..."
                      value={filters.searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
                    />
                  </div>

                  {/* Filters + Add Button */}
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <CategoryDropdown
                      selectedCategory={filters.selectedCategory}
                      onCategoryChange={handleCategoryChange}
                      categoryOptions={filterOptions.categoryOptions}
                    />
                    <StockStatusDropdown
                      selectedStockStatus={filters.stockStatus}
                      onStockStatusChange={handleStockStatusChange}
                      stockStatusOptions={filterOptions.stockStatusOptions}
                    />
                    <button 
                      onClick={handleAddItem}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] transition-all bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              {hasResults ? (
                <ItemsTableContainer
                  searchTerm={filters.searchTerm}
                  selectedCategory={filters.selectedCategory}
                  items={filteredItems}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onViewDetails={handleViewDetails}
                  onEditItem={handleEditItem}
                />
              ) : (
                <div className="p-8">
                  <ItemsEmptyState />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Item Details Modal - Rendered via Portal */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Item Edit Modal - Rendered via Portal */}
      <ItemEditModal
        item={selectedItem}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />

      {/* Add Item Modal - Rendered via Portal */}
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={handleCloseAddItemModal}
        onSave={addItem}
      />
    </div>
  );
};

export default ItemsPage;