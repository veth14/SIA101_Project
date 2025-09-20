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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Stock Transactions</h1>
          <p className="text-gray-600">Track all inventory movements and adjustments</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Export functionality
              console.log('Export transactions data');
            }}
            className="bg-white text-heritage-green border border-heritage-green px-4 py-2 rounded-md hover:bg-heritage-light transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAddTransactionModal(true)}
            className="bg-heritage-green text-white px-4 py-2 rounded-md hover:bg-heritage-green/90 transition-colors"
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactionStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">📈</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Stock In</p>
              <p className="text-2xl font-bold text-gray-900">{transactionStats.stockIn}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">📉</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Stock Out</p>
              <p className="text-2xl font-bold text-gray-900">{transactionStats.stockOut}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⚖️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Adjustments</p>
              <p className="text-2xl font-bold text-gray-900">{transactionStats.adjustments}</p>
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
  );
};
