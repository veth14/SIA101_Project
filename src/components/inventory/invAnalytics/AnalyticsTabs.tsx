import React from 'react';

interface AnalyticsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'inventory', label: 'Inventory Analytics' },
    { id: 'procurement', label: 'Procurement Analytics' },
    { id: 'department', label: 'Room/Department Analytics' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6">
      <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-heritage-green to-heritage-green/90 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-heritage-green hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsTabs;