import React, { useEffect, useState } from 'react';
import ArchiveRecordsSection from './ArchiveRecordsSection';
import ClockLogsSection from './ClockLogsSection';
import {
  ArchiveRecord,
  ArchiveStats,
  ClockLog,
  fetchArchiveRecords,
  fetchArchiveStats,
  // fetchClockLogs, (replaced by subscribeClockLogs to keep listener)
  subscribeClockLogs,
  deleteArchiveRecord,
  downloadArchiveRecord,
} from './archiveService';

const ArchivePage: React.FC = () => {
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [logs, setLogs] = useState<ClockLog[]>([]);
  const [loading, setLoading] = useState({ stats: false, records: false, logs: false });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data (stats + records) once, and subscribe to live clock log updates.
    let unsubClock: (() => void) | undefined;
    const load = async () => {
      try {
        setLoading({ stats: true, records: true, logs: true });
        const [s, r] = await Promise.all([fetchArchiveStats(), fetchArchiveRecords()]);
        setStats(s);
        setRecords(r);
      } catch (err) {
        setError((err as Error)?.message ?? 'Failed to load archive data');
      } finally {
        setLoading(prev => ({ ...prev, stats: false, records: false }));
      }
    };
    load();

    // Subscribe to clock logs using a shared onSnapshot listener to avoid repeated reads.
    unsubClock = subscribeClockLogs((delta, full) => {
      setLogs(full ?? []);
      setLoading(prev => ({ ...prev, logs: false }));
    }, { limit: 50 });

    return () => {
      if (unsubClock) unsubClock();
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteArchiveRecord(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError((err as Error)?.message ?? 'Delete failed');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadArchiveRecord(id);
      // implement file save logic when backend returns a blob/URL
    } catch (err) {
      setError((err as Error)?.message ?? 'Download failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Top-level filters and actions remain here so they're shared between sections */}
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

        {/* Pass data into the unified sections. Components are data-driven and contain no mock data. */}
        <ArchiveRecordsSection
          stats={stats}
          records={records}
          loading={loading.records}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />

        <ClockLogsSection logs={logs} loading={loading.logs} />

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
