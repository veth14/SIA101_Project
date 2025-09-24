export const ExpenseStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-sm font-medium text-red-600 uppercase tracking-wide">Total Expenses</h3>
        <p className="text-3xl font-bold text-red-900 mt-2">₱0</p>
        <p className="text-sm text-red-700 mt-1">+0% from last month</p>
      </div>
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
        <h3 className="text-sm font-medium text-orange-600 uppercase tracking-wide">Operating Costs</h3>
        <p className="text-3xl font-bold text-orange-900 mt-2">₱0</p>
        <p className="text-sm text-orange-700 mt-1">+0% from last month</p>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-lime-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Utilities</h3>
        <p className="text-3xl font-bold text-yellow-900 mt-2">₱0</p>
        <p className="text-sm text-yellow-700 mt-1">+0% from last month</p>
      </div>
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200">
        <h3 className="text-sm font-medium text-pink-600 uppercase tracking-wide">Maintenance</h3>
        <p className="text-3xl font-bold text-pink-900 mt-2">₱0</p>
        <p className="text-sm text-pink-700 mt-1">+0% from last month</p>
      </div>
    </div>
  );
};
