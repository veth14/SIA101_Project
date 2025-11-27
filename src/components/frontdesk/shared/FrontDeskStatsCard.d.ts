import React from 'react';
interface FrontDeskStatsCardProps {
    title: string;
    value: number;
    icon: string;
    color: 'blue' | 'yellow' | 'green' | 'gray' | 'purple' | 'red';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}
declare const FrontDeskStatsCard: React.FC<FrontDeskStatsCardProps>;
export default FrontDeskStatsCard;
