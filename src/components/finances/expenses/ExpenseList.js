import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useCallback } from 'react';
import { FileText, Plus, Download } from 'lucide-react';
import { ExpenseModal } from './ExpenseModal';
import NewExpenseModal from './NewExpenseModal';
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);
};
const ExpenseList = ({ expenses, onApprove, onReject, onExpenseSelect, onCreate, }) => {
    // Local fallback storage for newly created expenses if parent doesn't push them into `expenses` prop
    const [localCreated, setLocalCreated] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
        dateRange: 'all',
        searchTerm: ''
    });
    const [sortBy, setSortBy] = useState('date_desc');
    const [page, setPage] = useState(1);
    const [selectedExpense, setSelectedExpense] = useState(null);
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
            }
            else if (filters.dateRange === 'week' && expDate) {
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 7);
                dateOk = expDate >= sevenDaysAgo && expDate <= now;
            }
            else if (filters.dateRange === 'month' && expDate) {
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
        const getStatusPriority = (status) => {
            if (status === 'pending')
                return 1;
            if (status === 'approved')
                return 2;
            if (status === 'rejected')
                return 3;
            return 4;
        };
        if (sortBy === 'date_desc') {
            copy.sort((a, b) => {
                const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
                if (priorityDiff !== 0)
                    return priorityDiff;
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
        }
        else if (sortBy === 'amount_desc') {
            copy.sort((a, b) => {
                const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
                if (priorityDiff !== 0)
                    return priorityDiff;
                return b.amount - a.amount;
            });
        }
        else if (sortBy === 'amount_asc') {
            copy.sort((a, b) => {
                const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
                if (priorityDiff !== 0)
                    return priorityDiff;
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
    const handleExpenseClick = useCallback((expense) => {
        // Always allow opening the modal to view details (including rejected)
        setSelectedExpense(expense);
        if (typeof onExpenseSelect === 'function')
            onExpenseSelect(expense);
        setIsModalOpen(true);
    }, [onExpenseSelect]);
    useEffect(() => {
        const handler = (e) => {
            // open newly created expense details in the modal
            // event detail should be the Expense object
            const custom = e;
            if (custom?.detail) {
                handleExpenseClick(custom.detail);
            }
        };
        window.addEventListener('expense:created:open', handler);
        return () => window.removeEventListener('expense:created:open', handler);
    }, [handleExpenseClick]);
    const getStatusConfig = (status) => {
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
    const getCategoryConfig = (category) => {
        switch (category) {
            case 'utilities':
                return {
                    gradient: 'from-cyan-500 to-blue-600',
                    icon: (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) })),
                    label: 'Utilities'
                };
            case 'supplies':
                return {
                    gradient: 'from-green-500 to-emerald-600',
                    icon: (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) })),
                    label: 'Supplies'
                };
            case 'maintenance':
                return {
                    gradient: 'from-orange-500 to-red-600',
                    icon: (_jsxs("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] })),
                    label: 'Maintenance'
                };
            case 'marketing':
                return {
                    gradient: 'from-purple-500 to-pink-600',
                    icon: (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" }) })),
                    label: 'Marketing'
                };
            case 'staff':
                return {
                    gradient: 'from-indigo-500 to-purple-600',
                    icon: (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" }) })),
                    label: 'Staff'
                };
            case 'food':
                return {
                    gradient: 'from-rose-500 to-pink-600',
                    icon: (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2H1m6 16a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" }) })),
                    label: 'Food & Beverage'
                };
            default:
                return {
                    gradient: 'from-gray-500 to-slate-600',
                    icon: (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) })),
                    label: 'Other'
                };
        }
    };
    return (_jsxs("div", { className: "relative overflow-hidden bg-white shadow-2xl rounded-3xl", children: [_jsx("div", { className: "absolute inset-0 opacity-[0.02]", style: {
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #82A33D 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                } }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "px-8 py-6 border-b bg-gradient-to-r from-heritage-light/30 via-white to-heritage-light/30 border-heritage-neutral/20", children: [_jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx("svg", { className: "w-6 h-6 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green/30 to-heritage-neutral/30 rounded-2xl blur-lg -z-10" })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-black tracking-tight text-gray-900", children: "Expense Records" }), _jsxs("p", { className: "mt-0.5 text-sm font-medium text-gray-500", children: [_jsx("span", { className: "font-bold text-heritage-green", children: filteredExpenses.length }), " expenses \u2022", _jsxs("span", { className: "ml-1.5", children: [formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.amount, 0)), " total"] })] }), _jsxs("p", { className: "mt-2 text-sm font-semibold text-gray-600", children: ["Showing ", _jsx("span", { className: "font-black text-heritage-green", children: sortedExpenses.length > 0 ? (page - 1) * pageSize + 1 : 0 }), " to", ' ', _jsx("span", { className: "font-black text-heritage-green", children: Math.min(page * pageSize, sortedExpenses.length) }), " of", ' ', _jsx("span", { className: "font-black text-heritage-green", children: sortedExpenses.length }), " expenses"] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setIsCreateOpen(true), className: "px-5 py-2.5 text-sm font-bold text-white transition-all rounded-xl bg-gradient-to-r from-heritage-green to-heritage-neutral hover:shadow-lg hover:scale-105 active:scale-95", children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Expense"] }) }), _jsx("button", { className: "px-5 py-2.5 text-sm font-bold text-gray-700 transition-all bg-white border-2 rounded-xl border-heritage-neutral/30 hover:border-heritage-green hover:text-heritage-green hover:shadow-md", children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Export"] }) })] })] }), _jsx("div", { className: "mt-5", children: _jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none", children: _jsx("svg", { className: "w-5 h-5 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Search by ID, description, vendor, or submitter...", value: filters.searchTerm, onChange: (e) => setFilters({ ...filters, searchTerm: e.target.value }), className: "w-full py-3 pl-12 pr-4 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 placeholder:text-gray-400 transition-all" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 md:justify-end", children: [_jsxs("div", { className: "relative", children: [_jsxs("select", { value: filters.status, onChange: (e) => setFilters({ ...filters, status: e.target.value }), className: "min-w-[130px] px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "pending", children: "\u23F1 Pending" }), _jsx("option", { value: "approved", children: "\u2713 Approved" }), _jsx("option", { value: "rejected", children: "\u2717 Rejected" })] }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: _jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: filters.category, onChange: (e) => setFilters({ ...filters, category: e.target.value }), className: "min-w-[150px] px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green", children: [_jsx("option", { value: "all", children: "All Categories" }), _jsx("option", { value: "utilities", children: "\u26A1 Utilities" }), _jsx("option", { value: "supplies", children: "\uD83D\uDCE6 Supplies" }), _jsx("option", { value: "maintenance", children: "\uD83D\uDD27 Maintenance" }), _jsx("option", { value: "marketing", children: "\uD83D\uDCE2 Marketing" }), _jsx("option", { value: "staff", children: "\uD83D\uDC65 Staff" }), _jsx("option", { value: "food", children: "\uD83C\uDF7D Food & Beverage" })] }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: _jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: filters.dateRange, onChange: (e) => setFilters({ ...filters, dateRange: e.target.value }), className: "min-w-[130px] px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green", children: [_jsx("option", { value: "all", children: "All Time" }), _jsx("option", { value: "today", children: "Today" }), _jsx("option", { value: "week", children: "This Week" }), _jsx("option", { value: "month", children: "This Month" })] }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: _jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "min-w-[150px] px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green", children: [_jsx("option", { value: "date_desc", children: "\u2193 Newest First" }), _jsx("option", { value: "amount_desc", children: "\u2193 Highest Amount" }), _jsx("option", { value: "amount_asc", children: "\u2191 Lowest Amount" })] }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: _jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })] })] })] }) })] }), _jsx("div", { className: "px-4 py-4", children: sortedExpenses.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsx("div", { className: "flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full", children: _jsx(FileText, { className: "w-10 h-10 text-gray-400" }) }), _jsx("h3", { className: "mb-1 text-lg font-bold text-gray-900", children: "No expenses found" }), _jsx("p", { className: "text-sm text-gray-500", children: "Try adjusting your filters or add a new expense" })] })) : (_jsx("div", { className: "overflow-x-auto rounded-2xl border border-gray-100 bg-white/80 shadow-sm", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Ref #" }), _jsx("th", { className: "px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Description" }), _jsx("th", { className: "px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Vendor" }), _jsx("th", { className: "px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Category" }), _jsx("th", { className: "px-6 py-4 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Date" }), _jsx("th", { className: "px-6 py-4 text-xs font-black tracking-wider text-right text-gray-700 uppercase", children: "Amount" }), _jsx("th", { className: "px-6 py-4 text-xs font-black tracking-wider text-center text-gray-700 uppercase", children: "Status" })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-100", children: [pagedExpenses.map((expense, index) => {
                                                const statusConfig = getStatusConfig(expense.status);
                                                const categoryConfig = getCategoryConfig(expense.category);
                                                const isRejected = expense.status === 'rejected';
                                                const isLocked = expense.status === 'rejected';
                                                return (_jsxs("tr", { onClick: () => handleExpenseClick(expense), style: { animationDelay: `${index * 50}ms` }, className: `group cursor-pointer transition-all duration-300 hover:bg-gray-50/80 animate-fade-in ${isRejected ? 'opacity-80' : ''}`, children: [_jsxs("td", { className: "px-6 py-4 text-xs font-mono font-bold text-gray-600 whitespace-nowrap", children: ["#", expense.id] }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-sm font-bold text-gray-900 group-hover:text-heritage-green transition-colors", children: expense.description }), _jsxs("div", { className: "mt-0.5 text-xs text-gray-500", children: ["Submitted by ", _jsx("span", { className: "font-medium", children: expense.submittedBy })] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-800", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }), _jsx("span", { className: "font-semibold", children: expense.vendor })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700", children: [_jsx("span", { className: `flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${categoryConfig.gradient} text-white text-[10px] shadow`, children: categoryConfig.icon }), _jsx("span", { children: categoryConfig.label })] }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-700 whitespace-nowrap", children: expense.date }), _jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: _jsx("span", { className: "text-sm font-bold text-gray-900", children: formatCurrency(expense.amount) }) }), _jsx("td", { className: "px-6 py-4 text-center whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statusConfig.badge}`, children: [_jsx("span", { children: statusConfig.icon }), _jsx("span", { children: statusConfig.label }), isLocked && (_jsx("span", { className: "ml-1 text-[9px] font-black tracking-wide uppercase text-gray-500", children: "LOCKED" }))] }) })] }, expense.id));
                                            }), Array.from({ length: Math.max(0, pageSize - pagedExpenses.length) }).map((_, index) => (_jsx("tr", { style: { height: '72px' }, className: "border-gray-200 border-dashed bg-gray-50/40", children: _jsx("td", { className: "px-6 py-4", colSpan: 7, children: _jsxs("div", { className: "flex items-center justify-center text-xs font-medium text-gray-300 opacity-60", children: [_jsx("div", { className: "w-2 h-2 mr-2 bg-gray-300 rounded-full opacity-40" }), "Empty slot ", index + 1] }) }) }, `empty-${index}`)))] })] }) })) }), sortedExpenses.length > 0 && (_jsx("div", { className: "p-6 border-t border-gray-100 bg-gray-50/50", children: _jsx("div", { className: "flex items-center justify-center", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            }
                                            else {
                                                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                                                pageNum = start + i;
                                            }
                                            return (_jsx("button", { onClick: () => setPage(pageNum), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${pageNum === page
                                                    ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`, children: pageNum }, pageNum));
                                        }) }), _jsxs("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages, className: "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed", children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }) }))] }), _jsx(ExpenseModal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedExpense(null);
                }, children: selectedExpense && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "relative p-6 overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-2xl", children: _jsxs("div", { className: "flex items-start gap-6", children: [_jsx("div", { className: `flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryConfig(selectedExpense.category).gradient} flex items-center justify-center shadow-lg`, children: _jsx("span", { className: "text-3xl", children: getCategoryConfig(selectedExpense.category).icon }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "mb-1 text-xl font-bold leading-tight text-gray-900", children: selectedExpense.description }), _jsxs("p", { className: "mb-3 text-sm font-medium text-gray-500", children: ["Expense #", selectedExpense.id] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm ${getStatusConfig(selectedExpense.status).badge}`, children: [_jsx("span", { children: getStatusConfig(selectedExpense.status).icon }), getStatusConfig(selectedExpense.status).label] }), _jsx("span", { className: "px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm", children: getCategoryConfig(selectedExpense.category).label })] })] }), _jsxs("div", { className: "flex-shrink-0 text-right", children: [_jsx("p", { className: "mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase", children: "Amount" }), _jsx("p", { className: "text-3xl font-black text-heritage-green", children: formatCurrency(selectedExpense.amount) })] })] }) }), _jsxs("div", { children: [_jsx("h5", { className: "mb-3 text-sm font-bold tracking-wider text-gray-500 uppercase", children: "Transaction Details" }), _jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: [_jsxs("div", { className: "p-4 bg-white border border-gray-200 rounded-xl", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: "Vendor" }) }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: selectedExpense.vendor }), selectedExpense.vendorContact && (_jsx("p", { className: "mt-2 text-xs text-gray-500", children: selectedExpense.vendorContact }))] }), _jsxs("div", { className: "p-4 bg-white border border-gray-200 rounded-xl", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: "Date" }) }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: selectedExpense.date }), _jsxs("p", { className: "mt-2 text-xs text-gray-500", children: ["Created: ", selectedExpense.createdAt ?? '—'] })] }), _jsxs("div", { className: "p-4 bg-white border border-gray-200 rounded-xl", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: "Submitted / Approved" }) }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: selectedExpense.submittedBy }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Approved By: ", selectedExpense.approvedBy ?? '—'] })] }), _jsxs("div", { className: "col-span-1 p-4 bg-white border border-gray-200 md:col-span-2 rounded-xl", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: "Identifiers" }) }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Invoice: ", _jsx("span", { className: "font-semibold", children: selectedExpense.invoiceNumber ?? '—' })] }), _jsxs("p", { className: "text-sm text-gray-700", children: ["PO: ", _jsx("span", { className: "font-semibold", children: selectedExpense.purchaseOrder ?? '—' })] }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Project: ", _jsx("span", { className: "font-semibold", children: selectedExpense.project ?? '—' })] })] }), _jsxs("div", { className: "p-4 bg-white border border-gray-200 rounded-xl", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: "Accounting" }) }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Account: ", _jsx("span", { className: "font-semibold", children: selectedExpense.accountCode ?? '—' })] }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Cost Center: ", _jsx("span", { className: "font-semibold", children: selectedExpense.costCenter ?? '—' })] }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Payment Method: ", _jsx("span", { className: "font-semibold", children: selectedExpense.paymentMethod ?? '—' })] })] }), _jsxs("div", { className: "col-span-1 p-4 bg-white border border-gray-200 md:col-span-3 rounded-xl", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: "Notes" }) }), _jsx("p", { className: "text-sm text-gray-700", children: selectedExpense.notes ?? '—' })] }), selectedExpense.attachments && selectedExpense.attachments.length > 0 && (_jsxs("div", { className: "col-span-1 p-4 bg-white border border-gray-200 md:col-span-3 rounded-xl", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: "Attachments" }) }), _jsx("ul", { className: "list-disc list-inside", children: selectedExpense.attachments.map((a, i) => (_jsx("li", { children: _jsxs("a", { href: a, target: "_blank", rel: "noopener noreferrer", className: "underline text-heritage-green", children: ["Attachment ", i + 1] }) }, i))) })] }))] })] }), selectedExpense.receiptUrl && (_jsx("div", { className: "p-5 border-2 border-green-200 bg-green-50 rounded-2xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl", children: _jsx(FileText, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-green-900", children: "Receipt Available" }), _jsx("p", { className: "text-xs text-green-700", children: "Click to view document" })] })] }), _jsxs("a", { href: selectedExpense.receiptUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }), "Open"] })] }) })), selectedExpense.status === 'pending' && (_jsxs("div", { className: "flex gap-3 pt-2", children: [_jsxs("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        onApprove([selectedExpense.id]);
                                        setIsModalOpen(false);
                                    }, className: "inline-flex items-center justify-center flex-1 gap-2 px-6 py-4 font-bold text-white transition-colors bg-green-600 shadow-lg hover:bg-green-700 rounded-xl shadow-green-600/30", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }) }), "Approve Expense"] }), _jsxs("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        // open reject prompt to capture reason
                                        setRejectNotes('');
                                        setIsRejectPromptOpen(true);
                                    }, className: "inline-flex items-center justify-center flex-1 gap-2 px-6 py-4 font-bold text-white transition-colors bg-red-600 shadow-lg hover:bg-red-700 rounded-xl shadow-red-600/30", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }), "Reject Expense"] })] })), isRejectPromptOpen && (_jsxs("div", { className: "p-4 mt-4 border border-red-200 bg-red-50 rounded-xl", children: [_jsx("h6", { className: "mb-2 text-sm font-bold text-red-700", children: "Provide rejection notes" }), _jsx("textarea", { value: rejectNotes, onChange: (e) => setRejectNotes(e.target.value), placeholder: "Reason for rejection (required)", className: "w-full p-3 bg-white border border-red-200 rounded-md resize-none h-28" }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx("button", { onClick: () => {
                                                // cancel
                                                setIsRejectPromptOpen(false);
                                            }, className: "px-4 py-2 text-gray-700 bg-white border rounded-xl", children: "Cancel" }), _jsx("button", { onClick: () => {
                                                if (!selectedExpense)
                                                    return;
                                                if (!rejectNotes.trim())
                                                    return; // require notes
                                                // call parent reject handler and pass notes via a simple local update
                                                const payload = [selectedExpense.id];
                                                // Attach rejection metadata locally for display
                                                selectedExpense.rejectionReason = rejectNotes.trim();
                                                selectedExpense.rejectedBy = 'You';
                                                selectedExpense.rejectedAt = new Date().toISOString();
                                                onReject(payload);
                                                setIsRejectPromptOpen(false);
                                                setIsModalOpen(false);
                                            }, className: "px-4 py-2 text-white bg-red-600 rounded-xl", children: "Confirm Reject" })] })] })), selectedExpense.status !== 'pending' && (_jsxs("div", { children: [_jsx("div", { className: "p-4 mb-3 text-center bg-gray-100 border border-gray-300 rounded-xl", children: _jsxs("p", { className: "text-sm font-semibold text-gray-600", children: ["This expense has already been ", selectedExpense.status, ". No actions available."] }) }), selectedExpense.status === 'rejected' && (_jsxs("div", { className: "p-4 border bg-rose-50 border-rose-200 rounded-xl", children: [_jsx("h6", { className: "mb-2 text-sm font-bold text-rose-700", children: "Rejection Details" }), _jsxs("p", { className: "text-sm text-rose-800", children: [_jsx("span", { className: "font-semibold", children: "Reason:" }), " ", selectedExpense.rejectionReason ?? 'No reason provided'] }), _jsxs("p", { className: "mt-2 text-sm text-rose-800", children: [_jsx("span", { className: "font-semibold", children: "Rejected By:" }), " ", selectedExpense.rejectedBy ?? '—'] }), _jsxs("p", { className: "mt-1 text-xs text-rose-700", children: ["At: ", selectedExpense.rejectedAt ?? '—'] })] }))] }))] })) }), _jsx(NewExpenseModal, { isOpen: isCreateOpen, onClose: () => setIsCreateOpen(false), onCreate: (e) => {
                    if (typeof onCreate === 'function') {
                        onCreate(e);
                    }
                    else {
                        // parent didn't handle adding new expense; keep locally so user sees it immediately
                        setLocalCreated((prev) => [e, ...prev]);
                    }
                    setIsCreateOpen(false);
                } })] }));
};
export default ExpenseList;
