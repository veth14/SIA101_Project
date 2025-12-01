import React, { useEffect, useMemo, useState } from 'react';
import ActivityItem from './ActivityItem';
import { subscribeToActiveTickets, type Ticket } from '../tickets-tasks/ticketsService';

const RecentActivity: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToActiveTickets((loaded) => {
      setTickets(loaded || []);
    }, 20);
    return unsubscribe;
  }, []);

  const activities = useMemo(() => {
    const now = new Date();

    const formatTimeAgo = (date: Date) => {
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.max(0, Math.floor(diffMs / 60000));
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin} min ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr} hr${diffHr === 1 ? '' : 's'} ago`;
      const diffDays = Math.floor(diffHr / 24);
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    };

    return tickets.slice(0, 5).map((ticket) => {
      const created = ticket.createdAt?.toDate ? ticket.createdAt.toDate() : new Date();

      // Map status to a compact label and color scheme used by ActivityItem
      const rawStatus = (ticket.status || '').toString();
      let statusLabel: string = rawStatus;
      let colorScheme: 'blue' | 'emerald' | 'amber' | 'pink' | 'red' = 'emerald';

      if (rawStatus === 'Open') {
        statusLabel = 'Open';
        colorScheme = 'amber';
      } else if (rawStatus === 'In Progress') {
        statusLabel = 'In Progress';
        colorScheme = 'blue';
      } else if (rawStatus === 'Completed') {
        statusLabel = 'Completed';
        colorScheme = 'emerald';
      }

      const title = ticket.taskTitle || 'Maintenance task';
      const descriptionParts: string[] = [];
      if (ticket.category) descriptionParts.push(ticket.category);
      if (ticket.roomNumber) descriptionParts.push(`Room ${ticket.roomNumber}`);
      if (ticket.priority) descriptionParts.push(`${ticket.priority} priority`);

      return {
        title,
        description: descriptionParts.join(' • ') || 'Maintenance ticket',
        timeAgo: formatTimeAgo(created),
        status: statusLabel,
        colorScheme,
      };
    });
  }, [tickets]);

  const activitiesToday = useMemo(() => {
    if (!tickets.length) return 0;
    const today = new Date();
    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return tickets.filter((t) => {
      const created = t.createdAt?.toDate ? t.createdAt.toDate() : null;
      if (!created) return false;
      return created >= dayStart && created < dayEnd;
    }).length;
  }, [tickets]);

  return (
    <div className="mt-6">
      <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl min-h-[320px]">
        {/* Background wash to match financial RecentActivities */}
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/6 via-heritage-light/25 to-heritage-green/6 rounded-3xl opacity-70"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="px-8 py-6 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#82A33D]/10 text-heritage-green border border-[#82A33D]/15">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Recent Activities
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-semibold text-gray-600">Key maintenance events</p>
                    <div className="w-1 h-1 bg-heritage-green rounded-full"></div>
                    <span className="text-sm font-bold text-heritage-green">
                      {activitiesToday} activit{activitiesToday === 1 ? 'y' : 'ies'} listed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity list */}
          <div className="px-8 py-6">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={`${activity.title}-${activity.timeAgo}-${index}`}
                  title={activity.title}
                  description={activity.description}
                  timeAgo={activity.timeAgo}
                  status={activity.status}
                  // Status color mapping: use emerald for completed, blue for in-progress, amber for open
                  colorScheme={activity.colorScheme}
                  icon={null}
                />
              ))}
              {!activities.length && (
                <div className="text-sm text-heritage-neutral/70">No recent maintenance tickets.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
