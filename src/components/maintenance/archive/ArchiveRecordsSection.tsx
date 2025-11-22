import React from 'react';
import { ArchiveRecord, ArchiveStats } from './archiveService';

interface Props {
  stats?: ArchiveStats | null;
  records: ArchiveRecord[];
  loading?: boolean;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PAGE_SIZE = 10;

const ArchiveRecordsSection: React.FC<Props> = ({ stats, records, loading, onView, onDownload, onDelete }) => {
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    // reset page when records change (e.g., after filters or refresh)
    setPage(1);
  }, [records]);
  return (
    <div>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.totalRecords ?? 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.completedTickets ?? 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.staffRecords ?? 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.equipmentLogs ?? 0}</p>
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
          {loading ? (
            <div className="p-6">Loading archived records...</div>
          ) : records.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No archived records found.</div>
          ) : (
            <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Archived</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE).map((rec) => (
                  <tr key={rec.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rec.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{rec.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rec.description ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.dateArchived ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-heritage-green hover:text-heritage-green/80 mr-3" onClick={() => onView?.(rec.id)}>View</button>
                      <button className="text-blue-600 hover:text-blue-500 mr-3" onClick={() => onDownload?.(rec.id)}>Download</button>
                      <button className="text-red-600 hover:text-red-500" onClick={() => onDelete?.(rec.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination controls */}
            <div className="px-6 py-3 flex items-center justify-between bg-white">
              <div className="text-sm text-gray-600">Showing {(records.length===0)?0:( (page-1)*PAGE_SIZE + 1)} to {Math.min(page*PAGE_SIZE, records.length)} of {records.length}</div>
              <div className="flex items-center space-x-2">
                <button
                  className={`px-3 py-1 border rounded-md text-sm ${page===1? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => setPage(p => Math.max(1, p-1))}
                  disabled={page===1}
                >Previous</button>
                {/* page numbers (show up to 7) */}
                {Array.from({length: Math.ceil(records.length / PAGE_SIZE)}, (_, i) => i+1).slice(0, 1000).map((p) => {
                  // show compact set: first, last, current +/-2
                  const total = Math.ceil(records.length / PAGE_SIZE);
                  if (total > 7) {
                    if (p===1 || p===total || (p>=page-2 && p<=page+2)) {
                      return (
                        <button key={p} onClick={() => setPage(p)} className={`px-2 py-1 rounded-md text-sm ${p===page? 'bg-heritage-green text-white' : 'text-gray-700 hover:bg-gray-50'}`}>{p}</button>
                      );
                    }
                    if (p===2 && page>4) return <span key={p} className="px-2">...</span>;
                    if (p===total-1 && page< total-3) return <span key={p} className="px-2">...</span>;
                    return null;
                  }
                  return <button key={p} onClick={() => setPage(p)} className={`px-2 py-1 rounded-md text-sm ${p===page? 'bg-heritage-green text-white' : 'text-gray-700 hover:bg-gray-50'}`}>{p}</button>;
                })}
                <button
                  className={`px-3 py-1 border rounded-md text-sm ${page>=Math.ceil(records.length/PAGE_SIZE)? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => setPage(p => Math.min(Math.ceil(records.length/PAGE_SIZE), p+1))}
                  disabled={page>=Math.ceil(records.length/PAGE_SIZE)}
                >Next</button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchiveRecordsSection;
