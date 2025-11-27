import React from 'react';
interface ActivityItemProps {
    title: string;
    description: string;
    timeAgo: string;
    status: string;
    icon: React.ReactNode;
    colorScheme: 'blue' | 'emerald' | 'amber' | 'pink' | 'red';
}
declare const ActivityItem: React.FC<ActivityItemProps>;
export default ActivityItem;
