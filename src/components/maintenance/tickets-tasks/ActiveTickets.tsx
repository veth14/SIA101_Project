import React, { useState } from 'react';
import type { Ticket } from './ticketsService';

interface Props {
  tickets: Ticket[];
  loading?: boolean;
  onConfirmAvailability?: (t: Ticket) => void;
  onReportComplication?: (t: Ticket) => void;
  onMarkCompleted?: (t: Ticket) => void;
}

const ActiveTickets: React.FC<Props> = ({ tickets, loading, onConfirmAvailability, onReportComplication, onMarkCompleted }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
  };

  // NOTE: filtering is client-side here; when wiring backend pass filters into query
  const filtered = tickets.filter((t) => {
    if (!t) return false;
    // normalize fields: Ticket uses taskTitle and roomNumber in the service/type
    const title = (t as any).taskTitle ?? (t as any).title ?? '';
    const location = (t as any).roomNumber ?? (t as any).location ?? '';
    if (search && !(title + ' ' + (t.description ?? '') + ' ' + (location ?? '')).toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'All' && (t.status ?? 'Unknown') !== statusFilter) return false;
    if (priorityFilter !== 'All' && (t.priority ?? '') !== priorityFilter) return false;
    if (categoryFilter !== 'All' && (t.category ?? '') !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Active Tickets</h2>

        {/* Filter controls placed top-right as requested */}
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or task..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="All">All Category</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
          </select>
          <button onClick={clearFilters} className="bg-heritage-green text-white px-3 py-2 rounded text-sm">Clear Filters</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading active tickets...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No active tickets found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(t as any).taskTitle ?? (t as any).title ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(t as any).roomNumber ?? (t as any).location ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.category ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{t.priority ?? '-'}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.assignedTo ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{t.status ?? '-'}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => onConfirmAvailability?.(t)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">Confirm Availability</button>
                      <button onClick={() => onReportComplication?.(t)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Report Complication</button>
                      <button onClick={() => onMarkCompleted?.(t)} className="bg-heritage-green text-white px-3 py-1 rounded text-xs">Mark as Completed</button>
                    </div>
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

export default ActiveTickets;
