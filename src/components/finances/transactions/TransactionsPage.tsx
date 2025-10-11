import React, { useState } from 'react';
import { TransactionsHeader } from './TransactionsHeader';
import TransactionAnalytics from './TransactionAnalytics';
import RecentTransactions from './RecentTransactions';
import TransactionDetails from './TransactionDetails';
import TransactionStats from './TransactionStats';

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

// Sample transaction data
const sampleTransactions: Transaction[] = [
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

export const TransactionsPage: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    category: 'all',
    status: 'all',
    searchTerm: ''
  });

  const itemsPerPage = 5; // Items per page when not showing all

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
    : filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-heritage-light via-white to-heritage-green/10">
      {/* Heritage Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-20 left-20 w-96 h-96 bg-heritage-green/15 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full top-40 right-32 w-80 h-80 bg-heritage-neutral/20 blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute rounded-full bottom-32 left-1/3 w-72 h-72 bg-heritage-light/30 blur-3xl animate-pulse" style={{animationDelay: '2000ms'}}></div>
      </div>

      <div className="relative z-10 w-full px-2 py-4 space-y-6 sm:px-4 lg:px-6">
        {/* Header */}
        <TransactionsHeader />

        {/* Transaction Stats Component */}
        <TransactionStats
          totalTransactions={totalTransactions}
          completedTransactions={completedTransactions}
          pendingTransactions={pendingTransactions}
        />

        {/* Transaction Analytics Component */}
        <TransactionAnalytics 
          filters={{ status: filters.status, category: filters.category }}
          onFiltersChange={(newFilters) => setFilters({...filters, ...newFilters})}
        />

        {/* Transaction Table and Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Recent Transactions Component */}
          <div className="lg:col-span-3">
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