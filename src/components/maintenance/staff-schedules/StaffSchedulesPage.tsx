import React from 'react';

const StaffSchedulesPage: React.FC = () => {
  return (
    <div className="p-6">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
        
        <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                    Staff Schedules
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Schedule and manage staff shifts
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        Tuesday, Sep 24
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-1 h-1 bg-[#82A33D] rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-green-600 rounded-full animate-ping delay-75"></div>
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors">
          Create Schedule
        </button>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>This Week</option>
          <option>Next Week</option>
          <option>This Month</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All Departments</option>
          <option>HVAC</option>
          <option>Electrical</option>
          <option>Plumbing</option>
        </select>
      </div>

      {/* Schedule Calendar */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Weekly Schedule</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monday
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuesday
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wednesday
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thursday
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Friday
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saturday
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sunday
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">John Smith</div>
                  <div className="text-sm text-gray-500">HVAC Technician</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    8:00-16:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    8:00-16:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    8:00-16:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    8:00-16:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    8:00-16:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-400 text-xs">Off</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-400 text-xs">Off</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Mike Johnson</div>
                  <div className="text-sm text-gray-500">Electrician</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    9:00-17:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    9:00-17:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-400 text-xs">Off</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    9:00-17:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    9:00-17:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    9:00-17:00
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-400 text-xs">Off</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffSchedulesPage;
