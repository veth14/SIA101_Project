import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { FileText, Plus, Download } from 'lucide-react';
import { ExpenseModal } from './ExpenseModal';
import NewExpenseModal from './NewExpenseModal';
import type { Expense } from './types';

interface ExpenseListProps {
  expenses: Expense[];
  onApprove: (ids: string[] | string) => void;
  onReject: (ids: string[] | string) => void;
  onCreate?: (expense: Expense) => void;
  // Backwards-compatible optional props (kept for pages still using older API)
  onExpenseSelect?: (expense: Expense) => void;
  selectedExpense?: Expense | null;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string, selected: boolean) => void;
  onSelectAll?: (ids: string[], select: boolean) => void;
  onMarkPaid?: (ids: string[] | string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
};

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  onApprove, 
  onReject,
  onExpenseSelect,
  onCreate,
}) => {
  // Local fallback storage for newly created expenses if parent doesn't push them into `expenses` prop
  const [localCreated, setLocalCreated] = useState<Expense[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState<'date_desc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [page, setPage] = useState(1);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectPromptOpen, setIsRejectPromptOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // Local fallback storage for newly created expenses (if parent doesn't push them)
  const pageSize = 5;

  const combinedExpenses = useMemo(() => {
    return [...localCreated, ...expenses];
  }, [localCreated, expenses]);

  const filteredExpenses = useMemo(() => {
    return combinedExpenses.filter((e) => {
  // Show approved, rejected and pending in this view (pending is important)
  // If user selects a status filter, honor it; otherwise default to showing approved/rejected/pending
  const allowedStatuses = ['approved', 'rejected', 'pending'];
  const statusOk = (filters.status === 'all' && allowedStatuses.includes(e.status)) || e.status === filters.status;
  // Date range filtering
  const now = new Date();
  const expDate = e.date ? new Date(e.date) : null;
  let dateOk = true;
  if (filters.dateRange === 'today' && expDate) {
    dateOk = expDate.getFullYear() === now.getFullYear() && expDate.getMonth() === now.getMonth() && expDate.getDate() === now.getDate();
  } else if (filters.dateRange === 'week' && expDate) {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    dateOk = expDate >= sevenDaysAgo && expDate <= now;
  } else if (filters.dateRange === 'month' && expDate) {
    dateOk = expDate.getFullYear() === now.getFullYear() && expDate.getMonth() === now.getMonth();
  }
      const categoryOk = filters.category === 'all' || e.category === filters.category;
      const search = filters.searchTerm.trim().toLowerCase();
      const searchOk = !search ||
        e.id.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search) ||
        e.vendor.toLowerCase().includes(search) ||
        e.submittedBy.toLowerCase().includes(search);
      return statusOk && categoryOk && searchOk && dateOk;
    });
  }, [combinedExpenses, filters]);

  const sortedExpenses = useMemo(() => {
    const copy = [...filteredExpenses];
    
    // Priority sorting: Pending first, then Approved, then Rejected
    const getStatusPriority = (status: string) => {
      if (status === 'pending') return 1;
      if (status === 'approved') return 2;
      if (status === 'rejected') return 3;
      return 4;
    };
    
    if (sortBy === 'date_desc') {
      copy.sort((a, b) => {
        const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else if (sortBy === 'amount_desc') {
      copy.sort((a, b) => {
        const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
        if (priorityDiff !== 0) return priorityDiff;
        return b.amount - a.amount;
      });
    } else if (sortBy === 'amount_asc') {
      copy.sort((a, b) => {
        const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
        if (priorityDiff !== 0) return priorityDiff;
        return a.amount - b.amount;
      });
    }
    return copy;
  }, [filteredExpenses, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  

  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / pageSize));
  const pagedExpenses = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedExpenses.slice(start, start + pageSize);
  }, [sortedExpenses, page]);

  const handleExpenseClick = useCallback((expense: Expense) => {
    // Always allow opening the modal to view details (including rejected)
    setSelectedExpense(expense);
    if (typeof onExpenseSelect === 'function') onExpenseSelect(expense);
    setIsModalOpen(true);
  }, [onExpenseSelect]);

  useEffect(() => {
    const handler = (e: Event) => {
      // open newly created expense details in the modal
      // event detail should be the Expense object
      const custom = e as CustomEvent<Expense>;
      if (custom?.detail) {
        handleExpenseClick(custom.detail);
      }
    };
    window.addEventListener('expense:created:open', handler as EventListener);
    return () => window.removeEventListener('expense:created:open', handler as EventListener);
  }, [handleExpenseClick]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: '✓',
          label: 'Approved',
          glow: 'shadow-emerald-100'
        };
      case 'pending':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: '⏱',
          label: 'Pending',
          glow: 'shadow-amber-100'
        };
      case 'rejected':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: '✗',
          label: 'Rejected',
          glow: 'shadow-rose-100'
        };
      default:
        return {
          badge: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: '○',
          label: 'Unknown',
          glow: 'shadow-gray-100'
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'utilities':
        return {
          gradient: 'from-cyan-500 to-blue-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          label: 'Utilities'
        };
      case 'supplies':
        return {
          gradient: 'from-green-500 to-emerald-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
          label: 'Supplies'
        };
      case 'maintenance':
        return {
          gradient: 'from-orange-500 to-red-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          label: 'Maintenance'
        };
      case 'marketing':
        return {
          gradient: 'from-purple-500 to-pink-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          ),
          label: 'Marketing'
        };
      case 'staff':
        return {
          gradient: 'from-indigo-500 to-purple-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ),
          label: 'Staff'
        };
      case 'food':
        return {
          gradient: 'from-rose-500 to-pink-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2H1m6 16a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          ),
          label: 'Food & Beverage'
        };
      default:
        return {
          gradient: 'from-gray-500 to-slate-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
          label: 'Other'
        };
    }
  };

  return (
    <div className="relative overflow-hidden bg-white shadow-2xl rounded-3xl">
      <div className="absolute inset-0 opacity-[0.02]" style={{ 
        backgroundImage: 'radial-gradient(circle at 2px 2px, #82A33D 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />
      
      <div className="relative z-10">
        <div className="px-8 py-6 border-b bg-gradient-to-r from-heritage-light/30 via-white to-heritage-light/30 border-heritage-neutral/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green/30 to-heritage-neutral/30 rounded-2xl blur-lg -z-10"></div>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">Expense Records</h2>
                <p className="mt-0.5 text-sm font-medium text-gray-500">
                  <span className="font-bold text-heritage-green">{filteredExpenses.length}</span> expenses •
                  <span className="ml-1.5">{formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.amount, 0))} total</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Showing <span className="font-black text-heritage-green">{sortedExpenses.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
                  <span className="font-black text-heritage-green">{Math.min(page * pageSize, sortedExpenses.length)}</span> of{' '}
                  <span className="font-black text-heritage-green">{sortedExpenses.length}</span> expenses
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsCreateOpen(true)} className="px-5 py-2.5 text-sm font-bold text-white transition-all rounded-xl bg-gradient-to-r from-heritage-green to-heritage-neutral hover:shadow-lg hover:scale-105 active:scale-95">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Expense
                </span>
              </button>
              <button className="px-5 py-2.5 text-sm font-bold text-gray-700 transition-all bg-white border-2 rounded-xl border-heritage-neutral/30 hover:border-heritage-green hover:text-heritage-green hover:shadow-md">
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </span>
              </button>
            </div>
          </div>

          {/* Modern Filters Section */}
          <div className="mt-5 space-y-3">
            {/* Search Bar - Full Width */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by ID, description, vendor, or submitter..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full py-3.5 pl-12 pr-4 text-sm font-medium bg-white border-2 rounded-xl border-gray-200 focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Filter Dropdowns - Grid Layout */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Status Filter */}
              <div className="relative">
                <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-3 text-sm font-semibold text-gray-700 transition-all bg-white border-2 border-gray-200 appearance-none cursor-pointer rounded-xl focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20"
                >
                  <option value="all">All Status</option>
                  <option value="pending">⏱ Pending</option>
                  <option value="approved">✓ Approved</option>
                  <option value="rejected">✗ Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-3 text-sm font-semibold text-gray-700 transition-all bg-white border-2 border-gray-200 appearance-none cursor-pointer rounded-xl focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20"
                >
                  <option value="all">All Categories</option>
                  <option value="utilities">⚡ Utilities</option>
                  <option value="supplies">📦 Supplies</option>
                  <option value="maintenance">🔧 Maintenance</option>
                  <option value="marketing">📢 Marketing</option>
                  <option value="staff">👥 Staff</option>
                  <option value="food">🍽 Food & Beverage</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="relative">
                <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-4 py-3 text-sm font-semibold text-gray-700 transition-all bg-white border-2 border-gray-200 appearance-none cursor-pointer rounded-xl focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Sort By Filter */}
              <div className="relative">
                <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date_desc' | 'amount_desc' | 'amount_asc')}
                  className="w-full px-4 py-3 text-sm font-semibold text-gray-700 transition-all bg-white border-2 border-gray-200 appearance-none cursor-pointer rounded-xl focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20"
                >
                  <option value="date_desc">↓ Newest First</option>
                  <option value="amount_desc">↓ Highest Amount</option>
                  <option value="amount_asc">↑ Lowest Amount</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Cards - Fixed Height Container for 5 items */}
        <div className="px-4 py-4 min-h-[550px]">
          {sortedExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[500px]">
              <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">No expenses found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or add a new expense</p>
            </div>
          ) : (
            <div className="space-y-2 min-h-[500px]">{pagedExpenses.map((expense) => {
                const statusConfig = getStatusConfig(expense.status);
                const categoryConfig = getCategoryConfig(expense.category);
                const isRejected = expense.status === 'rejected';
                const isLocked = expense.status === 'rejected';

                return (
                  <div
                    key={expense.id}
                    onClick={() => handleExpenseClick(expense)}
                    className={`
                      relative group transition-all duration-200 rounded-xl overflow-hidden
                      ${isRejected ? 'opacity-80 cursor-pointer' : 'cursor-pointer'}
                      ${!isRejected ? 'hover:shadow-lg hover:scale-[1.002] hover:ring-2 hover:ring-heritage-green/30' : ''}
                    `}
                  >
                    <div className="absolute inset-0 transition-opacity duration-200 bg-white group-hover:bg-gradient-to-r group-hover:from-gray-50 group-hover:via-white group-hover:to-gray-50" />

                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${categoryConfig.gradient} transition-all duration-200 group-hover:w-1.5`} />

                    <div className="relative px-4 py-3">
                      <div className="flex items-start gap-3">
                        {/* Category Icon */}
                        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${categoryConfig.gradient} text-white shadow-md transition-all duration-200 group-hover:scale-105`}>
                          {categoryConfig.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <div className="flex-1 min-w-0">
                              <h3 className="mb-1 text-sm font-bold text-gray-900 truncate">
                                {expense.description}
                              </h3>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                <span className={`px-2 py-0.5 rounded border font-bold ${statusConfig.badge} flex items-center gap-1`}>
                                  <span>{statusConfig.icon}</span>
                                  <span>{statusConfig.label}</span>
                                </span>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                                  {categoryConfig.label}
                                </span>
                                {expense.receiptUrl && (
                                  <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold border border-green-200">
                                    📎
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex-shrink-0 text-right">
                              <div className="text-lg font-bold text-gray-900">
                                {formatCurrency(expense.amount)}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="font-medium">{expense.vendor}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">{expense.date}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">{expense.submittedBy}</span>
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-[10px] font-bold text-gray-600">
                              #{expense.id}
                            </span>
                            {isLocked && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-[10px] font-bold">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                LOCKED
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {sortedExpenses.length > 0 && (
          <div className="px-8 py-6 border-t bg-gradient-to-r from-heritage-light/20 via-white to-heritage-light/20 border-heritage-neutral/20">
            {/* Pagination controls centered */}
            <div className="flex items-center justify-center gap-2">{/* Previous button */}
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`
                  px-5 py-2.5 text-sm font-bold rounded-xl transition-all
                  ${page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-heritage-neutral/30 text-gray-700 hover:border-heritage-green hover:text-heritage-green hover:shadow-lg active:scale-95'
                  }
                `}
              >
                ← Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`
                        w-11 h-11 rounded-xl text-sm font-bold transition-all
                        ${page === pageNum
                          ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-lg scale-110'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-heritage-green hover:text-heritage-green hover:scale-105'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`
                  px-5 py-2.5 text-sm font-bold rounded-xl transition-all
                  ${page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-heritage-neutral/30 text-gray-700 hover:border-heritage-green hover:text-heritage-green hover:shadow-lg active:scale-95'
                  }
                `}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expense Details Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }}
      >
        {selectedExpense && (
          <div className="space-y-6">
            {/* Main Info Card */}
            <div className="relative p-6 overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
              <div className="flex items-start gap-6">
                {/* Category Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryConfig(selectedExpense.category).gradient} flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{getCategoryConfig(selectedExpense.category).icon}</span>
                </div>
                
                {/* Title and Status */}
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1 text-xl font-bold leading-tight text-gray-900">
                    {selectedExpense.description}
                  </h4>
                  <p className="mb-3 text-sm font-medium text-gray-500">
                    Expense #{selectedExpense.id}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm ${getStatusConfig(selectedExpense.status).badge}`}>
                      <span>{getStatusConfig(selectedExpense.status).icon}</span>
                      {getStatusConfig(selectedExpense.status).label}
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm">
                      {getCategoryConfig(selectedExpense.category).label}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex-shrink-0 text-right">
                  <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">Amount</p>
                  <p className="text-3xl font-black text-heritage-green">
                    {formatCurrency(selectedExpense.amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details - expanded for company-style fields */}
            <div>
              <h5 className="mb-3 text-sm font-bold tracking-wider text-gray-500 uppercase">Transaction Details</h5>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Vendor</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{selectedExpense.vendor}</p>
                  {selectedExpense.vendorContact && (
                    <p className="mt-2 text-xs text-gray-500">{selectedExpense.vendorContact}</p>
                  )}
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Date</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{selectedExpense.date}</p>
                  <p className="mt-2 text-xs text-gray-500">Created: {selectedExpense.createdAt ?? '—'}</p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Submitted / Approved</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{selectedExpense.submittedBy}</p>
                  <p className="mt-2 text-sm text-gray-600">Approved By: {selectedExpense.approvedBy ?? '—'}</p>
                </div>

                <div className="col-span-1 p-4 bg-white border border-gray-200 md:col-span-2 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Identifiers</span>
                  </div>
                  <p className="text-sm text-gray-700">Invoice: <span className="font-semibold">{selectedExpense.invoiceNumber ?? '—'}</span></p>
                  <p className="text-sm text-gray-700">PO: <span className="font-semibold">{selectedExpense.purchaseOrder ?? '—'}</span></p>
                  <p className="text-sm text-gray-700">Project: <span className="font-semibold">{selectedExpense.project ?? '—'}</span></p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Accounting</span>
                  </div>
                  <p className="text-sm text-gray-700">Account: <span className="font-semibold">{selectedExpense.accountCode ?? '—'}</span></p>
                  <p className="text-sm text-gray-700">Cost Center: <span className="font-semibold">{selectedExpense.costCenter ?? '—'}</span></p>
                  <p className="text-sm text-gray-700">Payment Method: <span className="font-semibold">{selectedExpense.paymentMethod ?? '—'}</span></p>
                </div>

                <div className="col-span-1 p-4 bg-white border border-gray-200 md:col-span-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Notes</span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedExpense.notes ?? '—'}</p>
                </div>

                {selectedExpense.attachments && selectedExpense.attachments.length > 0 && (
                  <div className="col-span-1 p-4 bg-white border border-gray-200 md:col-span-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">Attachments</span>
                    </div>
                    <ul className="list-disc list-inside">
                      {selectedExpense.attachments.map((a, i) => (
                        <li key={i}><a href={a} target="_blank" rel="noopener noreferrer" className="underline text-heritage-green">Attachment {i + 1}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Section */}
            {selectedExpense.receiptUrl && (
              <div className="p-5 border-2 border-green-200 bg-green-50 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-900">Receipt Available</p>
                      <p className="text-xs text-green-700">Click to view document</p>
                    </div>
                  </div>
                  <a 
                    href={selectedExpense.receiptUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedExpense.status === 'pending' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove([selectedExpense.id]);
                    setIsModalOpen(false);
                  }}
                  className="inline-flex items-center justify-center flex-1 gap-2 px-6 py-4 font-bold text-white transition-colors bg-green-600 shadow-lg hover:bg-green-700 rounded-xl shadow-green-600/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve Expense
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // open reject prompt to capture reason
                    setRejectNotes('');
                    setIsRejectPromptOpen(true);
                  }}
                  className="inline-flex items-center justify-center flex-1 gap-2 px-6 py-4 font-bold text-white transition-colors bg-red-600 shadow-lg hover:bg-red-700 rounded-xl shadow-red-600/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject Expense
                </button>
              </div>
            )}

            {/* Reject Prompt Inline */}
            {isRejectPromptOpen && (
              <div className="p-4 mt-4 border border-red-200 bg-red-50 rounded-xl">
                <h6 className="mb-2 text-sm font-bold text-red-700">Provide rejection notes</h6>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Reason for rejection (required)"
                  className="w-full p-3 bg-white border border-red-200 rounded-md resize-none h-28"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      // cancel
                      setIsRejectPromptOpen(false);
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedExpense) return;
                      if (!rejectNotes.trim()) return; // require notes
                      // call parent reject handler and pass notes via a simple local update
                      const payload = [selectedExpense.id];
                      // Attach rejection metadata locally for display
                      selectedExpense.rejectionReason = rejectNotes.trim();
                      selectedExpense.rejectedBy = 'You';
                      selectedExpense.rejectedAt = new Date().toISOString();
                      onReject(payload);
                      setIsRejectPromptOpen(false);
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded-xl"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            )}

            {/* Status Message for Non-Pending */}
            {selectedExpense.status !== 'pending' && (
              <div>
                <div className="p-4 mb-3 text-center bg-gray-100 border border-gray-300 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600">
                    This expense has already been {selectedExpense.status}. No actions available.
                  </p>
                </div>

                {selectedExpense.status === 'rejected' && (
                  <div className="p-4 border bg-rose-50 border-rose-200 rounded-xl">
                    <h6 className="mb-2 text-sm font-bold text-rose-700">Rejection Details</h6>
                    <p className="text-sm text-rose-800"><span className="font-semibold">Reason:</span> {selectedExpense.rejectionReason ?? 'No reason provided'}</p>
                    <p className="mt-2 text-sm text-rose-800"><span className="font-semibold">Rejected By:</span> {selectedExpense.rejectedBy ?? '—'}</p>
                    <p className="mt-1 text-xs text-rose-700">At: {selectedExpense.rejectedAt ?? '—'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ExpenseModal>

      {/* New Expense Modal (separate component) */}
      <NewExpenseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(e) => {
          if (typeof onCreate === 'function') {
            onCreate(e);
          } else {
            // parent didn't handle adding new expense; keep locally so user sees it immediately
            setLocalCreated((prev) => [e, ...prev]);
          }
          setIsCreateOpen(false);
        }}
      />
    </div>
  );
};

export default ExpenseList;
