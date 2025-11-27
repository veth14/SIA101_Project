import React from 'react';
interface AnalyticsTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}
declare const AnalyticsTabs: React.FC<AnalyticsTabsProps>;
export default AnalyticsTabs;
