import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import ExpenseList from '@/components/finances/expenses/ExpenseList';
import ExpensesStats from '@/components/finances/expenses/ExpensesStats';
import ExpensesAnalytics from '@/components/finances/expenses/ExpensesAnalytics';
import { getCurrentPayrollTotal } from '@/services/payrollService';
import { expenses as seedExpenses } from '@/components/finances/expenses/expensesData';
export const ExpensesPage = () => {
    const [expenses, setExpenses] = useState(seedExpenses);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [toasts, setToasts] = useState([]);
    const handleExpenseSelect = (expense) => {
        setSelectedExpense(expense);
    };
    const toggleSelect = (id, selected) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (selected)
                next.add(id);
            else
                next.delete(id);
            return next;
        });
    };
    const selectAll = (ids, select) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            ids.forEach(id => (select ? next.add(id) : next.delete(id)));
            return next;
        });
    };
    const addToast = (message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
    };
    const updateStatus = useCallback((ids, status) => {
        if (ids.length === 0)
            return;
        setExpenses(prev => prev.map(e => (ids.includes(e.id) ? { ...e, status } : e)));
        // Update selectedExpense if its status changed
        setSelectedExpense(prev => (prev && ids.includes(prev.id) ? { ...prev, status } : prev));
        addToast(`${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Marked as Paid'} ${ids.length} item${ids.length > 1 ? 's' : ''}`);
        // Clear selection after action
        setSelectedIds(new Set());
    }, []);
    const handleApprove = useCallback((ids) => updateStatus(Array.isArray(ids) ? ids : [ids], 'approved'), [updateStatus]);
    const handleReject = useCallback((ids) => updateStatus(Array.isArray(ids) ? ids : [ids], 'rejected'), [updateStatus]);
    const handleMarkPaid = useCallback((ids) => updateStatus(Array.isArray(ids) ? ids : [ids], 'paid'), [updateStatus]);
    // Keyboard shortcuts for currently selected expense or selection set
    useEffect(() => {
        const onKey = (e) => {
            if (e.target && e.target.tagName === 'INPUT')
                return; // avoid interfering with inputs
            if (selectedIds.size > 0) {
                if (e.key.toLowerCase() === 'a')
                    handleApprove(Array.from(selectedIds));
                if (e.key.toLowerCase() === 'r')
                    handleReject(Array.from(selectedIds));
                if (e.key.toLowerCase() === 'p')
                    handleMarkPaid(Array.from(selectedIds));
            }
            else if (selectedExpense) {
                if (e.key.toLowerCase() === 'a')
                    handleApprove(selectedExpense.id);
                if (e.key.toLowerCase() === 'r')
                    handleReject(selectedExpense.id);
                if (e.key.toLowerCase() === 'p')
                    handleMarkPaid(selectedExpense.id);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedIds, selectedExpense, handleApprove, handleReject, handleMarkPaid]);
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse" }), _jsx("div", { className: "absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 w-full px-2 py-4 space-y-6 sm:px-4 lg:px-6", children: [_jsx(ExpensesStats, { expenses: expenses }), _jsx(ExpensesAnalytics, { expenses: expenses, staffFromPayroll: getCurrentPayrollTotal() }), _jsx("div", { className: "w-full", children: _jsx(ExpenseList, { expenses: expenses, onExpenseSelect: handleExpenseSelect, selectedExpense: selectedExpense, selectedIds: selectedIds, onToggleSelect: toggleSelect, onSelectAll: selectAll, onApprove: (ids) => handleApprove(ids), onReject: (ids) => handleReject(ids), onMarkPaid: (ids) => handleMarkPaid(ids) }) }), _jsx("div", { className: "fixed z-50 space-y-2 bottom-6 right-6", children: toasts.map(t => (_jsx("div", { className: `px-4 py-3 rounded-xl shadow-lg text-sm text-white ${t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-700'}`, children: t.message }, t.id))) })] })] }));
};
export default ExpensesPage;
