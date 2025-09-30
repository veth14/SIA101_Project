import React, { useState } from 'react';
import { sampleInventory } from '../../../data/sampleInventory';
import InventoryItemsHeader from './InventoryItemsHeader';
import { ItemsBackground } from './ItemsBackground';
import { ItemsStats } from './ItemsStats';
import { ItemsTableContainer } from './ItemsTableContainer';
import { ItemsEmptyState } from './ItemsEmptyState';

const ItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate if we have filtered results
  const hasResults = sampleInventory.length > 0;

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Background Elements */}
      <ItemsBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <InventoryItemsHeader />

        {/* Stats */}
        <ItemsStats items={sampleInventory} formatCurrency={formatCurrency} />

        {/* Table or Empty State */}
        {hasResults ? (
          <>
            <ItemsTableContainer
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              items={sampleInventory}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <ItemsEmptyState />
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
