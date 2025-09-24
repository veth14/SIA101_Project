export const ReportFilters = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>Custom range</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green">
            <option>All Reports</option>
            <option>Income Statement</option>
            <option>Balance Sheet</option>
            <option>Cash Flow</option>
            <option>Payroll Summary</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green">
            <option>PDF</option>
            <option>Excel</option>
            <option>CSV</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="px-6 py-2 bg-heritage-green text-white rounded-md hover:bg-heritage-neutral transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};
