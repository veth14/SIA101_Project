import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import TransactionAnalytics from './TransactionAnalytics';
import RecentTransactions from './RecentTransactions';
import TransactionDetails from './TransactionDetails';
import TransactionStats from './TransactionStats';
// Sample transaction data
const sampleTransactions = [
    { id: '1', description: 'Room Booking Payment', amount: 15254, type: 'credit', date: '2024-10-01', time: '10:30', category: 'booking', status: 'completed', reference: 'BK001', method: 'card' },
    { id: '2', description: 'Spa Service Payment', amount: 8254, type: 'credit', date: '2024-10-02', time: '14:15', category: 'service', status: 'completed', reference: 'SP002', method: 'cash' },
    { id: '3', description: 'Restaurant Bill', amount: 3250, type: 'credit', date: '2024-10-03', time: '19:45', category: 'food', status: 'pending', reference: 'FB003', method: 'card' },
    { id: '4', description: 'Conference Hall Booking', amount: 25000, type: 'credit', date: '2024-10-04', time: '09:00', category: 'booking', status: 'completed', reference: 'CH004', method: 'transfer' },
    { id: '5', description: 'Laundry Service', amount: 1200, type: 'credit', date: '2024-10-05', time: '11:20', category: 'service', status: 'failed', reference: 'LS005', method: 'cash' },
    { id: '6', description: 'Wedding Package', amount: 85000, type: 'credit', date: '2024-10-06', time: '16:30', category: 'event', status: 'completed', reference: 'WP006', method: 'transfer' },
    { id: '7', description: 'Room Service Order', amount: 2800, type: 'credit', date: '2024-10-07', time: '20:15', category: 'food', status: 'completed', reference: 'RS007', method: 'card' },
    { id: '8', description: 'Gym Membership', amount: 5000, type: 'credit', date: '2024-10-08', time: '08:45', category: 'service', status: 'pending', reference: 'GM008', method: 'card' },
    { id: '9', description: 'Event Catering', amount: 45000, type: 'credit', date: '2024-10-09', time: '12:00', category: 'food', status: 'completed', reference: 'EC009', method: 'transfer' },
    { id: '10', description: 'Transportation Service', amount: 3500, type: 'credit', date: '2024-10-10', time: '07:30', category: 'service', status: 'completed', reference: 'TS010', method: 'cash' },
];
export const TransactionsPage = () => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        dateRange: 'all',
        type: 'all',
        category: 'all',
        status: 'all',
        searchTerm: ''
    });
    // Centralized loading state - synchronized for all components
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Unified 2-second loading time
        return () => clearTimeout(timer);
    }, []);
    const itemsPerPage = 8; // Items per page when not showing all
    const totalTransactions = sampleTransactions.reduce((sum, t) => sum + t.amount, 0);
    const completedTransactions = sampleTransactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const pendingTransactions = sampleTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
    // Filter and paginate transactions
    const filteredTransactions = sampleTransactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
        const matchesType = filters.type === 'all' || transaction.type === filters.type;
        const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
        return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
    // Pagination logic - show all if showAll is true, otherwise paginate
    const totalPages = showAll ? 1 : Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = showAll
        ? filteredTransactions
        : filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE] -mt-6", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25" }), _jsx("div", { className: "absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx(TransactionStats, { totalTransactions: totalTransactions, completedTransactions: completedTransactions, pendingTransactions: pendingTransactions, isLoading: isLoading }), _jsx(TransactionAnalytics, { filters: { status: filters.status, category: filters.category }, onFiltersChange: (newFilters) => setFilters({ ...filters, ...newFilters }), isLoading: isLoading }), _jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(RecentTransactions, { transactions: paginatedTransactions, currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage, onTransactionSelect: setSelectedTransaction, searchTerm: filters.searchTerm, onSearchChange: (term) => setFilters({ ...filters, searchTerm: term }), totalItems: filteredTransactions.length, itemsPerPage: itemsPerPage, showAll: showAll, onToggleShowAll: () => {
                                        setShowAll(!showAll);
                                        setCurrentPage(1); // Reset to first page when toggling
                                    }, isLoading: isLoading, statusFilter: filters.status, typeFilter: filters.type, categoryFilter: filters.category, onStatusFilterChange: (status) => setFilters({ ...filters, status }), onTypeFilterChange: (type) => setFilters({ ...filters, type }), onCategoryFilterChange: (category) => setFilters({ ...filters, category }) }) }), _jsx("div", { className: "lg:col-span-1", children: _jsx(TransactionDetails, { transaction: selectedTransaction, onClose: () => setSelectedTransaction(null) }) })] })] })] }));
};
export default TransactionsPage;
