import React from 'react';

const DepartmentCharts: React.FC = () => {
  // Sample department data
  const departmentData = [
    { month: 'Jan', housekeeping: 45, frontoffice: 28, fnb: 35, maintenance: 22, security: 15 },
    { month: 'Feb', housekeeping: 52, frontoffice: 32, fnb: 41, maintenance: 28, security: 18 },
    { month: 'Mar', housekeeping: 38, frontoffice: 25, fnb: 29, maintenance: 19, security: 12 },
    { month: 'Apr', housekeeping: 61, frontoffice: 38, fnb: 47, maintenance: 31, security: 21 },
    { month: 'May', housekeeping: 47, frontoffice: 29, fnb: 36, maintenance: 24, security: 16 },
    { month: 'Jun', housekeeping: 55, frontoffice: 34, fnb: 42, maintenance: 28, security: 19 },
    { month: 'Jul', housekeeping: 49, frontoffice: 31, fnb: 38, maintenance: 25, security: 17 },
    { month: 'Aug', housekeeping: 53, frontoffice: 33, fnb: 40, maintenance: 27, security: 18 },
    { month: 'Sep', housekeeping: 41, frontoffice: 26, fnb: 32, maintenance: 21, security: 14 },
    { month: 'Oct', housekeeping: 58, frontoffice: 36, fnb: 44, maintenance: 29, security: 20 },
    { month: 'Nov', housekeeping: 46, frontoffice: 28, fnb: 35, maintenance: 23, security: 16 },
    { month: 'Dec', housekeeping: 51, frontoffice: 32, fnb: 39, maintenance: 26, security: 18 }
  ];

  const maxRequests = Math.max(...departmentData.flatMap(d => [d.housekeeping, d.frontoffice, d.fnb, d.maintenance, d.security]));

  // Department performance data
  const departmentPerformance = [
    { name: 'Housekeeping', requests: 156, avgTime: '2.1h', approval: 94, color: 'bg-blue-500' },
    { name: 'Front Office', requests: 89, avgTime: '1.8h', approval: 97, color: 'bg-green-500' },
    { name: 'Food & Beverage', requests: 134, avgTime: '2.5h', approval: 91, color: 'bg-orange-500' },
    { name: 'Maintenance', requests: 78, avgTime: '3.2h', approval: 88, color: 'bg-red-500' },
    { name: 'Security', requests: 45, avgTime: '1.5h', approval: 98, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Department Requests Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Department Request Trends</h3>
              <p className="text-sm text-gray-600 mt-1">Monthly request volume by department</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-purple-700">Live</span>
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
        
        <div className="p-6">
          <div className="h-80 bg-gray-50 rounded-lg border border-gray-100">
            <svg className="w-full h-full p-4" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="housekeepingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <linearGradient id="frontofficeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id="fnbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <linearGradient id="maintenanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F87171" />
                </linearGradient>
                <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="60"
                  y1={40 + (i * 45)}
                  x2="1140"
                  y2={40 + (i * 45)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              
              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <text
                  key={i}
                  x="50"
                  y={45 + (i * 45)}
                  textAnchor="end"
                  className="text-xs fill-gray-600 font-medium"
                  dominantBaseline="middle"
                >
                  {Math.round(maxRequests - (i * maxRequests / 5))}
                </text>
              ))}
              
              {/* X-axis labels */}
              {departmentData.map((data, index) => (
                <text
                  key={data.month}
                  x={60 + (index * 90)}
                  y="300"
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium"
                >
                  {data.month}
                </text>
              ))}
              
              {/* Lines */}
              <polyline
                fill="none"
                stroke="url(#housekeepingGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={departmentData.map((data, index) => 
                  `${60 + (index * 90)},${265 - ((data.housekeeping / maxRequests) * 180)}`
                ).join(' ')}
              />
              
              <polyline
                fill="none"
                stroke="url(#frontofficeGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={departmentData.map((data, index) => 
                  `${60 + (index * 90)},${265 - ((data.frontoffice / maxRequests) * 180)}`
                ).join(' ')}
              />
              
              <polyline
                fill="none"
                stroke="url(#fnbGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={departmentData.map((data, index) => 
                  `${60 + (index * 90)},${265 - ((data.fnb / maxRequests) * 180)}`
                ).join(' ')}
              />
              
              <polyline
                fill="none"
                stroke="url(#maintenanceGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={departmentData.map((data, index) => 
                  `${60 + (index * 90)},${265 - ((data.maintenance / maxRequests) * 180)}`
                ).join(' ')}
              />
              
              <polyline
                fill="none"
                stroke="url(#securityGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={departmentData.map((data, index) => 
                  `${60 + (index * 90)},${265 - ((data.security / maxRequests) * 180)}`
                ).join(' ')}
              />
              
              {/* Data points */}
              {departmentData.map((data, index) => (
                <g key={data.month}>
                  <circle cx={60 + (index * 90)} cy={265 - ((data.housekeeping / maxRequests) * 180)} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" className="cursor-pointer">
                    <title>Housekeeping ({data.month}): {data.housekeeping}</title>
                  </circle>
                  <circle cx={60 + (index * 90)} cy={265 - ((data.frontoffice / maxRequests) * 180)} r="4" fill="#10B981" stroke="white" strokeWidth="2" className="cursor-pointer">
                    <title>Front Office ({data.month}): {data.frontoffice}</title>
                  </circle>
                  <circle cx={60 + (index * 90)} cy={265 - ((data.fnb / maxRequests) * 180)} r="4" fill="#F59E0B" stroke="white" strokeWidth="2" className="cursor-pointer">
                    <title>F&B ({data.month}): {data.fnb}</title>
                  </circle>
                  <circle cx={60 + (index * 90)} cy={265 - ((data.maintenance / maxRequests) * 180)} r="4" fill="#EF4444" stroke="white" strokeWidth="2" className="cursor-pointer">
                    <title>Maintenance ({data.month}): {data.maintenance}</title>
                  </circle>
                  <circle cx={60 + (index * 90)} cy={265 - ((data.security / maxRequests) * 180)} r="4" fill="#8B5CF6" stroke="white" strokeWidth="2" className="cursor-pointer">
                    <title>Security ({data.month}): {data.security}</title>
                  </circle>
                </g>
              ))}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex items-center justify-center flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Housekeeping</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Front Office</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Food & Beverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
          <p className="text-sm text-gray-600 mt-1">Current month performance metrics</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentPerformance.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${dept.color} rounded-full mr-3`}></div>
                      <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.requests}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.avgTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.approval}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 ${dept.color} rounded-full`}
                          style={{ width: `${dept.approval}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{dept.approval}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCharts;
