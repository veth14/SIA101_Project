import React, { useMemo, useState } from 'react';
import { ClockLog } from './archiveService';

interface Props {
  logs: ClockLog[];
  loading?: boolean;
}

const ClockLogsSection: React.FC<Props> = ({ logs, loading }) => {
  const [search, setSearch] = useState('');
  const [classification, setClassification] = useState<'All' | 'Housekeeping' | 'Maintenance'>('All');
  const [dateFilter, setDateFilter] = useState<string>(''); // yyyy-mm-dd
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const filteredLogs = useMemo(() => {
    const s = search.trim().toLowerCase();
    return logs.filter((log) => {
      // Classification filter (only two allowed options)
      if (classification !== 'All' && (log.classification ?? '').toLowerCase() !== classification.toLowerCase()) {
        return false;
      }

      // Date filter: compare against log.date which is formatted for UI (locale string)
      if (dateFilter) {
        try {
          // dateFilter is yyyy-mm-dd
          const parts = dateFilter.split('-');
          if (parts.length === 3) {
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            const logDate = new Date(log.date);
            if (isNaN(logDate.getTime()) || !(
              logDate.getFullYear() === d.getFullYear() &&
              logDate.getMonth() === d.getMonth() &&
              logDate.getDate() === d.getDate()
            )) {
              return false;
            }
          }
        } catch (e) {
          // ignore invalid date filter
        }
      }

      // Search filter: look at staffMember and classification
      if (!s) return true;
      const fields = [log.staffMember ?? '', log.classification ?? ''];
      return fields.some((f) => f.toLowerCase().includes(s));
    });
  }, [logs, search, classification, dateFilter]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  React.useEffect(() => {
    setPage(1);
  }, [search, classification, dateFilter, logs]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const displayLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalItems = filteredLogs.length;
  const displayedStart = totalItems === 0 ? 0 : ((page-1)*PAGE_SIZE + 1);
  const displayedEnd = Math.min(page*PAGE_SIZE, totalItems);

  return (
    <>
      <style>{`
        @keyframes table-slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-table-slide-in {
          animation: table-slide-in 0.7s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>

      <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70 mt-6">
        {/* Header with Search and Controls */}
        <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                Clock Logs
              </h3>
              <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  {totalItems === 0
                    ? '0 results'
                    : `${displayedStart}-${displayedEnd} of ${totalItems}`}
                </span>
                <span className="text-gray-400">•</span>
                <span>Staff Attendance Records</span>
              </p>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or classification..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
              />
            </div>

            {/* Classification Filter */}
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value as 'All' | 'Housekeeping' | 'Maintenance')}
              className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
            >
              <option value="All">📊 All Classifications</option>
              <option value="Housekeeping">🏠 Housekeeping</option>
              <option value="Maintenance">🔧 Maintenance</option>
            </select>

            {/* Date Filter */}
            <div className="relative">
              <input
                ref={dateInputRef}
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                style={{ 
                  colorScheme: 'light',
                  ...((!dateFilter) && {
                    position: 'relative',
                    zIndex: 1,
                    opacity: 0,
                    pointerEvents: 'none'
                  })
                }}
              />
              {!dateFilter && (
                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker?.()}
                  className="absolute inset-0 flex items-center pl-4 text-sm text-gray-500 font-medium bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer z-10"
                >
                  📅 All Dates
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-5xl text-gray-400">⏳</div>
              <p className="font-medium text-gray-500">Loading clock logs...</p>
            </div>
          ) : totalItems === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-5xl text-gray-400">🔍</div>
              <p className="font-medium text-gray-500">No clock logs available</p>
              <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: '22%' }} /> {/* Staff Member */}
                <col style={{ width: '16%' }} /> {/* Classification */}
                <col style={{ width: '12%' }} /> {/* Date */}
                <col style={{ width: '12%' }} /> {/* Time In */}
                <col style={{ width: '12%' }} /> {/* Time Out */}
                <col style={{ width: '12%' }} /> {/* Hours Worked */}
                <col style={{ width: '14%' }} /> {/* Status */}
              </colgroup>
              <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                <tr>
                  <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Staff Member</th>
                  <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Classification</th>
                  <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Time In</th>
                  <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Time Out</th>
                  <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Hours Worked</th>
                  <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayLogs.map((log, index) => (
                  <tr 
                    key={log.id}
                    style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                    className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-[#82A33D]/10">
                          <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="text-sm font-bold text-gray-900 transition-colors truncate group-hover:text-[#82A33D]">
                          {log.staffMember}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center overflow-hidden">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap max-w-full truncate ${
                          log.classification === 'Housekeeping'
                            ? 'bg-gradient-to-r from-purple-100 to-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-gradient-to-r from-orange-100 to-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          {log.classification}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{log.date}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">{log.timeIn ?? '--'}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">{log.timeOut ?? '--'}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{log.hoursWorked ?? '--'}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center overflow-hidden">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 whitespace-nowrap max-w-full truncate">
                          <span className="flex-shrink-0 w-1.5 h-1.5 mr-2 rounded-full bg-emerald-500" />
                          {log.status ?? 'Off-Duty'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination (centered) */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-white/50">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="ml-1">Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else {
                      const start = Math.max(1, Math.min(page - 3, totalPages - 6));
                      pageNum = start + i;
                    }

                    const isActive = pageNum === page;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${isActive ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-1">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClockLogsSection;
