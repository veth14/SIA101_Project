import { useState } from 'react';
import { DataTable } from '../admin/DataTable';
import { SearchInput } from '../admin/SearchInput';
import { DateRangePicker } from '../admin/DateRangePicker';
import { Modal } from '../admin/Modal';
import { sampleTransactions, sampleInventory, type StockTransaction } from '../../data/sampleInventory';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<StockTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<StockTransaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedTransaction, setSelectedTransaction] = useState<StockTransaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTransactions(query, typeFilter, dateRange);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    filterTransactions(searchQuery, type, dateRange);
  };

  const filterTransactions = (query: string, type: string, range: any) => {
    let filtered = transactions;

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.itemName.toLowerCase().includes(query.toLowerCase()) ||
          transaction.reason.toLowerCase().includes(query.toLowerCase()) ||
          transaction.performedBy.toLowerCase().includes(query.toLowerCase()) ||
          transaction.id.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Type filter
    if (type !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === type);
    }

    // Date range filter
    if (range.startDate && range.endDate) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.timestamp);
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  };

  const handleViewTransaction = (transaction: StockTransaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      sortable: true,
    },
    {
      key: 'itemName',
      label: 'Item',
      sortable: true,
      render: (value: string, row: StockTransaction) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.itemId}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => {
        const typeColors = {
          'stock-in': 'bg-green-100 text-green-800',
          'stock-out': 'bg-red-100 text-red-800',
          'adjustment': 'bg-yellow-100 text-yellow-800',
        };
        const typeLabels = {
          'stock-in': 'Stock In',
          'stock-out': 'Stock Out',
          'adjustment': 'Adjustment',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[value as keyof typeof typeColors]}`}>
            {typeLabels[value as keyof typeof typeLabels]}
          </span>
        );
      },
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (value: number) => {
        const isPositive = value > 0;
        return (
          <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{value}
          </span>
        );
      },
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value: string) => (
        <div className="max-w-48 truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'performedBy',
      label: 'Performed By',
      sortable: true,
    },
    {
      key: 'timestamp',
      label: 'Date & Time',
      sortable: true,
      render: (value: string) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
  ];

  const getActions = (transaction: StockTransaction) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleViewTransaction(transaction);
      }}
      className="text-heritage-green hover:text-heritage-green/80 text-sm font-medium"
    >
      View Details
    </button>
  );

  const transactionStats = {
    total: transactions.length,
    stockIn: transactions.filter(t => t.type === 'stock-in').length,
    stockOut: transactions.filter(t => t.type === 'stock-out').length,
    adjustments: transactions.filter(t => t.type === 'adjustment').length,
  };

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
        <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-green-500/5 rounded-full animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-500/10 rounded-full animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V5a2 2 0 012-2h2a2 2 0 012 2v0M9 5a2 2 0 012-2h2a2 2 0 012 2v0m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                    Stock Transactions
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Track all inventory movements and adjustments
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        Tuesday, Sep 24
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-1 h-1 bg-[#82A33D] rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-green-600 rounded-full animate-ping delay-75"></div>
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Export functionality
              console.log('Export transactions data');
            }}
            className="bg-white/90 text-heritage-green border-2 border-heritage-green/30 px-6 py-3 rounded-xl hover:bg-heritage-green/5 hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAddTransactionModal(true)}
            className="bg-gradient-to-r from-heritage-green to-heritage-neutral text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
              <span className="text-blue-600 text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Transactions</p>
              <p className="text-3xl font-black text-gray-900">{transactionStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg">
              <span className="text-green-600 text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Stock In</p>
              <p className="text-3xl font-black text-gray-900">{transactionStats.stockIn}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl shadow-lg">
              <span className="text-red-600 text-2xl">📉</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Stock Out</p>
              <p className="text-3xl font-black text-gray-900">{transactionStats.stockOut}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-lg">
              <span className="text-yellow-600 text-2xl">⚖️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Adjustments</p>
              <p className="text-3xl font-black text-gray-900">{transactionStats.adjustments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by item name, reason, or staff member..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex space-x-4">
            <DateRangePicker
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                filterTransactions(searchQuery, typeFilter, range);
              }}
            />
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="all">All Types</option>
              <option value="stock-in">Stock In</option>
              <option value="stock-out">Stock Out</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <DataTable
        columns={columns}
        data={filteredTransactions}
        actions={getActions}
        onRowClick={handleViewTransaction}
      />

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <Modal
          isOpen={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransaction(null);
          }}
          title="Transaction Details"
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                <p className="text-sm text-gray-900">{selectedTransaction.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  selectedTransaction.type === 'stock-in' ? 'bg-green-100 text-green-800' :
                  selectedTransaction.type === 'stock-out' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedTransaction.type === 'stock-in' ? 'Stock In' :
                   selectedTransaction.type === 'stock-out' ? 'Stock Out' : 'Adjustment'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item</label>
                <p className="text-sm text-gray-900">{selectedTransaction.itemName}</p>
                <p className="text-xs text-gray-500">{selectedTransaction.itemId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <p className={`text-sm font-medium ${
                  selectedTransaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.quantity > 0 ? '+' : ''}{selectedTransaction.quantity}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <p className="text-sm text-gray-900">{selectedTransaction.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Performed By</label>
                <p className="text-sm text-gray-900">{selectedTransaction.performedBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedTransaction.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedTransaction.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <p className="text-sm text-gray-900">{selectedTransaction.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Transaction Modal - Placeholder */}
      {showAddTransactionModal && (
        <Modal
          isOpen={showAddTransactionModal}
          onClose={() => setShowAddTransactionModal(false)}
          title="Add Stock Transaction"
          size="lg"
        >
          <div className="text-center py-8">
            <p className="text-gray-500">Add transaction form will be implemented here</p>
            <p className="text-sm text-gray-400 mt-2">
              This would include item selection, quantity input, reason, and notes
            </p>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};
