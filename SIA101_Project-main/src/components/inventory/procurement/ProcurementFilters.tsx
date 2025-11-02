import React from 'react';

interface ProcurementFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  supplierFilter: string;
  onSupplierChange: (supplier: string) => void;
  suppliers: string[];
}

export const ProcurementFilters: React.FC<ProcurementFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  supplierFilter,
  onSupplierChange,
  suppliers,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green focus:border-transparent text-sm"
          />
        </div>
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green focus:border-transparent text-sm bg-white min-w-[140px]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        {/* Supplier Filter */}
        <select
          value={supplierFilter}
          onChange={(e) => onSupplierChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green focus:border-transparent text-sm bg-white min-w-[160px]"
        >
          <option value="all">All Suppliers</option>
          {suppliers.map(supplier => (
            <option key={supplier} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>
        
        {/* New Order Button */}
        <button className="px-6 py-3 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors font-medium text-sm whitespace-nowrap">
          + New Order
        </button>
      </div>
    </div>
  );
};
