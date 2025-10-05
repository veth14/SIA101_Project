import React from 'react';

const ProcurementCharts: React.FC = () => {
  // Sample procurement data
  const procurementData = [
    { month: 'Jan', orders: 45, value: 2800, suppliers: 12, onTime: 94 },
    { month: 'Feb', orders: 52, value: 3200, suppliers: 14, onTime: 96 },
    { month: 'Mar', orders: 38, value: 2400, suppliers: 11, onTime: 89 },
    { month: 'Apr', orders: 61, value: 3800, suppliers: 16, onTime: 92 },
    { month: 'May', orders: 47, value: 2900, suppliers: 13, onTime: 97 },
    { month: 'Jun', orders: 55, value: 3400, suppliers: 15, onTime: 91 },
    { month: 'Jul', orders: 49, value: 3100, suppliers: 14, onTime: 95 },
    { month: 'Aug', orders: 53, value: 3300, suppliers: 15, onTime: 93 },
    { month: 'Sep', orders: 41, value: 2600, suppliers: 12, onTime: 96 },
    { month: 'Oct', orders: 58, value: 3600, suppliers: 16, onTime: 94 },
    { month: 'Nov', orders: 46, value: 2800, suppliers: 13, onTime: 92 },
    { month: 'Dec', orders: 51, value: 3200, suppliers: 14, onTime: 95 }
  ];

  const maxOrders = Math.max(...procurementData.map(d => d.orders));
  const maxValue = Math.max(...procurementData.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Procurement Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">Purchase orders & supplier performance trends</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-blue-700">Live</span>
            </div>
            
            <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium text-gray-700">Export</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchase Orders Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 11.5V5z" clipRule="evenodd" />
                </svg>
              </div>
              Purchase Orders
            </h4>
            
            <div className="h-64 relative">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 font-medium">
                <span>{maxOrders}</span>
                <span>{Math.round(maxOrders * 0.75)}</span>
                <span>{Math.round(maxOrders * 0.5)}</span>
                <span>{Math.round(maxOrders * 0.25)}</span>
                <span>0</span>
              </div>
              
              <div className="ml-8 h-full flex items-end justify-between pt-4 pb-8">
                {procurementData.map((data) => (
                  <div key={data.month} className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-6 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                      style={{ height: `${(data.orders / maxOrders) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {data.orders} orders
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Value Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              Order Value (₱K)
            </h4>
            
            <div className="h-64 relative">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 font-medium">
                <span>{maxValue}</span>
                <span>{Math.round(maxValue * 0.75)}</span>
                <span>{Math.round(maxValue * 0.5)}</span>
                <span>{Math.round(maxValue * 0.25)}</span>
                <span>0</span>
              </div>
              
              <div className="ml-8 h-full flex items-end justify-between pt-4 pb-8">
                {procurementData.map((data) => (
                  <div key={data.month} className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-6 bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer relative group"
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ₱{data.value}K
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCharts;
