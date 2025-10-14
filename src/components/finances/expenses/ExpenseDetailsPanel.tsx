import React from 'react';
import type { Expense } from './types';

interface Props {
  expense: Expense | null;
  onApprove?: () => void;
  onReject?: () => void;
  onMarkPaid?: () => void;
}

const StatBadge: React.FC<{ color: string; label: string } > = ({ color, label }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>
);

const ExpenseDetailsPanel: React.FC<Props> = ({ expense, onApprove, onReject, onMarkPaid }) => {
  return (
    <div className="space-y-6">
      {/* Details Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 min-h-[320px]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Details</h3>
            <p className="text-sm text-gray-500">{expense ? expense.id : 'Select an expense to view details'}</p>
          </div>
          {expense && (
            <div>
              {expense.status === 'approved' && <StatBadge color="bg-green-100 text-green-700" label="Approved" />}
              {expense.status === 'pending' && <StatBadge color="bg-yellow-100 text-yellow-700" label="Pending" />}
              {expense.status === 'paid' && <StatBadge color="bg-blue-100 text-blue-700" label="Paid" />}
              {expense.status === 'rejected' && <StatBadge color="bg-red-100 text-red-700" label="Rejected" />}
            </div>
          )}
        </div>

        {!expense ? (
          <div className="text-sm text-gray-500">Click an expense from the list to preview its information.</div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500">Title</p>
                <p className="font-medium text-gray-900">{expense.description}</p>
              </div>
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium capitalize text-gray-900">{expense.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Submitted By</p>
                <p className="font-medium text-gray-900">{expense.submittedBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{expense.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Vendor</p>
                <p className="font-medium text-gray-900">{expense.vendor}</p>
              </div>
            </div>

            {/* Receipt */}
            {expense.receiptUrl && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-500 mb-2">Receipt</p>
                <a href={expense.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#82A33D] hover:text-[#6d8735] font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  View / Download
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-3">
              <button onClick={onApprove} className="px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg">Approve</button>
              <button onClick={onReject} className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">Reject</button>
              <button onClick={onMarkPaid} className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Mark as Paid</button>
              <button className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Print</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseDetailsPanel;