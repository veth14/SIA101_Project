import React from 'react';
interface StatsCardProps {
    title: string;
    value: string | number;
    badge?: string;
    icon: React.ReactNode;
    iconBg: string;
    index: number;
}
declare const StatsCard: React.FC<StatsCardProps>;
export default StatsCard;
