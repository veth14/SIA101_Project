import React from 'react';

interface ActivityItemProps {
  title: string;
  description: string;
  timeAgo: string;
  status: string;
  icon: React.ReactNode;
  colorScheme: 'blue' | 'emerald' | 'amber' | 'pink' | 'red';
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  description,
  timeAgo,
  status,
  icon,
  colorScheme
}) => {
  const colorConfig = {
    blue: {
      iconBg: 'from-blue-500 to-blue-600',
      pulse: 'bg-blue-500',
      hover: 'group-hover:text-blue-600',
      timeColor: 'text-blue-600',
      statusBg: 'bg-blue-100 text-blue-800'
    },
    emerald: {
      iconBg: 'from-emerald-500 to-emerald-600',
      pulse: 'bg-emerald-500',
      hover: 'group-hover:text-emerald-600',
      timeColor: 'text-emerald-600',
      statusBg: 'bg-emerald-100 text-emerald-800'
    },
    amber: {
      iconBg: 'from-amber-500 to-amber-600',
      pulse: 'bg-amber-500',
      hover: 'group-hover:text-amber-600',
      timeColor: 'text-amber-600',
      statusBg: 'bg-amber-100 text-amber-800'
    },
    pink: {
      iconBg: 'from-pink-500 to-pink-600',
      pulse: 'bg-pink-500',
      hover: 'group-hover:text-pink-600',
      timeColor: 'text-pink-600',
      statusBg: 'bg-pink-100 text-pink-800'
    },
    red: {
      iconBg: 'from-red-500 to-red-600',
      pulse: 'bg-red-500',
      hover: 'group-hover:text-red-600',
      timeColor: 'text-red-600',
      statusBg: 'bg-red-100 text-red-800'
    }
  };

  const colors = colorConfig[colorScheme];

  return (
    <div className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-lg">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className={`w-12 h-12 bg-gradient-to-br ${colors.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className={`absolute -top-1 -right-1 w-4 h-4 ${colors.pulse} rounded-full animate-pulse`}></div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-base font-semibold text-gray-900 ${colors.hover} transition-colors`}>{title}</p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">{description}</span> • 
          <span className={`ml-1 font-medium ${colors.timeColor}`}>{timeAgo}</span>
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${colors.statusBg}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;
