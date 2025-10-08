import React from 'react';
import type { Expense } from './ExpenseList';

interface ExpenseDetailsProps {
  expense: Expense | null;
  onClose: () => void;
}

const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ expense, onClose }) => {
  if (!expense) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'utilities':
        return '⚡';
      case 'supplies':
        return '📦';
      case 'maintenance':
        return '🔧';
      case 'marketing':
        return '📢';
      case 'staff':
        return '👥';
      case 'food':
        return '🍽️';
      case 'other':
        return '📋';
      default:
        return '💰';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'utilities':
        return 'Utilities';
      case 'supplies':
        return 'Supplies';
      case 'maintenance':
        return 'Maintenance';
      case 'marketing':
        return 'Marketing';
      case 'staff':
        return 'Staff';
      case 'food':
        return 'Food & Beverage';
      case 'other':
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const handleApprove = () => {
    alert('Expense approval functionality would be implemented here');
  };

  const handleReject = () => {
    alert('Expense rejection functionality would be implemented here');
  };

  const handleMarkPaid = () => {
    alert('Mark as paid functionality would be implemented here');
  };

  const handleViewReceipt = () => {
    if (expense.receiptUrl) {
      window.open(expense.receiptUrl, '_blank');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          icon: '⏳',
          title: 'Pending Approval',
          description: 'This expense is awaiting manager approval'
        };
      case 'approved':
        return {
          color: 'text-green-600 bg-green-50 border-green-200',
          icon: '✅',
          title: 'Approved',
          description: 'This expense has been approved and ready for payment'
        };
      case 'rejected':
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: '❌',
          title: 'Rejected',
          description: 'This expense has been rejected'
        };
      case 'paid':
        return {
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          icon: '💰',
          title: 'Paid',
          description: 'This expense has been paid'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: '❓',
          title: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  const statusInfo = getStatusInfo(expense.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#82A33D] to-[#6d8735]">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Expense Details</h2>
            <p className="text-green-100">{expense.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl mb-6 border ${statusInfo.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{statusInfo.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{statusInfo.title}</h3>
                  <p className="text-sm">{statusInfo.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${expense.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Expense Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{getCategoryName(expense.category)}</p>
                    <p className="text-sm text-gray-600">Category</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-600">Description</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.vendor}</p>
                  <p className="text-sm text-gray-600">Vendor</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.date}</p>
                  <p className="text-sm text-gray-600">Date</p>
                </div>
              </div>
            </div>

            {/* Approval Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Approval Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{expense.submittedBy}</p>
                  <p className="text-sm text-gray-600">Submitted By</p>
                </div>
                {expense.approvedBy && (
                  <div>
                    <p className="font-medium text-gray-900">{expense.approvedBy}</p>
                    <p className="text-sm text-gray-600">Approved By</p>
                  </div>
                )}
                <div>
                  <p className={`font-medium capitalize ${
                    expense.status === 'approved' ? 'text-green-600' :
                    expense.status === 'pending' ? 'text-yellow-600' :
                    expense.status === 'rejected' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {expense.status}
                  </p>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
                {expense.receiptUrl && (
                  <div>
                    <button
                      onClick={handleViewReceipt}
                      className="flex items-center gap-2 text-[#82A33D] hover:text-[#6d8735] font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      View Receipt
                    </button>
                    <p className="text-sm text-gray-600">Receipt Available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {expense.notes && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
              <p className="text-gray-700 leading-relaxed">{expense.notes}</p>
            </div>
          )}

          {/* Approval Timeline */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-[#82A33D] rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Expense Submitted</p>
                  <p className="text-sm text-gray-600">By {expense.submittedBy} on {expense.date}</p>
                </div>
              </div>
              {expense.status !== 'pending' && (
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    expense.status === 'approved' ? 'bg-green-500' :
                    expense.status === 'rejected' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {expense.status === 'approved' ? 'Expense Approved' :
                       expense.status === 'rejected' ? 'Expense Rejected' :
                       'Expense Paid'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {expense.approvedBy ? `By ${expense.approvedBy}` : 'Status updated'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3 justify-end">
            {expense.status === 'pending' && (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
              </>
            )}
            {expense.status === 'approved' && (
              <button
                onClick={handleMarkPaid}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Mark as Paid
              </button>
            )}
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;