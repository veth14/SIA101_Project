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
        return <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">Paid</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'overdue':
        return <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">Overdue</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'border-l-green-500 bg-green-50/50';
      case 'pending':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'overdue':
        return 'border-l-red-500 bg-red-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header with Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Invoice List</h3>
            <p className="text-sm text-gray-600">{invoices.length} invoices found</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors">
              New Invoice
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search invoices..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoice List */}
      <div className="max-h-[600px] overflow-y-auto">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            onClick={() => onInvoiceSelect(invoice)}
            className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedInvoice?.id === invoice.id ? 'bg-[#82A33D]/5 border-l-[#82A33D]' : getStatusColor(invoice.status)
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-semibold text-gray-900">{invoice.id}</h4>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-gray-700 font-medium mb-1">{invoice.guestName}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Room {invoice.roomNumber}</span>
                  <span>{invoice.checkIn} to {invoice.checkOut}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  ${invoice.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{invoice.items.length} items</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-lg font-bold text-green-600">
              ${invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-lg font-bold text-yellow-600">
              ${invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-lg font-bold text-red-600">
              ${invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;