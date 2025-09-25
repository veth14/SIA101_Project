import React from 'react';
import ActivityItem from './ActivityItem';
import { EditIcon, UsersIcon, BulbIcon, CalendarIcon, MailIcon } from '../shared/icons';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      title: "John Doe stuck in elevator",
      description: "Elevator B",
      timeAgo: "5 min ago",
      status: "In Progress",
      icon: <EditIcon />,
      colorScheme: 'blue' as const
    },
    {
      title: "New ticket assigned to Mike Johnson",
      description: "HVAC System",
      timeAgo: "15 min ago",
      status: "Assigned",
      icon: <UsersIcon />,
      colorScheme: 'emerald' as const
    },
    {
      title: "New member add salary John Wilson",
      description: "HR Department",
      timeAgo: "32 min ago",
      status: "Pending",
      icon: <BulbIcon />,
      colorScheme: 'amber' as const
    },
    {
      title: "Weekly schedule updated",
      description: "All Staff",
      timeAgo: "1 hr ago",
      status: "Updated",
      icon: <CalendarIcon />,
      colorScheme: 'pink' as const
    },
    {
      title: "Safety fire completed maintenance task",
      description: "Fire Safety",
      timeAgo: "2 hr ago",
      status: "Completed",
      icon: <MailIcon />,
      colorScheme: 'red' as const
    }
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20"></div>
      <div className="relative bg-gradient-to-br from-white/95 to-green-50/30 backdrop-blur-xl rounded-3xl border border-green-200/40 shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#82A33D] to-green-600 rounded-xl shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Recent Activity</h2>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-[#82A33D] to-green-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              View All
            </button>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.title}
                title={activity.title}
                description={activity.description}
                timeAgo={activity.timeAgo}
                status={activity.status}
                icon={activity.icon}
                colorScheme={activity.colorScheme}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
