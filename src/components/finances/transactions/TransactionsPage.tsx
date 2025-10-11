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
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    category: 'all',
    status: 'all',
    searchTerm: ''
  });

  const itemsPerPage = 6;

  // Handler functions for transaction actions
  const handleViewFullDetails = (transaction: Transaction) => {
    // Create a detailed modal or window
    const detailsContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transaction Full Details</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: linear-gradient(135deg, #82A33D 0%, #6d8735 100%);
            color: white;
          }
          .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            color: #333; 
            padding: 30px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #82A33D; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .details-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin: 20px 0; 
          }
          .detail-item { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #82A33D; 
          }
          .detail-label { 
            font-weight: bold; 
            color: #82A33D; 
            margin-bottom: 5px; 
          }
          .detail-value { 
            font-size: 16px; 
            color: #333; 
          }
          .amount { 
            font-size: 36px; 
            font-weight: bold; 
            color: #82A33D; 
            text-align: center; 
            margin: 20px 0; 
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .completed { background: #d4edda; color: #155724; }
          .pending { background: #fff3cd; color: #856404; }
          .failed { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Balay Ginhawa Hotel</h1>
            <h2>Complete Transaction Details</h2>
            <p style="color: #666;">Transaction Reference: ${transaction.reference}</p>
          </div>
          
          <div class="amount">₱${transaction.amount.toLocaleString()}</div>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Transaction ID</div>
              <div class="detail-value">${transaction.id}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Reference Number</div>
              <div class="detail-value">${transaction.reference}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Description</div>
              <div class="detail-value">${transaction.description}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Transaction Type</div>
              <div class="detail-value">${transaction.type.toUpperCase()}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Category</div>
              <div class="detail-value">${transaction.category}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Payment Method</div>
              <div class="detail-value">${transaction.method.toUpperCase()}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Date</div>
              <div class="detail-value">${transaction.date}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Time</div>
              <div class="detail-value">${transaction.time}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <span class="status-badge ${transaction.status}">${transaction.status.toUpperCase()}</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const detailsWindow = window.open('', '_blank', 'width=900,height=700');
    if (detailsWindow) {
      detailsWindow.document.write(detailsContent);
      detailsWindow.document.close();
      detailsWindow.focus();
    }
  };

  const handleCreateInvoice = (transaction: Transaction) => {
    // Navigate to invoice creation or show invoice creation modal
    const confirmCreate = window.confirm(
      `Create an invoice for this transaction?\n\n` +
      `Description: ${transaction.description}\n` +
      `Amount: ₱${transaction.amount.toLocaleString()}\n` +
      `Reference: ${transaction.reference}`
    );
    
    if (confirmCreate) {
      // In a real app, this would navigate to invoice creation page
      // For now, we'll show a success message
      alert(`Invoice creation initiated for transaction ${transaction.reference}!\n\nYou would be redirected to the invoice creation page where this transaction data would be pre-filled.`);
      
      // You could also redirect to invoice page:
      // window.location.href = '/finances/invoices/create?transactionId=' + transaction.id;
    }
  };
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

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Debug logging
  console.log('TransactionsPage - filteredTransactions:', filteredTransactions);
  console.log('TransactionsPage - paginatedTransactions:', paginatedTransactions);
  console.log('TransactionsPage - selectedTransaction:', selectedTransaction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-light via-white to-heritage-green/10 relative overflow-hidden">
      {/* Heritage Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-heritage-green/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-80 h-80 bg-heritage-neutral/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-heritage-light/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2000ms'}}></div>
      </div>

      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
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
          onFiltersChange={setFilters}
        />

        {/* Transaction Table and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
            />
          </div>

          {/* Transaction Details Component */}
          <div className="lg:col-span-1">
            <TransactionDetails
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
              onViewFullDetails={handleViewFullDetails}
              onCreateInvoice={handleCreateInvoice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;