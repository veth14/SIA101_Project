import React from 'react';
import StatsCard from './StatsCard';
import { WarningIcon, GroupUsersIcon, UsersIcon, CheckIcon } from '../shared/icons';

const StatsGrid: React.FC = () => {
  const statsData = [
    {
      title: "Open Tickets",
      value: 8,
      badge: "3 urgent",
      icon: <WarningIcon />,
      iconBg: 'bg-green-100'
    },
    {
      title: "On-Duty Staff",
      value: 12,
      badge: "Currently Active",
      icon: <GroupUsersIcon />,
      iconBg: 'bg-blue-100'
    },
    {
      title: "Total Staff",
      value: 2,
      badge: "+2 this month",
      icon: <UsersIcon />,
      iconBg: 'bg-orange-100'
    },
    {
      title: "Completed Today",
      value: 15,
      badge: "Tasks done",
      icon: <CheckIcon />,
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          badge={stat.badge}
          icon={stat.icon}
          iconBg={stat.iconBg}
          index={index}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
