import React from 'react';

const ExpensesAnalytics: React.FC = () => {
  const bars = [20, 45, 30, 55, 25, 40];
  const labels = ['Util', 'Sup', 'Maint', 'Mkt', 'Staff', 'Food'];

  return (
    <div className="w-full">
      <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Category Breakdown</h3>
          <span className="text-xs text-gray-500">This month</span>
        </div>
        <div className="grid items-end h-40 grid-cols-6 gap-2">
          {bars.map((h, i) => (
            <div key={i} className="rounded-lg bg-heritage-green/70" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-2 mt-3 text-xs text-gray-500">
          {labels.map((l, i) => (
            <span key={i} className="text-center">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesAnalytics;
