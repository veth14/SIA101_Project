import React, { useState } from 'react';
import { TransactionsHeader } from './TransactionsHeader';
import TransactionsList from './TransactionsList';
import TransactionFilters from './TransactionFilters';
import TransactionDetails from './TransactionDetails';

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

export const TransactionsPage: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    category: 'all',
    status: 'all',
    searchTerm: ''
  });

  return (
    <div className="min-h-screen bg-heritage-light">
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
        {/* Header */}
        <TransactionsHeader />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1">
            <TransactionFilters 
              filters={filters} 
              onFiltersChange={setFilters}
            />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-2">
            <TransactionsList 
              filters={filters}
              onTransactionSelect={setSelectedTransaction}
              selectedTransaction={selectedTransaction}
            />
          </div>

          {/* Transaction Details Sidebar */}
          <div className="xl:col-span-1">
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