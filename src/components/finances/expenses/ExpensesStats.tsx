import React from 'react';

const ExpensesStats: React.FC = () => {
  // Placeholder stat cards; can be wired to real data later
  const items = [
    { label: 'Total This Month', value: '$12,345' },
    { label: 'Pending Approvals', value: '$2,050.50' },
    { label: 'Paid', value: '$1,850.75' },
    { label: 'Rejected', value: '$500.00' },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <div key={i} className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-heritage-green">{s.value}</p>
            <p className="text-xs text-gray-500">vs last month +3.2%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesStats;
