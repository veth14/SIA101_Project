import { useState } from 'react';

interface ReportsFiltersProps {
  onGenerateReport: (filters: any) => void;
  loading: boolean;
}

export const ReportsFilters = ({ onGenerateReport, loading }: ReportsFiltersProps) => {
  const [reportType, setReportType] = useState<'income' | 'reservations' | 'occupancy' | 'inventory' | 'staff'>('income');
  const [dateRange, setDateRange] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = () => {
    const filters = {
      type: reportType,
      dateRange: {
        type: dateRange,
        startDate: dateRange === 'custom' ? startDate : '',
        endDate: dateRange === 'custom' ? endDate : '',
      },
    };
    onGenerateReport(filters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Report Type */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
            >
              <option value="income">Income Report</option>
              <option value="reservations">Reservations Report</option>
              <option value="occupancy">Occupancy Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="staff">Staff Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Inputs */}
          {dateRange === 'custom' && (
            <>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        {/* Generate Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full lg:w-auto px-6 py-2 bg-[#82A33D] text-white font-medium rounded-lg hover:bg-[#6d8a33] focus:outline-none focus:ring-2 focus:ring-[#82A33D] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
