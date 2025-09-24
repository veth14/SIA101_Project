export const ReportGenerator = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 className="font-medium text-gray-900 mb-2">Income Statement</h4>
          <p className="text-sm text-gray-600 mb-4">Revenue and expense summary</p>
          <button className="w-full px-4 py-2 bg-heritage-green text-white rounded-md hover:bg-heritage-neutral transition-colors">
            Generate
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 className="font-medium text-gray-900 mb-2">Balance Sheet</h4>
          <p className="text-sm text-gray-600 mb-4">Assets, liabilities, and equity</p>
          <button className="w-full px-4 py-2 bg-heritage-green text-white rounded-md hover:bg-heritage-neutral transition-colors">
            Generate
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 className="font-medium text-gray-900 mb-2">Cash Flow</h4>
          <p className="text-sm text-gray-600 mb-4">Cash inflows and outflows</p>
          <button className="w-full px-4 py-2 bg-heritage-green text-white rounded-md hover:bg-heritage-neutral transition-colors">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};
