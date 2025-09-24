import { useState, useEffect } from 'react';

interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  balanceChange: number;
  incomeChange: number;
  expenseChange: number;
}

export const ExpenseSummary = () => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    balanceChange: 0,
    incomeChange: 0,
    expenseChange: 0,
  });

  useEffect(() => {
    // TODO: Fetch from Firestore
    // For now, using dummy data
    setSummaryData({
      totalBalance: 125000,
      totalIncome: 180000,
      totalExpenses: 55000,
      balanceChange: 12.5,
      incomeChange: 8.3,
      expenseChange: -3.2,
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{value}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Balance Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Balance</h3>
          <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(summaryData.totalBalance)}</p>
          <div className="flex items-center gap-2">
            {formatPercentage(summaryData.balanceChange)}
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Income</h3>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(summaryData.totalIncome)}</p>
          <div className="flex items-center gap-2">
            {formatPercentage(summaryData.incomeChange)}
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Expenses</h3>
          <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-rose-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(summaryData.totalExpenses)}</p>
          <div className="flex items-center gap-2">
            {formatPercentage(summaryData.expenseChange)}
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};
