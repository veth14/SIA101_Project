import React from 'react';
import { ClockLog } from './archiveService';

interface Props {
  logs: ClockLog[];
  loading?: boolean;
}

const ClockLogsSection: React.FC<Props> = ({ logs, loading }) => {
  return (
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
          <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-heritage-green/50" />
          <button className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors text-sm">Clear Filters</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading clock logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No clock logs available.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Worked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.staffMember}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.classification}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.timeIn ?? '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.timeOut ?? '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.hoursWorked ?? '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{log.status ?? 'On-Duty'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClockLogsSection;
