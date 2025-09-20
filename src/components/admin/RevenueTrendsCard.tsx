import React from 'react';

const RevenueTrendsCard: React.FC = () => {
  const weeklyData = [
    { week: 'Week 1', revenue: 85000, percentage: 85 },
    { week: 'Week 2', revenue: 92000, percentage: 92 },
    { week: 'Week 3', revenue: 78000, percentage: 78 },
    { week: 'Week 4', revenue: 100000, percentage: 100 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
        </div>
        <div className="flex items-center space-x-1 text-emerald-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold">+15% this month</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {weeklyData.map((item, index) => (
          <div key={item.week} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{item.week}</span>
              <span className="text-sm font-bold text-gray-900">₱{item.revenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-1000 shadow-sm"
                style={{ 
                  width: `${item.percentage}%`,
                  animationDelay: `${index * 200}ms`
                }}
              ></div>
            </div>
          </div>
        ))}

        {/* Peak Performance Insight */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50">
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-emerald-900">Peak performance in Week 4!</span>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Consider analyzing successful strategies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrendsCard;
