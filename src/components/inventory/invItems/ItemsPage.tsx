import React, { useState } from "react";
import { ItemsBackground } from "./ItemsBackground";
import { ItemsStats } from "./ItemsStats";
import { ItemsTableContainer } from "./ItemsTableContainer";
import { ItemsEmptyState } from "./ItemsEmptyState";
import { useInventoryManagement } from "./items-backendLogic/useInventoryManagement";
import ItemDetailsModal from "./ItemDetailsModal";
import AddItemModal from "./AddItemModal";
import type { InventoryItem } from "./items-backendLogic/inventoryService";

// Import the dropdown components from ItemsTableContainer
import { CategoryDropdown, StockStatusDropdown } from "./ItemsTableContainer";

const ItemsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Use the inventory management hook - it handles everything!
  const {
    items,
    filterOptions,
    loading,
    error,
    filters,
    setFilters,
    filteredItems,
    refreshItems, // This is what you need for refetching!
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
    setFilters({
      stockStatus: status as "all" | "in-stock" | "low-stock" | "out-of-stock",
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddItem = () => {
    setShowAddItemModal(true);
  };

  const handleCloseAddItemModal = () => {
    setShowAddItemModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Refetch function for after stock updates
  const handleStockUpdated = async () => {
    console.log("🔄 Stock updated, refreshing inventory...");
    await refreshItems();

    // Update selected item with fresh data
    if (selectedItem) {
      const updatedItem = items.find((item) => item.id === selectedItem.id);
      if (updatedItem) {
        console.log("✅ Updated selected item:", updatedItem);
        setSelectedItem(updatedItem);
      }
    }
  };

  // Calculate if we have filtered results
  const hasResults = filteredItems.length > 0;

  console.log("Current state:", {
    itemsCount: items.length,
    filteredItemsCount: filteredItems.length,
    loading,
  });

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
            <span className="ml-3 text-gray-600">
              Loading inventory items...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">
              Error Loading Inventory
            </div>
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        ) : (
          <>
            {/* Always show the header with search and filters */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">
                        Inventory Items
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {hasResults ? (
                          <>
                            Showing {filteredItems.length} of {items.length}{" "}
                            items
                          </>
                        ) : (
                          <>
                            No items found • Try adjusting your search or
                            filters
                          </>
                        )}
                        {filters.searchTerm && (
                          <span className="ml-2 text-heritage-green">
                            • Searching: "{filters.searchTerm}"
                          </span>
                        )}
                        {filters.selectedCategory !== "All Categories" && (
                          <span className="ml-2 text-blue-600">
                            • Category: {filters.selectedCategory}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center">
                        <svg
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-heritage-green z-10"
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
                        <input
                          type="text"
                          placeholder="Search items, categories, or suppliers..."
                          value={filters.searchTerm}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="pl-12 pr-6 py-3 w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300"
                        />
                      </div>
                    </div>
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
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Item
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

      {/* Item Details Modal - Pass refresh function */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStockUpdated={handleStockUpdated}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={handleCloseAddItemModal}
      />
    </div>
  );
};

export default ItemsPage;
