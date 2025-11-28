import React from 'react';
import { ArchiveRecord, ArchiveStats, fetchArchiveRecordById } from './archiveService';
import StatsCard from '../overview/StatsCard';

interface Props {
  stats?: ArchiveStats | null;
  records: ArchiveRecord[];
  loading?: boolean;
  staffCountToday?: number;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PAGE_SIZE = 10;

const ArchiveRecordsSection: React.FC<Props> = ({ stats, records, loading, staffCountToday, onView, onDownload, onDelete }) => {
  const [page, setPage] = React.useState(1);
  // Filters local to the archived records section
  const [search, setSearch] = React.useState('');
  // Removed middle type filter per request; keep search and date only
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Completed Ticket' | 'Staff Record' | 'Equipment Log'>('All');
  const [dateFilter, setDateFilter] = React.useState<string>(''); // yyyy-mm-dd
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // reset page when records or filters change
    setPage(1);
  }, [records, search, typeFilter, dateFilter]);

  // Helper: basic safe parse of date-like strings into Date, fallback null if invalid
  const tryParseDate = (s?: string): Date | null => {
    if (!s) return null;
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    // try to extract yyyy-mm-dd
    const m = s.match(/(\d{4}-\d{2}-\d{2})/);
    if (m) {
      const d2 = new Date(m[1]);
      return isNaN(d2.getTime()) ? null : d2;
    }
    return null;
  };

      const filteredRecords = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    return records.filter((rec) => {
      if (typeFilter !== 'All' && (rec.type ?? '') !== typeFilter) return false;

      if (dateFilter) {
        const recDate = tryParseDate(rec.dateArchived);
        // dateFilter from input is yyyy-mm-dd
        const parts = dateFilter.split('-');
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          if (!recDate) {
            // fallback: substring match
            if (!String(rec.dateArchived ?? '').includes(dateFilter)) return false;
          } else {
            if (!(recDate.getFullYear() === d.getFullYear() && recDate.getMonth() === d.getMonth() && recDate.getDate() === d.getDate())) return false;
          }
        }
      }

      if (!s) return true;
      const fields = [rec.id ?? '', rec.type ?? '', rec.title ?? '', rec.description ?? '', rec.dateArchived ?? ''];
      return fields.some((f) => String(f).toLowerCase().includes(s));
    });
  }, [records, search, typeFilter, dateFilter]);

  // CSV export of the currently filtered records
  const exportCsv = () => {
  const rows = filteredRecords.map(r => ({ id: r.id, type: r.type, title: r.title ?? '', description: r.description ?? '', dateArchived: r.dateArchived ?? '' }));
  const headers = ['id', 'type', 'title', 'description', 'dateArchived'];
    const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => '"' + String((r as any)[h] ?? '').replace(/"/g, '""') + '"').join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archived_records_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
  };

  // Export HTML-as-XLS with uniform column width and centered content
  const exportXlsHtml = async () => {
    try {
      const target = filteredRecords.slice();
      const detailedPromises = target.map((r: ArchiveRecord) => fetchArchiveRecordById(r.id).then(d => ({ meta: r, data: d })).catch(() => ({ meta: r, data: null })));
      const detailed = await Promise.all(detailedPromises);

      // Build union of keys
      const keySet = new Set<string>();
      const baseCols = ['id', 'type', 'title', 'dateArchived'];
      baseCols.forEach(k => keySet.add(k));
      for (const item of detailed) {
        const obj = item.data ?? {};
        for (const k of Object.keys(obj)) {
          if (!baseCols.includes(k)) keySet.add(k);
        }
      }
      const extraCols = Array.from(keySet).filter(k => !baseCols.includes(k)).sort();
      const headers = baseCols.concat(extraCols);

      // Column width and row height per request
      const colWidthPx = 180;
      const rowHeightPx = 53;

      const escapeHtml = (s: any) => {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };

      let html = '<html><head><meta charset="UTF-8"></head><body>';
      html += `<table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse;">`;
      // colgroup
      html += '<colgroup>' + headers.map(() => `<col style="width:${colWidthPx}px;">`).join('') + '</colgroup>';
      // header
      html += '<thead><tr>' + headers.map(h => `<th style="background:#f3f4f6; height:${rowHeightPx}px; text-align:center; vertical-align:middle;">${escapeHtml(h)}</th>`).join('') + '</tr></thead>';
      html += '<tbody>';

      for (const { meta, data } of detailed) {
        const rowObj: Record<string, any> = {};
        rowObj.id = meta.id;
        rowObj.type = meta.type ?? '';
        rowObj.title = meta.title ?? '';
        rowObj.dateArchived = meta.dateArchived ?? '';
        if (data && typeof data === 'object') {
          for (const k of Object.keys(data)) {
            if (!rowObj.hasOwnProperty(k)) {
              const v = (data as Record<string, any>)[k];
              rowObj[k] = (v === null || v === undefined) ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v));
            }
          }
        }

        html += '<tr>';
        for (const h of headers) {
          const cell = rowObj[h] ?? '';
          html += `<td style="height:${rowHeightPx}px; text-align:center; vertical-align:middle; white-space:normal; word-wrap:break-word;">${escapeHtml(cell)}</td>`;
        }
        html += '</tr>';
      }

      html += '</tbody></table></body></html>';

      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dt = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const stamp = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}_${pad(dt.getHours())}-${pad(dt.getMinutes())}-${pad(dt.getSeconds())}`;
      a.download = `archived_tickets_${stamp}.xls`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
    } catch (err) {
      // fallback to CSV export
      exportCsv();
    }
  };

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  const displayRecords = filteredRecords.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalItems = filteredRecords.length;
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

      <div>
        {/* Archive Stats - 3 cards matching overview/StatsCard style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            index={0}
            title="Total Records"
            value={stats?.totalRecords ?? records.length ?? 0}
            iconBg="bg-emerald-100"
            icon={(
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h3l2 3h6a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            )}
          />

          <StatsCard
            index={1}
            title="Completed Tickets"
            value={stats?.completedTickets ?? 0}
            iconBg="bg-blue-100"
            icon={(
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          />

          <StatsCard
            index={2}
            title="Staff Records"
            value={staffCountToday ?? stats?.staffRecords ?? 0}
            iconBg="bg-purple-100"
            icon={(
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM6 21v-2a4 4 0 014-4h4" />
              </svg>
            )}
          />
        </div>

        {/* Archived Records Table */}
        <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70">
          {/* Header with Search and Controls */}
          <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                  <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                    <svg className="w-6 h-6 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h3.5a1 1 0 01.7.3l.8.8h4a2 2 0 012 2v3.5a1 1 0 01-.3.7l-1.2 1.2V16a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                    </svg>
                  </div>
                  Archived Records
                </h3>
                <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                    {totalItems === 0
                      ? '0 results'
                      : `${displayedStart}-${displayedEnd} of ${totalItems}`}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>Paginated view</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => exportXlsHtml()}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] transition-all bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Export Data</span>
                </button>
              </div>
            </div>

            {/* Search and Filter Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Search */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search archives..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
                />
              </div>

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
                <p className="font-medium text-gray-500">Loading archived records...</p>
              </div>
            ) : totalItems === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-5xl text-gray-400">🔍</div>
                <p className="font-medium text-gray-500">No archived records found</p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                  <tr>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Record ID</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Type</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Description</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Date Archived</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayRecords.map((rec, index) => (
                    <tr 
                      key={rec.id}
                      style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-sm hover:bg-gray-50"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#82A33D]/10">
                            <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                            {rec.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 border border-blue-200">
                          {rec.type}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{rec.title ?? '-'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{rec.description ?? '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-center whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rec.dateArchived ?? '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="px-3 py-1.5 text-xs font-bold text-[#82A33D] bg-[#82A33D]/10 rounded-lg hover:bg-[#82A33D] hover:text-white transition-all" 
                            onClick={() => onView?.(rec.id)}
                          >
                            View
                          </button>
                          <button 
                            className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all" 
                            onClick={() => onDownload?.(rec.id)}
                          >
                            Download
                          </button>
                          <button 
                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all" 
                            onClick={() => onDelete?.(rec.id)}
                          >
                            Delete
                          </button>
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
      </div>
    </>
  );
};

export default ArchiveRecordsSection;
