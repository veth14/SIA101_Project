import React, { useState, useEffect } from 'react';

export interface Invoice {
  id: string;

  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  linkedBookingId?: string;
  status: 'paid' | 'pending' | 'overdue';
  totalAmount: number;
  items: InvoiceItem[];
  // Additional backend-derived fields used in InvoiceDetails
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  reference?: string;
  paymentMethod?: string;
  dueDate?: string;
  // internal key so selection/highlight stays unique per row
  selectionKey?: string;
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
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onInvoiceSelect, selectedInvoice }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [showAll, setShowAll] = useState(false);

  const itemsPerPage = 10;

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

  const totalItems = filteredInvoices.length;
  const visibleInvoices = showAll ? filteredInvoices : currentInvoices;

  const displayedStart = totalItems === 0 ? 0 : (showAll ? 1 : startIndex + 1);
  const displayedEnd = showAll ? totalItems : Math.min(endIndex, totalItems);

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
      <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70">
        {/* Header with Search and Controls */}
        <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Invoice Records
              </h3>
              <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  {showAll
                    ? `All ${totalItems}`
                    : totalItems === 0
                      ? '0 results'
                      : `${displayedStart}-${displayedEnd} of ${totalItems}`}
                </span>
                <span className="text-gray-400">•</span>
                <span>{showAll ? 'All invoices' : 'Paginated view'}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportAll}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] transition-all bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>
                  {filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm 
                    ? `Export ${filteredInvoices.length} Filtered` 
                    : 'Export All'}
                </span>
              </button>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search invoices..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
            >
              <option value="all">📊 All Status</option>
              <option value="paid">✅ Paid</option>
              <option value="pending">⏳ Pending</option>
              <option value="overdue">⚠️ Overdue</option>
            </select>

            {/* Date Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
            >
              <option value="all">📅 All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
              <tr>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                  Invoice ID
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                  Guest
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                  Reference
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                  Amount
                </th>
                <th className="px-6 py-5 text-center whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleInvoices.map((invoice, index) => (
                <tr
                  key={`${invoice.id}-${invoice.roomNumber}-${invoice.totalAmount}-${index}`}

                  onClick={() => {
                    console.log('Invoice clicked:', invoice.id);
                    onInvoiceSelect(invoice);
                  }}
                  style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-sm animate-fade-in ${
                    selectedInvoice?.selectionKey && invoice.selectionKey && selectedInvoice.selectionKey === invoice.selectionKey
                      ? 'bg-gradient-to-r from-[#82A33D]/10 via-[#82A33D]/5 to-transparent border-l-4 border-l-[#82A33D]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#82A33D]/10">
                        <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                          {invoice.id}
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          {invoice.items?.length || 0} items
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                        {invoice.guestName}
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        Stay: {invoice.checkIn} - {invoice.checkOut}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {invoice.roomNumber}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                        invoice.status === 'paid'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                          : invoice.status === 'pending'
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 mr-2 rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-emerald-500'
                            : invoice.status === 'pending'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      ₱{invoice.totalAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.checkIn}</div>
                    <div className="text-xs font-medium text-gray-500">{invoice.checkOut}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-5xl text-gray-400">🔍</div>
            <p className="font-medium text-gray-500">No invoices found</p>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination (centered) */}
        {!showAll && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-white/50">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                        onClick={() => handlePageChange(pageNum)}
                        className={`inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${isActive ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
    </>
  );
};

export default InvoiceList;