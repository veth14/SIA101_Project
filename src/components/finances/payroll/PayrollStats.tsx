export const PayrollStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Total Payroll</h3>
        <p className="text-3xl font-bold text-indigo-900 mt-2">₱0</p>
        <p className="text-sm text-indigo-700 mt-1">Monthly total</p>
      </div>
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
        <h3 className="text-sm font-medium text-teal-600 uppercase tracking-wide">Active Employees</h3>
        <p className="text-3xl font-bold text-teal-900 mt-2">0</p>
        <p className="text-sm text-teal-700 mt-1">Currently employed</p>
      </div>
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200">
        <h3 className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Pending Payments</h3>
        <p className="text-3xl font-bold text-emerald-900 mt-2">₱0</p>
        <p className="text-sm text-emerald-700 mt-1">Awaiting processing</p>
      </div>
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-200">
        <h3 className="text-sm font-medium text-violet-600 uppercase tracking-wide">Average Salary</h3>
        <p className="text-3xl font-bold text-violet-900 mt-2">₱0</p>
        <p className="text-sm text-violet-700 mt-1">Per employee</p>
      </div>
    </div>
  );
};
