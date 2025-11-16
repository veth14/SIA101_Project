import React from 'react';

const ArchivePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F6EE]">


      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
      

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All Records</option>
          <option>Completed Tickets</option>
          <option>Staff Records</option>
          <option>Equipment Logs</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
        <input
          type="text"
          placeholder="Search archives..."
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-0"
        />
        <button className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors">
          Export Data
        </button>
      </div>

      {/* Archive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Tickets</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Staff Records</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Equipment Logs</p>
              <p className="text-2xl font-bold text-gray-900">199</p>
            </div>
          </div>
        </div>
      </div>

      {/* Archived Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Archived Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Archived
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #ARC-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed Ticket
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Room 205 AC repair completed
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Dec 20, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-heritage-green hover:text-heritage-green/80 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-500 mr-3">Download</button>
                  <button className="text-red-600 hover:text-red-500">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #ARC-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Equipment Log
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Pool filter replacement log
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Dec 18, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-heritage-green hover:text-heritage-green/80 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-500 mr-3">Download</button>
                  <button className="text-red-600 hover:text-red-500">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #ARC-003
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Staff Record
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Former employee: Sarah Wilson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Dec 15, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-heritage-green hover:text-heritage-green/80 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-500 mr-3">Download</button>
                  <button className="text-red-600 hover:text-red-500">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Clock Logs Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-heritage-green/10 rounded-lg">
              <svg className="w-5 h-5 text-heritage-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900">Clock Logs</h2>
          </div>
          
          {/* Filter Controls for Clock Logs */}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Search by name or task..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-heritage-green/50">
              <option>Filter by classification</option>
              <option>Maintenance</option>
              <option>Housekeeping</option>
              <option>Front Desk</option>
            </select>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
            <button className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors text-sm">
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  John Doe
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Maintenance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Fri, Sep 20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  08:00 - 16:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  --
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  --
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    On-Duty
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Maria Santos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Housekeeping
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Fri, Sep 20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  09:00 - 17:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  17:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  8
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Off-Duty
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Jose Bato
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Housekeeping
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Fri, Sep 20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  08:00 - 16:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  --
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  --
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    On-Duty
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Sarah Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Front Desk
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Fri, Sep 20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  08:00 - 16:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  16:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  8
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Off-Duty
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ArchivePage;
