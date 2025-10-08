import React from 'react';

interface ActivityItem {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  category: string;
}

const RecentActivity: React.FC = () => {
  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'income',
      description: 'Room booking payment - Suite 204',
      amount: 450,
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'expense',
      description: 'Housekeeping supplies purchase',
      amount: 285,
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'income',
      description: 'Conference hall booking - ABC Corp',
      amount: 1200,
      time: '6 hours ago',
      status: 'pending'
    },
    {
      id: '4',
      type: 'expense',
      description: 'Monthly utility bills',
      amount: 890,
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: '5',
      type: 'transfer',
      description: 'Staff salary transfer',
      amount: 3500,
      time: '2 days ago',
      status: 'completed'
    }
  ];

  const recentTransactions: TransactionItem[] = [
    {
      id: 'T001',
      description: 'Room Service - Room 301',
      amount: 85,
      type: 'credit',
      date: 'Oct 07',
      category: 'Dining'
    },
    {
      id: 'T002',
      description: 'Laundry Service Payment',
      amount: 45,
      type: 'credit',
      date: 'Oct 07',
      category: 'Services'
    },
    {
      id: 'T003',
      description: 'Equipment Maintenance',
      amount: 320,
      type: 'debit',
      date: 'Oct 06',
      category: 'Maintenance'
    },
    {
      id: 'T004',
      description: 'Guest Checkout - Room 205',
      amount: 280,
      type: 'credit',
      date: 'Oct 06',
      category: 'Rooms'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'income':
        return (
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        );
      case 'expense':
        return (
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
            </svg>
          </div>
        );
      case 'transfer':
        return (
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Recent Activities</h3>
            <p className="text-sm text-gray-600">Latest financial activities</p>
          </div>
          <button className="text-[#82A33D] hover:text-[#6d8735] text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              {getActivityIcon(activity.type)}
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-bold ${
                  activity.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {activity.type === 'income' ? '+' : '-'}${activity.amount}
                </p>
                <div className="mt-1">
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Recent Transactions</h3>
            <p className="text-sm text-gray-600">Latest payment transactions</p>
          </div>
          <button className="text-[#82A33D] hover:text-[#6d8735] text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{transaction.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-xs text-gray-500">{transaction.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-bold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                </p>
                <p className="text-xs text-gray-500 mt-1">{transaction.id}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full py-2 text-sm font-medium text-[#82A33D] hover:text-[#6d8735] transition-colors">
            View All Transactions →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
export { RecentActivity };