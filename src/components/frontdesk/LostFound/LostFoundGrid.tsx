/**
 * 
 * Displays a paginated grid of lost and found items using LostFoundCard components.
 * Shows maximum 6 items per page with pagination controls.
 */

import React, { useState, useEffect, useMemo } from 'react';
import FilterDropdown, { FilterOption } from '../../shared/FilterDropdown';
import type { LostFoundItem } from './types';
interface LostFoundGridProps {
  /** Array of lost and found items to display */
  items: LostFoundItem[];
  /** Which collection is currently active - affects labels */
  activeTab: 'found' | 'lost';
  /** Function to handle viewing item details */
  onViewDetails: (item: LostFoundItem) => void;
  /** Function to handle view-only modal */
  onViewOnly?: (item: LostFoundItem) => void;
  /** Function to handle marking item as claimed */
  onMarkClaimed: (item: LostFoundItem) => void;
}

// Replace custom status dropdown with shared FilterDropdown

/**
 * Grid component for displaying lost and found items with pagination
 * 
 * @param items - Array of lost and found items
 * @param onViewDetails - Function to handle viewing item details
 * @param onMarkClaimed - Function to handle marking item as claimed
 */
// Small reusable badge component to avoid duplication
const StatusBadge: React.FC<{ status: LostFoundItem['status'] }> = ({ status }) => (
  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
    status === 'claimed'
      ? 'bg-green-100 text-green-800 border border-green-200'
      : status === 'disposed'
      ? 'bg-red-100 text-red-800 border border-red-200'
      : 'bg-blue-100 text-blue-800 border border-blue-200'
  }`}>
    {status === 'claimed' ? 'Claimed' : status === 'disposed' ? 'Disposed' : 'Unclaimed'}
  </span>
);

// Shared actions used both in table rows and mobile cards
const ItemActions: React.FC<{ item: LostFoundItem; onViewDetails: (i: LostFoundItem) => void; onMarkClaimed: (i: LostFoundItem) => void; onViewOnly?: (i: LostFoundItem) => void }> = ({ item, onViewDetails, onMarkClaimed, onViewOnly }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => onViewOnly ? onViewOnly(item) : onViewDetails(item)}
      className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
    >
      View
    </button>
    <button
      onClick={() => onViewDetails(item)}
      className="px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-heritage-green hover:bg-heritage-green/90 transition-colors shadow-sm"
    >
      Edit
    </button>
    {item.status !== 'claimed' && (
      <button 
        onClick={() => onMarkClaimed(item)}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Claim
      </button>
    )}
  </div>
);

const LostFoundGrid: React.FC<LostFoundGridProps> = ({ 
  items, 
  activeTab,
  onViewDetails, 
  onMarkClaimed,
  onViewOnly
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const itemsPerPage = 6;

  // Reset to page 1 when items change (e.g., after filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  // Create a new blank item and open the details view (used by Add Item button)
  const handleAddNew = () => {
    const newItem: LostFoundItem = {
      id: `new-${Date.now()}`,
      itemName: '',
      description: '',
      category: 'other',
      location: '',
      dateFound: new Date().toISOString(),
      foundBy: '',
      status: 'unclaimed'
    };

    onViewDetails(newItem);
  };

  // Filter items based on search term and selected status
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    return items.filter(item => {
      // Search filter - check if search term is empty or matches any field
      const searchLower = (searchTerm || '').toLowerCase().trim();
      const matchesSearch = searchLower === '' || 
        (item.id && item.id.toLowerCase().includes(searchLower)) ||
        (item.itemName && item.itemName.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower)) ||
        (item.location && item.location.toLowerCase().includes(searchLower)) ||
        (item.foundBy && item.foundBy.toLowerCase().includes(searchLower));
      
      // Status filter
      const matchesStatus = selectedStatus === 'all' || item.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page and 2 on each side
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  // Note: don't early-return when items is empty; keep layout visible
  const isEmptyAfterFilter = filteredItems.length === 0;

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-visible relative">
      {/* Header */}
      <div className="p-5 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-[#82A33D]/10 rounded-xl">
              <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">Lost & Found Items</h3>
              <p className="flex items-center gap-2 mt-2 text-sm text-gray-600 font-medium">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  {filteredItems.length ? `${startIndex + 1}-${Math.min(endIndex, filteredItems.length)} of ${filteredItems.length}` : '0 results'}
                </span>
                <span className="text-gray-400">•</span>
                <span>Paginated view</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end flex-1 relative z-10">
            <div className="relative flex-1 min-w-[260px] max-w-xl group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items, categories, or locations..."
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
              />
            </div>
            <FilterDropdown
              selected={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'unclaimed', label: 'Unclaimed' },
                { value: 'claimed', label: 'Claimed' },
                { value: 'disposed', label: 'Disposed' },
              ] as FilterOption[]}
              widthClass="w-48"
              ariaLabel="Filter status"
            />
            <button
              onClick={handleAddNew}
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

      {/* Items Table */}
      {/* Mobile: show stacked cards */}
  <div className="min-[1370px]:hidden px-4 py-4">
        {isEmptyAfterFilter ? (
          <div className="text-center text-sm text-gray-500">No items to display</div>
        ) : (
          <div className="space-y-4">
            {currentItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-mono text-gray-700">{item.id}</div>
                        <div className="text-lg font-semibold text-gray-900">{item.itemName || '-'}</div>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-heritage-green/10 text-heritage-green border border-heritage-green/20">{item.category}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">{item.location}</div>
                    <div className="mt-2">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <ItemActions item={item} onViewDetails={onViewDetails} onMarkClaimed={onMarkClaimed} onViewOnly={onViewOnly} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table for large screens (desktop) */}
  <div className="hidden min-[1370px]:block" style={{ height: '480px' }}>
        <table className="w-full h-full">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Item ID</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Item Name</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Category</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">{activeTab === 'found' ? 'Location Found' : 'Location Lost'}</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Status</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">{activeTab === 'found' ? 'Date Found' : 'Date Lost'}</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isEmptyAfterFilter && (
              <tr className="h-20">
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No items to display</td>
              </tr>
            )}
            {Array.from({ length: 6 }).map((_, index) => {
              const item = currentItems[index];
              if (item) {
                return (
                  <tr key={item.id} className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50" style={{ height: '74px' }}>
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
                        <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.location}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{new Date(item.dateFound).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex">
                        <ItemActions item={item} onViewDetails={onViewDetails} onMarkClaimed={onMarkClaimed} onViewOnly={onViewOnly} />
                      </div>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={`empty-${index}`} style={{ height: '74px' }}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">—</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-white/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                  let pageNum;
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
                      onClick={() => setCurrentPage(pageNum)}
                      className={`inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${isActive ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    </div>
  );
};

export default LostFoundGrid;
