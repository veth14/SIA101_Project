import React from 'react';
export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
    date: string;
    time: string;
    category: string;
    status: 'completed' | 'pending' | 'failed';
    reference: string;
    method: 'cash' | 'card' | 'transfer' | 'check';
}
interface RecentTransactionsProps {
    transactions: Transaction[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onTransactionSelect: (transaction: Transaction) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    totalItems: number;
    itemsPerPage: number;
    showAll: boolean;
    onToggleShowAll: () => void;
    isLoading: boolean;
    statusFilter: string;
    typeFilter: string;
    categoryFilter: string;
    onStatusFilterChange: (status: string) => void;
    onTypeFilterChange: (type: string) => void;
    onCategoryFilterChange: (category: string) => void;
}
declare const RecentTransactions: React.FC<RecentTransactionsProps>;
export default RecentTransactions;
