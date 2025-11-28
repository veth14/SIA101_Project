/**
 * 
 * Displays a paginated grid of lost and found items using LostFoundCard components.
 * Shows maximum 6 items per page with pagination controls.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { LostFoundItem } from './types';
interface LostFoundGridProps {
  /** Array of lost and found items to display */
  items: LostFoundItem[];
  /** Which collection is currently active - affects labels */
  activeTab: 'found' | 'lost';
  /** Function to handle viewing item details */
  onViewDetails: (item: LostFoundItem) => void;
  /** Function to handle marking item as claimed */
  onMarkClaimed: (item: LostFoundItem) => void;
}

// Status Dropdown Component
const StatusDropdown: React.FC<{
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}> = ({ selectedStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses = [
    'All Status',
    'Unclaimed',
    'Claimed', 
    'Disposed'
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

  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between px-6 py-3 w-full min-[1370px]:w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
            <span className="text-gray-800">{selectedStatus}</span>
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
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedStatus === status 
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                selectedStatus === status 
                  ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                  : 'bg-gray-300'
              }`}></div>
              <span className="flex-1">{status}</span>
              {selectedStatus === status && (
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
const ItemActions: React.FC<{ item: LostFoundItem; onViewDetails: (i: LostFoundItem) => void; onMarkClaimed: (i: LostFoundItem) => void }> = ({ item, onViewDetails, onMarkClaimed }) => (
  <div className="flex items-center space-x-2">
    <button 
      onClick={() => onViewDetails(item)}
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-heritage-green bg-heritage-green/10 border border-heritage-green/30 rounded-lg hover:bg-heritage-green hover:text-white transition-all duration-200"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      View
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
  onMarkClaimed 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
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
      const matchesStatus = !selectedStatus || 
        selectedStatus === 'All Status' || 
        item.status.toLowerCase() === selectedStatus.toLowerCase();
      
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
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
        <div className="flex flex-col min-[1370px]:flex-row min-[1370px]:items-center min-[1370px]:justify-between">
          <div className="flex items-center space-x-4 mb-4 min-[1370px]:mb-0">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Lost & Found Items</h3>
              <p className="text-sm text-gray-500 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items • Page {currentPage} of {totalPages}
                {searchTerm && <span className="ml-2 text-heritage-green">• Searching: "{searchTerm}"</span>}
                {selectedStatus !== 'All Status' && <span className="ml-2 text-blue-600">• Status: {selectedStatus}</span>}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 min-[1370px]:space-y-0">
            <div className="relative group w-full sm:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-heritage-green z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search items, categories, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 w-full sm:w-80 md:w-72 min-[1370px]:w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <StatusDropdown
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
            </div>
            <div className="w-full sm:w-auto">
              <button onClick={handleAddNew} className="w-full sm:w-auto min-[1370px]:w-auto inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
            </div>
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
                  <ItemActions item={item} onViewDetails={onViewDetails} onMarkClaimed={onMarkClaimed} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table for large screens (desktop) */}
  <div className="hidden min-[1370px]:block" style={{ height: '480px' }}>
        <table className="w-full h-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{activeTab === 'found' ? 'Location Found' : 'Location Lost'}</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{activeTab === 'found' ? 'Date Found' : 'Date Lost'}</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
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
                        <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.location}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{new Date(item.dateFound).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ItemActions item={item} onViewDetails={onViewDetails} onMarkClaimed={onMarkClaimed} />
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={`empty-${index}`} className="h-16">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">—</td>
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
