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
  onInvoiceSelect: (invoice: Invoice) => void;
  selectedInvoice: Invoice | null;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onInvoiceSelect, selectedInvoice }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  // Sample invoice data
  const invoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      guestName: 'John Smith',
      roomNumber: '204',
      checkIn: '2024-10-05',
      checkOut: '2024-10-07',
      status: 'paid',
      totalAmount: 580.50,
      items: [
        { id: '1', description: 'Deluxe Room (2 nights)', category: 'room', quantity: 2, unitPrice: 200, total: 400 },
        { id: '2', description: 'Room Service', category: 'food', quantity: 3, unitPrice: 35, total: 105 },
        { id: '3', description: 'Laundry Service', category: 'services', quantity: 1, unitPrice: 45, total: 45 },
        { id: '4', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 30.50, total: 30.50 }
      ]
    },
    {
      id: 'INV-2024-002',
      guestName: 'Sarah Johnson',
      roomNumber: '301',
      checkIn: '2024-10-06',
      checkOut: '2024-10-08',
      status: 'pending',
      totalAmount: 420.75,
      items: [
        { id: '1', description: 'Standard Room (2 nights)', category: 'room', quantity: 2, unitPrice: 150, total: 300 },
        { id: '2', description: 'Breakfast', category: 'food', quantity: 4, unitPrice: 25, total: 100 },
        { id: '3', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 20.75, total: 20.75 }
      ]
    },
    {
      id: 'INV-2024-003',
      guestName: 'Michael Brown',
      roomNumber: '105',
      checkIn: '2024-10-04',
      checkOut: '2024-10-06',
      status: 'overdue',
      totalAmount: 890.25,
      items: [
        { id: '1', description: 'Suite Room (2 nights)', category: 'room', quantity: 2, unitPrice: 350, total: 700 },
        { id: '2', description: 'Fine Dining', category: 'food', quantity: 2, unitPrice: 65, total: 130 },
        { id: '3', description: 'Spa Services', category: 'services', quantity: 1, unitPrice: 120, total: 120 },
        { id: '4', description: 'Service Tax (5%)', category: 'taxes', quantity: 1, unitPrice: 40.25, total: 40.25 }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
            <div className="w-2 h-2 rounded-full mr-2 bg-emerald-500"></div>
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm bg-amber-100 text-amber-800 border border-amber-200">
            <div className="w-2 h-2 rounded-full mr-2 bg-amber-500"></div>
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm bg-red-100 text-red-800 border border-red-200">
            <div className="w-2 h-2 rounded-full mr-2 bg-red-500"></div>
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-green/5 rounded-3xl opacity-80"></div>
      <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-bl from-heritage-green/15 to-transparent"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-heritage-light/40 to-transparent"></div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="p-8 border-b border-heritage-neutral/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-heritage-green via-heritage-green/90 to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-heritage-green">Invoice Management</h3>
                <p className="text-sm text-heritage-neutral/70">Manage and track all invoices • {invoices.length} total</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-heritage-green to-heritage-green/90 hover:from-heritage-green/90 hover:to-heritage-green/80 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Invoice
              </button>
              <button className="px-6 py-3 text-sm font-semibold text-heritage-green hover:text-white bg-white/80 hover:bg-heritage-green border border-heritage-neutral/20 hover:border-heritage-green rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Export All
              </button>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-heritage-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by invoice ID, guest name, or room number..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="w-full pl-12 pr-4 py-3 border border-heritage-neutral/20 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green placeholder-heritage-neutral/50 focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-3 border border-heritage-neutral/20 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid Only</option>
                <option value="pending">Pending Only</option>
                <option value="overdue">Overdue Only</option>
              </select>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="px-4 py-3 border border-heritage-neutral/20 rounded-2xl bg-white/90 backdrop-blur-sm text-heritage-green focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoice Cards Grid */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => onInvoiceSelect(invoice)}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl ${
                  selectedInvoice?.id === invoice.id 
                    ? 'bg-heritage-green/10 border-heritage-green shadow-lg' 
                    : 'bg-white/70 border-heritage-neutral/20 hover:bg-white/90 hover:border-heritage-green/30 shadow-sm'
                }`}
              >
                {/* Status Border Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                  invoice.status === 'paid' ? 'bg-emerald-500' :
                  invoice.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>

                <div className="flex items-center justify-between">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-heritage-green group-hover:text-heritage-green/80 transition-colors">
                          {invoice.id}
                        </h4>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Guest Information */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-heritage-green/10 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-heritage-green">{invoice.guestName}</p>
                          <p className="text-sm text-heritage-neutral/70">Guest</p>
                        </div>
                      </div>

                      {/* Room Information */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-heritage-green">Room {invoice.roomNumber}</p>
                          <p className="text-sm text-heritage-neutral/70">Accommodation</p>
                        </div>
                      </div>

                      {/* Date Information */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-heritage-green">{invoice.checkIn}</p>
                          <p className="text-sm text-heritage-neutral/70">Check-in Date</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Content - Amount and Action */}
                  <div className="text-right ml-6">
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-heritage-green">
                        ${invoice.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-heritage-neutral/70">{invoice.items.length} line items</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-heritage-green hover:text-white bg-heritage-green/10 hover:bg-heritage-green rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                      View Details
                      <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Summary Statistics */}
        <div className="p-6 border-t border-heritage-neutral/10 bg-gradient-to-r from-heritage-light/10 to-heritage-green/5">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 text-center">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-heritage-neutral mb-1">Paid Invoices</p>
              <p className="text-xl font-bold text-emerald-600">
                ${invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-xs text-heritage-neutral/70">{invoices.filter(inv => inv.status === 'paid').length} invoices</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 text-center">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-heritage-neutral mb-1">Pending</p>
              <p className="text-xl font-bold text-amber-600">
                ${invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-xs text-heritage-neutral/70">{invoices.filter(inv => inv.status === 'pending').length} invoices</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 text-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-heritage-neutral mb-1">Overdue</p>
              <p className="text-xl font-bold text-red-600">
                ${invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-xs text-heritage-neutral/70">{invoices.filter(inv => inv.status === 'overdue').length} invoices</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-heritage-green/30 text-center">
              <div className="w-8 h-8 bg-heritage-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-heritage-neutral mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-heritage-green">
                ${invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-xs text-heritage-neutral/70">{invoices.length} total invoices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;