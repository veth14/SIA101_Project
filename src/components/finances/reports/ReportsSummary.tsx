interface ReportsSummaryProps {
  summary: {
    totalIncome?: number;
    totalReservations?: number;
    occupancyRate?: number;
    avgDailyIncome?: number;
  };
}

export const ReportsSummary = ({ summary }: ReportsSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Income</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#82A33D]">
            {summary.totalIncome ? formatCurrency(summary.totalIncome) : 'N/A'}
          </p>
          <p className="text-xs text-gray-500">This period</p>
        </div>
      </div>

      {/* Total Reservations */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Reservations</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#82A33D]">
            {summary.totalReservations || 'N/A'}
          </p>
          <p className="text-xs text-gray-500">Bookings made</p>
        </div>
      </div>

      {/* Occupancy Rate */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Occupancy Rate</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#82A33D]">
            {summary.occupancyRate ? formatPercentage(summary.occupancyRate) : 'N/A'}
          </p>
          <p className="text-xs text-gray-500">Room utilization</p>
        </div>
      </div>

      {/* Average Daily Income */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Daily Income</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#82A33D]">
            {summary.avgDailyIncome ? formatCurrency(summary.avgDailyIncome) : 'N/A'}
          </p>
          <p className="text-xs text-gray-500">Per day average</p>
        </div>
      </div>
    </div>
  );
};
