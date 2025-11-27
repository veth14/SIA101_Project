import React from 'react';
interface LostFoundNavigationProps {
    activeTab: 'found' | 'lost';
    onTabChange: (tab: 'found' | 'lost') => void;
}
export declare const LostFoundNavigation: React.FC<LostFoundNavigationProps>;
export default LostFoundNavigation;
