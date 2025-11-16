import React from 'react';

const StaffSchedulesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F6EE]">

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

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
    </div>
  );
};

export default StaffSchedulesPage;
