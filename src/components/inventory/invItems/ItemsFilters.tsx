import React from 'react';

interface ItemsFiltersProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  categoryOptions: Array<{ label: string; value: string }>;
  onCategoryFilter: (category: string) => void;
  onStatusFilter: (status: string) => void;
}

export const ItemsFilters: React.FC<ItemsFiltersProps> = ({
  globalFilter,
  onGlobalFilterChange,
  categoryOptions,
  onCategoryFilter,
  onStatusFilter,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search items..."
              value={globalFilter ?? ''}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-colors placeholder-gray-500 text-sm"
            />
          </div>
        </div>
        
        {/* Filters and Actions */}
        <div className="flex items-center gap-3">
          <select
            onChange={(e) => onCategoryFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green text-sm bg-white min-w-[120px]"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            onChange={(e) => onStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green text-sm bg-white min-w-[100px]"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          
          <button className="px-4 py-2.5 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors font-medium text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};