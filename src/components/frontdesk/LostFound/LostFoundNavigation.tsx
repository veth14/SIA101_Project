import React from 'react';
import SegmentedTabs from '../../shared/ui/SegmentedTabs';

interface LostFoundNavigationProps {
  activeTab: 'found' | 'lost';
  onTabChange: (tab: 'found' | 'lost') => void;
}

export const LostFoundNavigation: React.FC<LostFoundNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'found' as const, label: 'Found' },
    { id: 'lost' as const, label: 'Lost' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 flex justify-center">
        <SegmentedTabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(id) => onTabChange(id as typeof activeTab)}
          ariaLabel="Lost and Found tabs"
        />
      </div>
    </div>
  );
};

export default LostFoundNavigation;
