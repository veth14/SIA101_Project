import React from 'react';
interface GuestServicesNavigationProps {
    activeTab: 'feedback' | 'loyalty' | 'assistance';
    onTabChange: (tab: 'feedback' | 'loyalty' | 'assistance') => void;
}
export declare const GuestServicesNavigation: React.FC<GuestServicesNavigationProps>;
export {};
