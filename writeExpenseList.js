const fs = require('fs');
const path = require('path');

const content = `import React, { useEffect, useMemo, useState } from 'react';
import type { Expense } from './types';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseSelect: (expense: Expense) => void;
  selectedExpense: Expense | null;
  selectedIds: Set<string>;
  onToggleSelect: (id: string, selected: boolean) => void;
  onSelectAll: (ids: string[], select: boolean) => void;
  onApprove: (ids: string[] | string) => void;
  onReject: (ids: string[] | string) => void;
  onMarkPaid: (ids: string[] | string) => void;
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
  onExpenseSelect, 
  selectedExpense, 
  selectedIds, 
  onToggleSelect, 
  onSelectAll, 
  onApprove, 
  onReject, 
  onMarkPaid 
}) => {
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState<'date_desc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const statusOk = filters.status === 'all' || e.status === filters.status;
      const categoryOk = filters.category === 'all' || e.category === filters.category;
      const search = filters.searchTerm.trim().toLowerCase();
      const searchOk = !search ||
        e.id.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search) ||
        e.vendor.toLowerCase().includes(search) ||
        e.submittedBy.toLowerCase().includes(search);
      return statusOk && categoryOk && searchOk;
    });
  }, [expenses, filters]);

  const sortedExpenses = useMemo(() => {
    const copy = [...filteredExpenses];
    if (sortBy === 'date_desc') {
      copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'amount_desc') {
      copy.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'amount_asc') {
      copy.sort((a, b) => a.amount - b.amount);
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

  const visibleIds = pagedExpenses.map(e => e.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));

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
      case 'paid':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: '✦',
          label: 'Paid',
          glow: 'shadow-blue-100'
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
                <div className="flex items-center justify-center shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-heritage-green to-heritage-neutral">
                  <svg className="text-white w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 text-sm font-bold text-white transition-all rounded-xl bg-gradient-to-r from-heritage-green to-heritage-neutral hover:shadow-lg hover:scale-105 active:scale-95">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Expense
                </span>
              </button>
              <button className="px-5 py-2.5 text-sm font-bold text-gray-700 transition-all bg-white border-2 rounded-xl border-heritage-neutral/30 hover:border-heritage-green hover:text-heritage-green hover:shadow-md">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </span>
              </button>
            </div>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between px-5 py-3 mt-4 border-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600">
                  <span className="text-sm font-black text-white">{selectedIds.size}</span>
                </div>
                <span className="text-sm font-bold text-emerald-900">
                  {selectedIds.size} expense{selectedIds.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onApprove(Array.from(selectedIds))} 
                  className="px-4 py-2 text-xs font-bold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-lg active:scale-95"
                >
                  ✓ Approve
                </button>
                <button 
                  onClick={() => onReject(Array.from(selectedIds))} 
                  className="px-4 py-2 text-xs font-bold text-white transition-all bg-red-600 rounded-lg hover:bg-red-700 hover:shadow-lg active:scale-95"
                >
                  ✗ Reject
                </button>
                <button 
                  onClick={() => onMarkPaid(Array.from(selectedIds))} 
                  className="px-4 py-2 text-xs font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                  ✦ Mark Paid
                </button>
                <button 
                  onClick={() => onSelectAll(Array.from(selectedIds), false)} 
                  className="px-4 py-2 text-xs font-bold transition-all bg-white border-2 rounded-lg text-emerald-700 border-emerald-200 hover:bg-emerald-50 active:scale-95"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2 lg:grid-cols-6">
            <label className="relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all bg-white border-2 border-gray-200 cursor-pointer rounded-xl hover:border-heritage-green group">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={(e) => onSelectAll(visibleIds, e.target.checked)}
                className="w-5 h-5 border-gray-300 rounded-md text-heritage-green focus:ring-heritage-green focus:ring-2"
              />
              <span className="text-gray-700 group-hover:text-heritage-green">Select Page</span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search expenses..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full py-3 pr-4 text-sm font-medium bg-white border-2 border-gray-200 pl-11 rounded-xl focus:border-heritage-green focus:ring-0 placeholder:text-gray-400"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:border-heritage-green focus:ring-0"
            >
              <option value="all">All Status</option>
              <option value="pending">⏱ Pending</option>
              <option value="approved">✓ Approved</option>
              <option value="rejected">✗ Rejected</option>
              <option value="paid">✦ Paid</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:border-heritage-green focus:ring-0"
            >
              <option value="all">All Categories</option>
              <option value="utilities">⚡ Utilities</option>
              <option value="supplies">📦 Supplies</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="marketing">📢 Marketing</option>
              <option value="staff">👥 Staff</option>
              <option value="food">🍽 Food & Beverage</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-4 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:border-heritage-green focus:ring-0"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date_desc' | 'amount_desc' | 'amount_asc')}
              className="px-4 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:border-heritage-green focus:ring-0"
            >
              <option value="date_desc">↓ Newest First</option>
              <option value="amount_desc">↓ Highest Amount</option>
              <option value="amount_asc">↑ Lowest Amount</option>
            </select>
          </div>
        </div>

        <div className="px-4 py-4">
          {sortedExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">No expenses found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or add a new expense</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pagedExpenses.map((expense) => {
                const statusConfig = getStatusConfig(expense.status);
                const categoryConfig = getCategoryConfig(expense.category);
                const isSelected = selectedIds.has(expense.id);
                const isActive = selectedExpense?.id === expense.id;

                return (
                  <div
                    key={expense.id}
                    onClick={() => onExpenseSelect(expense)}
                    className={\`
                      relative group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden
                      \${isActive 
                        ? 'ring-4 ring-heritage-green ring-opacity-40 shadow-2xl scale-[1.01]' 
                        : 'hover:shadow-xl hover:scale-[1.005]'
                      }
                    \`}
                  >
                    <div className={\`
                      absolute inset-0 transition-opacity duration-300
                      \${isActive 
                        ? 'bg-gradient-to-r from-heritage-light via-white to-heritage-light opacity-100' 
                        : 'bg-white group-hover:bg-gradient-to-r group-hover:from-gray-50 group-hover:via-white group-hover:to-gray-50'
                      }
                    \`} />

                    <div className={\`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b \${categoryConfig.gradient} transition-all duration-300 \${isActive ? 'w-2' : 'group-hover:w-2'}\`} />

                    <div className="relative px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center pt-1">
                          <input
                            type="checkbox"
                            className="w-5 h-5 transition-all border-gray-300 rounded-lg text-heritage-green focus:ring-heritage-green focus:ring-2 hover:scale-110"
                            checked={isSelected}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => onToggleSelect(expense.id, e.target.checked)}
                          />
                        </div>

                        <div className={\`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br \${categoryConfig.gradient} text-white shadow-lg transition-all duration-300 \${isActive ? 'scale-110' : 'group-hover:scale-105'}\`}>
                          {categoryConfig.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="mb-1 text-base font-bold text-gray-900 truncate">
                                {expense.description}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className={\`px-2.5 py-1 rounded-lg border-2 font-bold \${statusConfig.badge} flex items-center gap-1\`}>
                                  <span>{statusConfig.icon}</span>
                                  <span>{statusConfig.label}</span>
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                                  {categoryConfig.label}
                                </span>
                                {expense.receiptUrl && (
                                  <span className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 font-semibold border border-green-200">
                                    📎 Receipt
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex-shrink-0 text-right">
                              <div className="text-2xl font-black text-gray-900">
                                {formatCurrency(expense.amount)}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="font-medium">{expense.vendor}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">{expense.date}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">{expense.submittedBy}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 font-mono text-[10px] font-bold text-gray-600 tracking-wider">
                              #{expense.id}
                            </span>
                          </div>

                          <div className="flex gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); onApprove(expense.id); }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors active:scale-95"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onReject(expense.id); }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors active:scale-95"
                            >
                              ✗ Reject
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onMarkPaid(expense.id); }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
                            >
                              ✦ Mark Paid
                            </button>
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
          <div className="flex items-center justify-between px-8 py-5 border-t bg-gradient-to-r from-heritage-light/20 via-white to-heritage-light/20 border-heritage-neutral/20">
            <div className="text-sm font-semibold text-gray-600">
              Showing <span className="font-black text-heritage-green">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-black text-heritage-green">{Math.min(page * pageSize, sortedExpenses.length)}</span> of{' '}
              <span className="font-black text-heritage-green">{sortedExpenses.length}</span> expenses
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={\`
                  px-4 py-2 text-sm font-bold rounded-xl transition-all
                  \${page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-heritage-neutral/30 text-gray-700 hover:border-heritage-green hover:text-heritage-green hover:shadow-lg active:scale-95'
                  }
                \`}
              >
                ← Previous
              </button>
              
              <div className="items-center hidden gap-1 sm:flex">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={\`
                        w-10 h-10 rounded-xl text-sm font-bold transition-all
                        \${page === pageNum
                          ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-lg scale-110'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-heritage-green hover:text-heritage-green'
                        }
                      \`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={\`
                  px-4 py-2 text-sm font-bold rounded-xl transition-all
                  \${page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-heritage-neutral/30 text-gray-700 hover:border-heritage-green hover:text-heritage-green hover:shadow-lg active:scale-95'
                  }
                \`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
`;

const filePath = path.join(__dirname, 'src', 'components', 'finances', 'expenses', 'ExpenseList.tsx');
fs.writeFileSync(filePath, content, 'utf8');
console.log('ExpenseList.tsx created successfully!');
