import React, { useState } from 'react';

export interface Expense {
  id: string;
  description: string;
  category: 'utilities' | 'supplies' | 'maintenance' | 'marketing' | 'staff' | 'food' | 'other';
  amount: number;
  vendor: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedBy: string;
  approvedBy?: string;
  receiptUrl?: string;
  notes?: string;
}

interface ExpenseListProps {
  onExpenseSelect: (expense: Expense) => void;
  selectedExpense: Expense | null;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onExpenseSelect, selectedExpense }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  // Sample expense data
  const expenses: Expense[] = [
    {
      id: 'EXP-2024-001',
      description: 'Monthly electricity bill',
      category: 'utilities',
      amount: 2450.00,
      vendor: 'City Power Company',
      date: '2024-10-05',
      status: 'approved',
      submittedBy: 'John Manager',
      approvedBy: 'Sarah Director',
      receiptUrl: '/receipts/exp-001.pdf',
      notes: 'Higher than usual due to increased AC usage'
    },
    {
      id: 'EXP-2024-002',
      description: 'Cleaning supplies and chemicals',
      category: 'supplies',
      amount: 850.50,
      vendor: 'CleanCorp Supplies',
      date: '2024-10-06',
      status: 'pending',
      submittedBy: 'Mike Housekeeping',
      notes: 'Monthly stock replenishment'
    },
    {
      id: 'EXP-2024-003',
      description: 'HVAC system maintenance',
      category: 'maintenance',
      amount: 1200.00,
      vendor: 'TechFix Solutions',
      date: '2024-10-07',
      status: 'pending',
      submittedBy: 'Tom Maintenance',
      notes: 'Quarterly maintenance check'
    },
    {
      id: 'EXP-2024-004',
      description: 'Social media advertising',
      category: 'marketing',
      amount: 500.00,
      vendor: 'Digital Marketing Pro',
      date: '2024-10-08',
      status: 'rejected',
      submittedBy: 'Lisa Marketing',
      notes: 'Rejected - needs budget approval first'
    },
    {
      id: 'EXP-2024-005',
      description: 'Fresh produce delivery',
      category: 'food',
      amount: 1850.75,
      vendor: 'Farm Fresh Suppliers',
      date: '2024-10-08',
      status: 'paid',
      submittedBy: 'Chef Robert',
      approvedBy: 'Sarah Director',
      notes: 'Weekly fresh produce order'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">✓ Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">⏳ Pending</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">✗ Rejected</span>;
      case 'paid':
        return <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">💰 Paid</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'utilities':
        return (
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      case 'supplies':
        return (
          <div className="p-2 bg-green-50 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        );
      case 'maintenance':
        return (
          <div className="p-2 bg-orange-50 rounded-lg">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case 'marketing':
        return (
          <div className="p-2 bg-purple-50 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        );
      case 'staff':
        return (
          <div className="p-2 bg-indigo-50 rounded-lg">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        );
      case 'food':
        return (
          <div className="p-2 bg-red-50 rounded-lg">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2H1m6 16a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
        );
      case 'other':
        return (
          <div className="p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'border-l-green-500 bg-green-50/30';
      case 'pending':
        return 'border-l-yellow-500 bg-yellow-50/30';
      case 'rejected':
        return 'border-l-red-500 bg-red-50/30';
      case 'paid':
        return 'border-l-blue-500 bg-blue-50/30';
      default:
        return 'border-l-gray-500 bg-gray-50/30';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'utilities':
        return 'Utilities';
      case 'supplies':
        return 'Supplies';
      case 'maintenance':
        return 'Maintenance';
      case 'marketing':
        return 'Marketing';
      case 'staff':
        return 'Staff';
      case 'food':
        return 'Food & Beverage';
      case 'other':
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header with Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Expense Records</h3>
            <p className="text-sm text-gray-600">{expenses.length} expenses found</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors">
              New Expense
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Categories</option>
            <option value="utilities">Utilities</option>
            <option value="supplies">Supplies</option>
            <option value="maintenance">Maintenance</option>
            <option value="marketing">Marketing</option>
            <option value="staff">Staff</option>
            <option value="food">Food & Beverage</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Expense List */}
      <div className="max-h-[600px] overflow-y-auto">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            onClick={() => onExpenseSelect(expense)}
            className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedExpense?.id === expense.id ? 'bg-[#82A33D]/5 border-l-[#82A33D]' : getStatusColor(expense.status)
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getCategoryIcon(expense.category)}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-gray-900">{expense.id}</h4>
                    {getStatusBadge(expense.status)}
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{expense.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{getCategoryName(expense.category)}</span>
                    <span>{expense.vendor}</span>
                    <span>{expense.date}</span>
                    <span>by {expense.submittedBy}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  ${expense.amount.toFixed(2)}
                </p>
                {expense.receiptUrl && (
                  <p className="text-sm text-green-600">📎 Receipt</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-lg font-bold text-yellow-600">
              ${expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-lg font-bold text-green-600">
              ${expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-lg font-bold text-blue-600">
              ${expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-lg font-bold text-red-600">
              ${expenses.filter(e => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overall Total</p>
            <p className="text-lg font-bold text-gray-900">
              ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;