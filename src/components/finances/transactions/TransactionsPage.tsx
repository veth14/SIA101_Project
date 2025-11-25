import React, { useState, useEffect } from 'react';
import TransactionAnalytics from './TransactionAnalytics';
import RecentTransactions from './RecentTransactions';
import TransactionDetails from './TransactionDetails';
import TransactionStats from './TransactionStats';
import { subscribeToTransactions, TransactionRecord } from '../../../backend/transactions/transactionsService';

export type Transaction = TransactionRecord;

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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
    const unsubscribe = subscribeToTransactions(
      (loaded) => {
        setTransactions(loaded);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading transactions:', error);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const itemsPerPage = 8; // Items per page when not showing all

  const totalTransactions = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  // Sort so that non-invoiced items appear first, then invoiced ones,
  // while prioritizing most recent date/time within each group.
  const sortedFilteredTransactions = [...filteredTransactions].sort((a, b) => {
    const aHasInvoice = a.hasInvoice === true ? 1 : 0;
    const bHasInvoice = b.hasInvoice === true ? 1 : 0;

    if (aHasInvoice !== bHasInvoice) {
      // 0 (no invoice) comes before 1 (invoiced)
      return aHasInvoice - bHasInvoice;
    }

    const aDateTime = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const bDateTime = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return bDateTime - aDateTime;
  });

  // Pagination logic - show all if showAll is true, otherwise paginate
  const totalPages = showAll ? 1 : Math.ceil(sortedFilteredTransactions.length / itemsPerPage);
  const paginatedTransactions = showAll 
    ? sortedFilteredTransactions 
    : sortedFilteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  return (
    <div className="min-h-screen bg-[#F9F6EE] -mt-6">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        {/* Transaction Stats Component */}
        <TransactionStats
          totalTransactions={totalTransactions}
          completedTransactions={completedTransactions}
          pendingTransactions={pendingTransactions}
          isLoading={isLoading}
        />

        {/* Transaction Analytics Component */}
        <TransactionAnalytics 
          filters={{ status: filters.status, category: filters.category }}
          onFiltersChange={(newFilters) => setFilters({...filters, ...newFilters})}
          isLoading={isLoading}
          transactions={transactions}
        />

        {/* Transaction Table and Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Transactions Component */}
          <div className="lg:col-span-2">
            <RecentTransactions
              transactions={paginatedTransactions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onTransactionSelect={setSelectedTransaction}
              searchTerm={filters.searchTerm}
              onSearchChange={(term) => setFilters({...filters, searchTerm: term})}
              totalItems={filteredTransactions.length}
              itemsPerPage={itemsPerPage}
              showAll={showAll}
              onToggleShowAll={() => {
                setShowAll(!showAll);
                setCurrentPage(1); // Reset to first page when toggling
              }}
              isLoading={isLoading}
              statusFilter={filters.status}
              typeFilter={filters.type}
              categoryFilter={filters.category}
              onStatusFilterChange={(status) => setFilters({ ...filters, status })}
              onTypeFilterChange={(type) => setFilters({ ...filters, type })}
              onCategoryFilterChange={(category) => setFilters({ ...filters, category })}
            />
          </div>

          {/* Transaction Details Component */}
          <div className="lg:col-span-1">
            <TransactionDetails
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;