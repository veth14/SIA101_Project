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
import { subscribeArchivedRecords, fetchArchiveRecordById } from './archiveService';
import ArchivedTicketDetailModal from './ArchivedTicketDetailModal';
import { ConfirmDialog } from '../../admin/ConfirmDialog';

// Minimal local ErrorBoundary to catch render-time errors inside this page.
class LocalErrorBoundary extends React.Component<{}, { hasError: boolean; error?: Error | null; info?: any }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  componentDidCatch(error: Error, info: any) {
    // Store error so we can render a helpful message and avoid the red screen
    // Log to console for developer inspection.
    // eslint-disable-next-line no-console
    console.error('LocalErrorBoundary caught error in ArchivePage child:', error, info);
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-semibold text-red-700">Archive page failed to render</h3>
          <p className="text-sm text-red-600 mt-2">An error occurred while rendering the archive section. Details below:</p>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-800 bg-white p-3 rounded">{String(this.state.error?.message ?? this.state.error)}</pre>
          {this.state.info?.componentStack && (
            <details className="mt-2 text-xs text-gray-600">
              <summary className="cursor-pointer">Component stack</summary>
              <pre className="whitespace-pre-wrap">{String(this.state.info.componentStack)}</pre>
            </details>
          )}
        </div>
      );
    }
    // @ts-ignore allow children
    return this.props.children;
  }
}

const ArchivePage: React.FC = () => {
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [logs, setLogs] = useState<ClockLog[]>([]);
  const [loading, setLoading] = useState({ stats: false, records: false, logs: false });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data (stats + records) once, and subscribe to live clock log updates.
    let unsubClock: (() => void) | undefined;
    let unsubArchives: (() => void) | undefined;
    const load = async () => {
      try {
        setLoading({ stats: true, records: true, logs: true });
        const s = await fetchArchiveStats();
        setStats(s);
      } catch (err) {
        setError((err as Error)?.message ?? 'Failed to load archive data');
      } finally {
        setLoading(prev => ({ ...prev, stats: false, records: false }));
      }
    };
    load();

    // Subscribe to archived records using a shared listener so we receive deltas.
    unsubArchives = subscribeArchivedRecords((delta, full) => {
      setRecords(full ?? []);
      setLoading(prev => ({ ...prev, records: false }));
    }, { limit: 200 });

    // Subscribe to clock logs using a shared onSnapshot listener to avoid repeated reads.
    unsubClock = subscribeClockLogs((delta, full) => {
      setLogs(full ?? []);
      setLoading(prev => ({ ...prev, logs: false }));
    }, { limit: 50 });

    return () => {
      if (unsubClock) unsubClock();
      if (unsubArchives) unsubArchives();
    };
  }, []);

  // View modal state
  const [viewing, setViewing] = useState<{ id: string; data?: Record<string, any> } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; description?: string } | null>(null);

  const handleDelete = async (id: string) => {
    // open confirmation modal
    setShowDeleteConfirm({ id });
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadArchiveRecord(id);
    } catch (err) {
      setError((err as Error)?.message ?? 'Download failed');
    }
  };

  const handleView = async (id: string) => {
    try {
      setLoading(prev => ({ ...prev, records: true }));
      const data = await fetchArchiveRecordById(id);
      setViewing({ id, data: data ?? undefined });
    } catch (err) {
      setError((err as Error)?.message ?? 'Failed to fetch record');
    } finally {
      setLoading(prev => ({ ...prev, records: false }));
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteArchiveRecord(id);
      // subscription will update records list via onSnapshot; keep local optimistic filter to be immediate
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError((err as Error)?.message ?? 'Delete failed');
    }
  };

  // Compute number of unique staff who timed in today (based on clock log timeInRaw or date)
  const staffCountToday = React.useMemo(() => {
    if (!logs || logs.length === 0) return 0;
    const today = new Date();

    const toDateSafe = (v: any): Date | null => {
      if (!v) return null;
      if (v instanceof Date) return v;
      // If it's an object that looks like { seconds, nanoseconds } we can't parse here reliably
      // but most cached values will be ISO strings or numbers.
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    };

    const isSameDay = (d?: any) => {
      const dt = toDateSafe(d);
      if (!dt) return false;
      return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && dt.getDate() === today.getDate();
    };

    const set = new Set<string>();
    for (const l of logs) {
      let dtRaw: any = l.timeInRaw ?? l.timeOutRaw ?? null;
      if (!dtRaw && l.date) dtRaw = l.date;
      const dt = toDateSafe(dtRaw);
      if (!dt) continue;
      if (!isSameDay(dt)) continue;
      const id = l.staffId ?? l.staffMember ?? '';
      if (id) set.add(String(id));
    }
    return set.size;
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        {/* Pass data into the unified sections. Components are data-driven and contain no mock data. */}
        {/* Local error boundary so an exception in ArchiveRecordsSection doesn't crash the whole page */}
        {/**
         * Using a small inline ErrorBoundary here because the shared ErrorBoundary file
         * was reportedly reverted and navigation to this page currently crashes.
         * This will surface the actual error in the UI and prevent a blank page.
         */}
        <LocalErrorBoundary>
          <ArchiveRecordsSection
            stats={stats}
            records={records}
            loading={loading.records}
            staffCountToday={staffCountToday}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onView={handleView}
          />
        </LocalErrorBoundary>

        <ClockLogsSection logs={logs} loading={loading.logs} />

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        {/* View modal */}
        {viewing && (
          <ArchivedTicketDetailModal
            isOpen={true}
            onClose={() => setViewing(null)}
            ticketId={viewing.id}
            data={viewing.data ?? null}
          />
        )}

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={() => { confirmDelete(showDeleteConfirm.id); setShowDeleteConfirm(null); }}
            title="Delete archived ticket"
            message={`Are you sure you want to permanently delete ticket ${showDeleteConfirm.id}? This action cannot be undone.`}
            confirmText="Delete"
            type="danger"
          />
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
