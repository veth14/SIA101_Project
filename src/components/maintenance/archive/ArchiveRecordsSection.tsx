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
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Completed Ticket' | 'Staff Record' | 'Equipment Log'>('All');
  const [dateFilter, setDateFilter] = React.useState<string>(''); // yyyy-mm-dd

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

  return (
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-heritage-green/10 rounded-lg">
              <svg className="w-5 h-5 text-heritage-green" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h3.5a1 1 0 01.7.3l.8.8h4a2 2 0 012 2v3.5a1 1 0 01-.3.7l-1.2 1.2V16a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900">Archived Records</h2>
          </div>

          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Search archives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-heritage-green/50 w-64"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All Records</option>
              <option value="Completed Ticket">Completed Tickets</option>
              <option value="Staff Record">Staff Records</option>
              <option value="Equipment Log">Equipment Logs</option>
            </select>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <button onClick={() => { setSearch(''); setTypeFilter('All'); setDateFilter(''); }} className="bg-heritage-green text-white px-3 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors text-sm">Clear</button>
            <button onClick={() => exportXlsHtml()} className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-500 transition-colors text-sm">Export Data</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">Loading archived records...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No archived records found.</div>
          ) : (
            <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Archived</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE).map((rec) => (
                  <tr key={rec.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rec.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{rec.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rec.title ?? '-'}</td>
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
              <div className="text-sm text-gray-600">Showing {(filteredRecords.length===0)?0:((page-1)*PAGE_SIZE + 1)} to {Math.min(page*PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length}</div>
              <div className="flex items-center space-x-2">
                <button
                  className={`px-3 py-1 border rounded-md text-sm ${page===1? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => setPage(p => Math.max(1, p-1))}
                  disabled={page===1}
                >Previous</button>
                {/* page numbers (show up to 7) */}
                {Array.from({length: Math.ceil(filteredRecords.length / PAGE_SIZE)}, (_, i) => i+1).slice(0, 1000).map((p) => {
                  // show compact set: first, last, current +/-2
                  const total = Math.ceil(filteredRecords.length / PAGE_SIZE);
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
                  className={`px-3 py-1 border rounded-md text-sm ${page>=Math.ceil(filteredRecords.length/PAGE_SIZE)? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => setPage(p => Math.min(Math.ceil(filteredRecords.length/PAGE_SIZE), p+1))}
                  disabled={page>=Math.ceil(filteredRecords.length/PAGE_SIZE)}
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
