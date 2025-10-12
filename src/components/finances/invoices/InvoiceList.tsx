import React, { useState } from 'react';

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
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onInvoiceSelect, selectedInvoice }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  const itemsPerPage = 8;

  // Pagination logic
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
            <div className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></div>
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
            <div className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></div>
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
            <div className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full"></div>
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>

      {/* Invoice Table */}
      <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-green/5 rounded-3xl opacity-80"></div>
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-bl from-heritage-green/15 to-transparent"></div>
        <div className="absolute w-24 h-24 rounded-full -bottom-8 -left-8 bg-gradient-to-tr from-heritage-light/40 to-transparent"></div>
        
        <div className="relative z-10">{/* Header Section */}
        <div className="p-8 border-b border-heritage-neutral/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-heritage-green via-heritage-green/90 to-heritage-neutral rounded-2xl">
                <svg className="text-white w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-heritage-green">Invoice Management</h3>
                <p className="text-sm text-heritage-neutral/70">Manage and track all invoices • {invoices.length} total</p>
                <p className="mt-1 text-xs text-heritage-neutral/60">
                  Showing {startIndex + 1} to {Math.min(endIndex, invoices.length)} of {invoices.length} invoices
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-heritage-green to-heritage-green/90 hover:from-heritage-green/90 hover:to-heritage-green/80 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Invoice
              </button>
              <button className="px-6 py-3 text-sm font-semibold text-heritage-green hover:text-white bg-white/80 hover:bg-heritage-green border border-heritage-neutral/20 hover:border-heritage-green rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Export All
              </button>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-heritage-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by invoice ID, guest name, or room number..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="w-full py-3 pl-12 pr-4 transition-all duration-300 border shadow-sm border-heritage-neutral/20 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green placeholder-heritage-neutral/50 focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 focus:bg-white hover:shadow-md"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-3 transition-all duration-300 border shadow-sm border-heritage-neutral/20 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 hover:shadow-md"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid Only</option>
                <option value="pending">Pending Only</option>
                <option value="overdue">Overdue Only</option>
              </select>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="px-4 py-3 transition-all duration-300 border shadow-sm border-heritage-neutral/20 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 hover:shadow-md"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compact Invoice List */}
        <div className="p-6">
          <div className="space-y-3">
            {currentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => onInvoiceSelect(invoice)}
                className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md ${
                  selectedInvoice?.id === invoice.id 
                    ? 'bg-heritage-green/5 border-heritage-green shadow-md' 
                    : 'bg-white border-gray-200 hover:border-heritage-green/40'
                }`}
              >
                {/* Status Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                  invoice.status === 'paid' ? 'bg-emerald-500' :
                  invoice.status === 'pending' ? 'bg-amber-500' : 
                  'bg-red-500'
                }`}></div>

                <div className="flex items-center justify-between ml-3">
                  {/* Left Section: Basic Info */}
                  <div className="flex items-center space-x-6">
                    <div className="min-w-0">
                      <h4 className="text-lg font-bold text-heritage-green">{invoice.id}</h4>
                      <p className="text-sm text-gray-600">{invoice.guestName}</p>
                    </div>
                    
                    <div className="hidden min-w-0 sm:block">
                      <p className="text-sm font-medium text-gray-900">Room {invoice.roomNumber}</p>
                      <p className="text-xs text-gray-500">{invoice.checkIn}</p>
                    </div>
                    
                    <div className="hidden min-w-0 md:block">
                      <p className="text-sm text-gray-600">{invoice.items.length} items</p>
                    </div>
                  </div>

                  {/* Right Section: Status and Amount */}
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(invoice.status)}
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-heritage-green">
                        ${invoice.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    
                    <svg 
                      className="w-5 h-5 text-gray-400 transition-colors group-hover:text-heritage-green" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center pt-6 mt-6 border-t border-heritage-neutral/10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  currentPage === 1 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-heritage-green bg-white border border-heritage-green/20 hover:bg-heritage-green hover:text-white shadow-sm hover:shadow-md'
                }`}
              >
                <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-heritage-green text-white shadow-md'
                        : 'text-heritage-green bg-white border border-heritage-green/20 hover:bg-heritage-green/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  currentPage === totalPages 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-heritage-green bg-white border border-heritage-green/20 hover:bg-heritage-green hover:text-white shadow-sm hover:shadow-md'
                }`}
              >
                Next
                <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default InvoiceList;