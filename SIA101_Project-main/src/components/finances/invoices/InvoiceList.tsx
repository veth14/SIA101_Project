import React, { useState, useEffect } from 'react';
import CreateInvoiceModal from './CreateInvoiceModal';

export interface Invoice {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'paid' | 'pending' | 'overdue';
  totalAmount: number;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  category: 'room' | 'food' | 'services' | 'taxes';
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceListProps {
  invoices: Invoice[];
  onInvoiceSelect: (invoice: Invoice) => void;
  selectedInvoice: Invoice | null;
  onInvoiceCreated?: (invoice: Invoice) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onInvoiceSelect, selectedInvoice, onInvoiceCreated }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  const itemsPerPage = 8;

  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter(invoice => {
    // Status filter
    if (filters.status !== 'all' && invoice.status !== filters.status) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm && !invoice.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !invoice.guestName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !invoice.roomNumber.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Date range filter (you can extend this based on your needs)
    if (filters.dateRange !== 'all') {
      const checkInDate = new Date(invoice.checkIn);
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          return checkInDate.toDateString() === today.toDateString();
        case 'week': {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return checkInDate >= weekAgo;
        }
        case 'month': {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return checkInDate >= monthAgo;
        }
        default:
          return true;
      }
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.status, filters.dateRange, filters.searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Export functionality
  const handleExportAll = () => {
    // Create CSV content using filtered invoices
    const headers = ['Invoice ID', 'Guest Name', 'Room Number', 'Check-in', 'Check-out', 'Status', 'Total Amount', 'Items Count'];
    const csvContent = [
      headers.join(','),
      ...filteredInvoices.map(invoice => [
        invoice.id,
        `"${invoice.guestName}"`,
        invoice.roomNumber,
        invoice.checkIn,
        invoice.checkOut,
        invoice.status,
        invoice.totalAmount.toFixed(2),
        invoice.items?.length || 0
      ].join(','))
    ].join('\n');

    // Create filename with filter info
    const filterSuffix = filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm ? '_filtered' : '';
    const fileName = `invoices_export${filterSuffix}_${new Date().toISOString().split('T')[0]}.csv`;

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    if (onInvoiceCreated) {
      onInvoiceCreated(newInvoice);
    }
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes table-slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-table-slide-in {
          animation: table-slide-in 0.7s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>

      {/* Invoice Table */}
      <div className="relative overflow-hidden transition-all duration-500 border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-table-slide-in group hover:shadow-3xl">
        {/* Background Elements */}
        <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/5 via-heritage-light/20 to-heritage-green/3 rounded-3xl opacity-60 group-hover:opacity-100"></div>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full translate-x-1/3 -translate-y-1/3 bg-gradient-to-bl from-heritage-green/10 to-transparent"></div>
        <div className="absolute w-32 h-32 rounded-full -bottom-10 -left-10 bg-gradient-to-tr from-heritage-light/30 to-transparent"></div>
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-[900px] p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-heritage-green">Invoice Management</h2>
                <p className="text-sm text-heritage-neutral/70">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-heritage-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="py-3 pl-10 pr-4 transition-all duration-300 border shadow-sm w-80 border-heritage-neutral/30 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green placeholder-heritage-neutral/50 focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 focus:bg-white hover:shadow-md"
                />
              </div>

              {/* Filter Dropdowns */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-3 transition-all duration-300 border shadow-sm border-heritage-neutral/30 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 hover:shadow-md"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid Only</option>
                <option value="pending">Pending Only</option>
                <option value="overdue">Overdue Only</option>
              </select>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="px-4 py-3 transition-all duration-300 border shadow-sm border-heritage-neutral/30 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 hover:shadow-md"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              {/* Action Buttons */}
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-heritage-green to-heritage-green/90 hover:from-heritage-green/90 hover:to-heritage-green/80 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Invoice
              </button>
              <button 
                onClick={handleExportAll}
                className="px-6 py-3 text-sm font-semibold text-heritage-green hover:text-white bg-white/80 hover:bg-heritage-green border border-heritage-neutral/20 hover:border-heritage-green rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                {filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm 
                  ? `Export ${filteredInvoices.length} Filtered` 
                  : 'Export All'
                }
              </button>
            </div>
          </div>

          {/* Invoice List - Table Format */}
          <div className="flex-1 overflow-hidden border shadow-inner rounded-2xl border-heritage-neutral/10 bg-white/50 backdrop-blur-sm">
            <table className="w-full">
              <thead className="border-b bg-gradient-to-r from-heritage-light/40 to-heritage-green/10 border-heritage-neutral/10">
                <tr>
                  <th className="px-8 py-5 text-sm font-bold tracking-wide text-left text-heritage-green">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Invoice ID</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-sm font-bold tracking-wide text-left text-heritage-green">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Guest Name</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-sm font-bold tracking-wide text-center text-heritage-green">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Room</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-sm font-bold tracking-wide text-center text-heritage-green">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-sm font-bold tracking-wide text-right text-heritage-green">
                    <div className="flex items-center justify-end space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-sm font-bold tracking-wide text-center text-heritage-green">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Date</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-neutral/10 bg-white/30">
                {currentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 mb-4 rounded-full bg-heritage-green/10">
                          <svg className="w-8 h-8 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-heritage-green">No invoices found</h3>
                        <p className="text-heritage-neutral/60">Try adjusting your filters or create a new invoice</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id}
                      className="h-16 transition-all duration-300 border-l-4 border-transparent cursor-pointer hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-heritage-light/20 group hover:border-heritage-green"
                      onClick={() => {
                        console.log('Invoice clicked:', invoice.id);
                        onInvoiceSelect(invoice);
                      }}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-heritage-green/20 to-heritage-neutral/20 rounded-xl">
                            <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold transition-colors text-heritage-green group-hover:text-heritage-green/80">{invoice.id}</p>
                            <p className="text-xs text-heritage-neutral/70">{invoice.items?.length || 0} items</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <p className="text-sm font-medium text-heritage-green">{invoice.guestName}</p>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <p className="text-sm font-medium text-heritage-green">{invoice.roomNumber}</p>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          invoice.status === 'paid' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : invoice.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            invoice.status === 'paid' ? 'bg-emerald-500' :
                            invoice.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></div>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div>
                          <p className="text-base font-bold text-heritage-green">${invoice.totalAmount.toFixed(2)}</p>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <div>
                          <p className="text-sm font-medium text-heritage-green">{invoice.checkIn}</p>
                          <p className="text-xs text-heritage-neutral/70">{invoice.checkOut}</p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Matching Transaction Table Style */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-4 mt-6 border-t border-heritage-neutral/10">
              <div className="flex items-center gap-3">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      // Show pages around current page
                      const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                      pageNum = start + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                          pageNum === currentPage
                            ? 'bg-heritage-green text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Create Invoice Modal */}
    <CreateInvoiceModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onInvoiceCreated={handleInvoiceCreated}
    />
    </>
  );
};

export default InvoiceList;